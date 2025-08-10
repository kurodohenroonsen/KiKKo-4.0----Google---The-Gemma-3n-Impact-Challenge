// Content script — Google Gemini adapter (LOGS MASSIFS) 🪵🪵🪵
//
// ✅ Ce fichier inclut :
//  • setPrompt(text) • send() • waitForFinal(baseline)
//  • Détection du NOUVEAU <message-content>, attente MICRO actif + STOP disparu
//  • NEW: orchestrator:extractContext → renvoie tout le contexte (user + assistant) en texte brut
//
// Messages entrants : orchestrator:setPrompt • orchestrator:send • orchestrator:setAndSend • orchestrator:extractContext

(() => {
  //////////////////////////////
  // 🔊 LOGGING — helpers
  //////////////////////////////
  const LOG_PREFIX = "🪐 [AI-Council/Gemini]";
  const ENABLE_LOG = true;

  function log(...a)   { if (ENABLE_LOG) console.log(LOG_PREFIX, ...a); }
  function info(...a)  { if (ENABLE_LOG) console.info(LOG_PREFIX, ...a); }
  function warn(...a)  { if (ENABLE_LOG) console.warn(LOG_PREFIX, ...a); }
  function error(...a) { if (ENABLE_LOG) console.error(LOG_PREFIX, ...a); }
  function debug(...a) { if (ENABLE_LOG) console.debug(LOG_PREFIX, ...a); }
  function j(obj) { try { return JSON.stringify(obj, null, 2); } catch { return String(obj); } }

  // Dumpers plats (copiables)
  function header(kind, extra = "") {
    const ts = new Date().toISOString();
    console.log(`${LOG_PREFIX} ${kind} ${extra} @${ts}`);
  }
  function dumpTextBlock(title, text) {
    console.log(`${LOG_PREFIX} ${title} (len=${(text || "").length})`);
    console.log(text || "");
  }
  function dumpPrompt(text, origin) {
    header("📝 PROMPT→", `origin=${origin}`);
    dumpTextBlock("📤 PROMPT BODY", text || "");
  }
  function dumpAnswer(text) {
    header("💬 ANSWER←", "origin=waitForFinal");
    dumpTextBlock("📥 ANSWER BODY", text || "");
  }

  //////////////////////////////
  // ⚙️ Constantes & état
  //////////////////////////////
  const SITE_ID    = "gemini";
  const QUIET_MS   = 1200;
  const TIMEOUT_MS = 90_000;
  let lastSendController = null;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const now   = () => performance.now();
  const qs    = (sel, root = document) => root.querySelector(sel);
  const qsa   = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function isVisible(el) {
    if (!el) return false;
    const s = getComputedStyle(el);
    return s && s.visibility !== "hidden" && s.display !== "none";
  }
  function dispatchInput(el) {
    try {
      el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch {}
  }
  function pressEnter(el) {
    try {
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keyup",   { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true }));
    } catch {}
  }
  function sendState(status) {
    debug("📡 sendState:", status);
    chrome.runtime.sendMessage({ type: "adapter:state", status }).catch(() => {});
  }

  //////////////////////////////
  // 🔎 Sélecteurs / repères
  //////////////////////////////

  function findEditor() {
    const candidates = [
      'rich-textarea .ql-editor[contenteditable="true"]',
      '[contenteditable="true"][role="textbox"][aria-label*="Enter a prompt"]',
      '[contenteditable="true"][role="textbox"]',
      '.ql-editor[contenteditable="true"]',
      'textarea[aria-label*="Enter a prompt"]',
      'textarea',
    ];
    for (const sel of candidates) {
      const el = qs(sel);
      if (el && isVisible(el)) { debug("🖊️ findEditor:", sel); return el; }
    }
    warn("⚠️ findEditor: aucun éditeur visible trouvé");
    return null;
  }

  function findSendButton() {
    const candidates = [
      'button[aria-label="Send message"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="Envoyer"]',
      'button[data-test-id="send-button"]',
      'form button[type="submit"]',
    ];
    for (const sel of candidates) {
      const el = qs(sel);
      if (el && isVisible(el) && !el.disabled) { debug("📨 findSendButton:", sel); return el; }
    }
    warn("⚠️ findSendButton: aucun bouton visible");
    return null;
  }

  // Bouton STOP (pendant génération)
  function findStopButton() {
    const selectors = [
      'button[aria-label*="Stop"]',
      'button[aria-label*="Arrêter"]',
      'button[data-test-id="stop-button"]',
      'button.stop',
      '.blue-circle.stop-icon', // icône à l'intérieur du bouton
    ];
    for (const sel of selectors) {
      const node = qs(sel);
      if (node && isVisible(node)) {
        if (node.tagName.toLowerCase() !== "button") {
          const btn = node.closest("button");
          return btn || node;
        }
        return node;
      }
    }
    return null;
  }
  function describeStopBtn(btn) {
    if (!btn) return "none";
    const lab = btn.getAttribute("aria-label") || "";
    const cls = btn.className || "";
    return `present(label="${lab}" class="${cls}")`;
  }

  // Bouton MICRO (doit redevenir actif)
  function findMicButton() {
    const candidates = [
      'button.speech_dictation_mic_button',
      'button[data-node-type="speech_dictation_mic_button"]',
      'button[aria-label*="Microphone"]',
      'button[aria-label*="Micro"]'
    ];
    for (const sel of candidates) {
      const el = qs(sel);
      if (el && isVisible(el)) return el;
    }
    return null;
  }
  function isButtonDisabled(el) {
    if (!el) return true;
    const attr = el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
    const cls  = /\b(mat-mdc-button-disabled|mdc-button--disabled|mdc-icon-button--disabled)\b/.test(el.className || "");
    return !!(attr || cls);
  }
  function isMicActive() {
    const mic = findMicButton();
    const active = !!(mic && !isButtonDisabled(mic));
    return active;
  }

  function chatContainer() {
    const sels = [
      '[data-test-id="chat-window"]',
      '[data-testid="chat-window"]',
      'chat-window',
      'main[role="main"]',
      'body',
    ];
    for (const sel of sels) {
      const el = qs(sel);
      if (el) return el;
    }
    return document.body || document.documentElement;
  }

  // ---- <message-content> helpers (assistant)
  function findAllMessageContents() {
    const container = chatContainer();
    const sels = [
      'message-content.model-response-text',
      'message-content[id^="message-content-id-"]',
      '.response-content message-content',
      'message-content'
    ];
    let nodes = [];
    for (const sel of sels) nodes = nodes.concat(qsa(sel, container));
    nodes = nodes.filter(isVisible);
    const seen = new Set(); const ordered = [];
    for (const n of nodes) { if (!seen.has(n)) { seen.add(n); ordered.push(n); } }
    return ordered;
  }
  function lastMessageContentNode() {
    const list = findAllMessageContents();
    return list.length ? list[list.length - 1] : null;
  }
  function nodeSig(n) {
    if (!n) return "(null)";
    return n.id ? `#${n.id}` : `${n.tagName.toLowerCase()}@${(n.className||"").trim()}`;
  }
  function extractTextFromMessageContent(node) {
    if (!node) return "";
    const clone = node.cloneNode(true);
    qsa('button, nav, menu, form, input, textarea, svg, style, script, link, meta, [role="button"]', clone).forEach(n => n.remove());
    const md = qs('[id^="model-response-message-content"]', clone);
    const txt = (md ? md.textContent : clone.textContent) || "";
    return txt.trim();
  }

  // ---- <user-query> helpers (utilisateur)
  function findAllUserQueries() {
    const container = chatContainer();
    const sels = [
      'user-query',
      '.user-query-container',
      '[data-test-id="user-query"]',
    ];
    let nodes = [];
    for (const sel of sels) nodes = nodes.concat(qsa(sel, container));
    nodes = nodes.filter(isVisible);
    const seen = new Set(); const ordered = [];
    for (const n of nodes) { if (!seen.has(n)) { seen.add(n); ordered.push(n); } }
    return ordered;
  }
  function extractTextFromUserQuery(node) {
    if (!node) return "";
    const clone = node.cloneNode(true);
    qsa('button, nav, menu, form, input, textarea, svg, style, script, link, meta, [role="button"]', clone).forEach(n => n.remove());
    // ciblage du texte typique
    const cand = qs('.query-text', clone) || qs('[class*="query-text"]', clone);
    const txt = (cand ? cand.textContent : clone.textContent) || "";
    return txt.trim();
  }

  //////////////////////////////
  // 🧪 Primitives
  //////////////////////////////

  async function setPrompt(text) {
    debug("✍️ setPrompt(len):", (text || "").length);
    const ed = findEditor();
    if (!ed) throw new Error("Editor not found");
    if (ed.tagName === "TEXTAREA") {
      ed.focus(); ed.value = text; dispatchInput(ed);
      info("✅ setPrompt via <textarea>");
    } else {
      ed.focus();
      try { ed.innerHTML = ""; ed.appendChild(document.createTextNode(text)); }
      catch { ed.textContent = text; }
      dispatchInput(ed);
      info("✅ setPrompt via [contenteditable]");
    }
    await sleep(60);
  }

  async function send() {
    sendState("sending");

    // 1) Baseline avant envoi
    const baseline = lastMessageContentNode();
    header("⏳ ATTENTE NOUVEAU <message-content>", `baseline=${nodeSig(baseline)}`);

    // 2) Envoi
    const btn = findSendButton();
    const ed  = findEditor();
    if (btn)      { btn.click();   debug("🖱️ send: click send-button"); }
    else if (ed)  { pressEnter(ed); debug("⏎ send: simulate Enter on editor"); }
    else          { throw new Error("No send method available"); }

    // 3) Attendre fin sur le NOUVEAU <message-content>
    const answer = await waitForFinal(baseline);
    if (!answer) throw new Error("No answer captured");

    dumpAnswer(answer);
    chrome.runtime.sendMessage({
      type: "adapter:finalAnswer",
      answer: {
        plainText: answer,
        markdown: undefined,
        html: undefined,
        meta: { site: SITE_ID, tabId: -1, ts: Date.now() }
      }
    }).catch(() => {});
  }

  // Attente: capte le NOUVEAU <message-content>, puis
  // - log qu’on attend Micro ACTIF + Stop DISPARU
  // - on valide quand texte stable + micro actif + stop disparu (ou fallback)
  async function waitForFinal(baselineNode) {
    if (lastSendController) lastSendController.abort();
    lastSendController = new AbortController();
    const { signal } = lastSendController;

    const t0 = now();

    // --- 1) Attendre la création d'un NOUVEAU <message-content> ---
    const targetNode = await waitForNewMessageContent(baselineNode, signal);
    header("🆕 NOUVEAU <message-content> DÉTECTÉ", nodeSig(targetNode));

    // --- 2) Observer CE nœud jusqu'à stabilité + micro actif + stop disparu ---
    let lastHash   = hashText(extractTextFromMessageContent(targetNode));
    let lastChange = now();

    const nodeObs = new MutationObserver(() => {
      const txt = extractTextFromMessageContent(targetNode);
      const h = hashText(txt);
      if (h !== lastHash) {
        lastHash = h;
        lastChange = now();
      }
    });
    nodeObs.observe(targetNode, { subtree: true, childList: true, characterData: true });

    const root = chatContainer();
    const uiObs = new MutationObserver(() => {}); // garder une ref pour mutations UI
    uiObs.observe(root, { subtree: true, childList: true, characterData: true });

    header("🎙️ ATTENTE MICRO ACTIF", "Le bouton micro doit redevenir cliquable.");
    header("⛔ ATTENTE STOP DISPARU", "Le bouton 'Interrompre la réponse' doit disparaître.");

    let prevMic = null;
    let prevStopPresent = null;

    try {
      for (;;) {
        if (signal?.aborted) throw new Error("Aborted");

        const stopBtn   = findStopButton();
        const stopPresent = !!stopBtn;
        const micActive = isMicActive();
        const quiet     = now() - lastChange;
        const textReady = quiet >= QUIET_MS;

        if (prevMic !== micActive) {
          console.log(`${LOG_PREFIX} 🎤 micActive CHANGED → ${micActive}`);
          prevMic = micActive;
        }
        if (prevStopPresent !== stopPresent) {
          console.log(`${LOG_PREFIX} ⏹️ stopBtn CHANGED → ${stopPresent ? describeStopBtn(stopBtn) : "absent"}`);
          prevStopPresent = stopPresent;
        }
        debug(`⏱️ quiet=${Math.round(quiet)}ms textReady=${textReady} micActive=${micActive} stopPresent=${stopPresent}`);

        if (textReady && micActive && !stopPresent) {
          info("✅ Condition atteinte: texte STABLE + micro ACTIF + stop DISPARU");
          break;
        }
        if (textReady && !stopPresent && !findMicButton()) {
          info("✅ Fallback: texte STABLE + stop DISPARU (micro introuvable)");
          break;
        }

        if (now() - t0 > TIMEOUT_MS) throw new Error("Timeout waitForFinal");
        await sleep(250);
      }
    } finally {
      nodeObs.disconnect();
      uiObs.disconnect();
    }

    sendState("done");
    const finalTxt = extractTextFromMessageContent(targetNode);
    info("🏁 Réponse stabilisée. chars=", finalTxt.length);
    return finalTxt;
  }

  // Attend qu'un NOUVEAU <message-content> (différent du baseline) apparaisse
  async function waitForNewMessageContent(baselineNode, signal) {
    const root = chatContainer();
    let found = null;

    // Cas ultra-rapide
    const last = lastMessageContentNode();
    if (last && last !== baselineNode) {
      console.log(`${LOG_PREFIX} ⚡️ NEW <message-content> déjà présent: ${nodeSig(last)}`);
      return last;
    }

    // Observer la création
    console.log(`${LOG_PREFIX} 🧿 WAIT NEW <message-content>…`);
    await new Promise((resolve, reject) => {
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of m.addedNodes) {
            if (!(n instanceof HTMLElement)) continue;
            if (n.tagName && n.tagName.toLowerCase() === "message-content") {
              if (n !== baselineNode) {
                found = n;
                console.log(`${LOG_PREFIX} 🆕 NEW <message-content> (direct): ${nodeSig(n)}`);
                obs.disconnect(); resolve(true); return;
              }
            }
            const mc = n.querySelector?.("message-content");
            if (mc && mc !== baselineNode) {
              found = mc;
              console.log(`${LOG_PREFIX} 🆕 NEW <message-content> (desc): ${nodeSig(mc)}`);
              obs.disconnect(); resolve(true); return;
            }
          }
        }
      });
      obs.observe(root, { subtree: true, childList: true });

      const tStart = now();
      (async () => {
        try {
          while (!found) {
            if (signal?.aborted) { obs.disconnect(); reject(new Error("Aborted")); return; }
            if (now() - tStart > 20_000) { obs.disconnect(); reject(new Error("Timeout new message-content")); return; }
            await sleep(100);
          }
        } catch (e) {
          obs.disconnect(); reject(e);
        }
      })();
    });

    return found || lastMessageContentNode();
  }

  //////////////////////////////
  // 🧾 EXTRACT CONTEXT (user + assistant)
  //////////////////////////////

  // Construit un transcript en texte brut :
  // [USER] ...
  // [ASSISTANT] ...
  // (ordre DOM, en s'appuyant sur .conversation-container si présent)
  function buildTranscript() {
    const root = chatContainer();

    // 1) Stratégie préférée: chaque "conversation-container" contient (user-query puis model-response)
    let convs = qsa('.conversation-container', root).filter(isVisible);

    // 2) Fallback si non dispo: on récupère tous les nodes pertinents dans l'ordre DOM
    let linearNodes = [];
    if (convs.length === 0) {
      linearNodes = []
        .concat(findAllUserQueries().map(n => ({ kind: "user", node: n })))
        .concat(findAllMessageContents().map(n => ({ kind: "assistant", node: n })));
      // Trie par position dans le DOM
      linearNodes.sort((a, b) => {
        if (a.node === b.node) return 0;
        const ia = a.node.compareDocumentPosition(b.node);
        if (ia & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (ia & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
    }

    const lines = [];
    if (convs.length > 0) {
      header("📚 EXTRACT CONTEXT via conversation-container", `count=${convs.length}`);
      for (const c of convs) {
        const user = c.querySelector?.('user-query, .user-query-container');
        const ans  = c.querySelector?.('message-content');
        const uTxt = extractTextFromUserQuery(user);
        const aTxt = extractTextFromMessageContent(ans);
        if (uTxt) lines.push(`[USER]\n${uTxt}`);
        if (aTxt) lines.push(`[ASSISTANT]\n${aTxt}`);
      }
    } else {
      header("📚 EXTRACT CONTEXT via balayage DOM", `nodes=${linearNodes.length}`);
      for (const it of linearNodes) {
        if (it.kind === "user") {
          const t = extractTextFromUserQuery(it.node);
          if (t) lines.push(`[USER]\n${t}`);
        } else {
          const t = extractTextFromMessageContent(it.node);
          if (t) lines.push(`[ASSISTANT]\n${t}`);
        }
      }
    }

    const transcript = lines.join("\n\n");
    dumpTextBlock("🧾 TRANSCRIPT (user+assistant)", transcript);
    return transcript;
  }

  //////////////////////////////
  // 🧩 Helpers avancés
  //////////////////////////////
  function hashText(s) {
    let h = 0, i = 0;
    while (i < s.length) { h = (h * 31 + s.charCodeAt(i++)) | 0; }
    return h >>> 0;
  }

  //////////////////////////////
  // 📬 Orchestrateur
  //////////////////////////////
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    debug("📥 onMessage:", j(msg));
    (async () => {
      if (msg?.type === "orchestrator:setPrompt") {
        const text = String(msg.text || "");
        dumpPrompt(text, "orchestrator:setPrompt");
        try { await setPrompt(text); sendResponse?.({ ok: true }); }
        catch (e) { error("💥 setPrompt error:", e?.message || e); sendResponse?.({ ok: false, error: String(e?.message || e) }); }
        return;
      }

      if (msg?.type === "orchestrator:send") {
        try { await send(); sendResponse?.({ ok: true }); }
        catch (e) { error("💥 send() error:", e?.message || e); sendResponse?.({ ok: false, error: String(e?.message || e) }); }
        return;
      }

      if (msg?.type === "orchestrator:setAndSend") {
        const text = String(msg.text || "");
        dumpPrompt(text, "orchestrator:setAndSend");
        try { await setPrompt(text); await sleep(80); await send(); sendResponse?.({ ok: true }); }
        catch (e) { error("💥 setAndSend error:", e?.message || e); sendResponse?.({ ok: false, error: String(e?.message || e) }); }
        return;
      }

      // 🔥 NEW: extraction de tout le contexte (user + assistant)
      if (msg?.type === "orchestrator:extractContext") {
        try {
          header("🧾 EXTRACT CONTEXT — REQUEST");
          const transcript = buildTranscript();
          const ok = typeof transcript === "string" && transcript.length > 0;
          info(`✅ extractContext: ${ok ? transcript.length + " chars" : "vide"}`);
          sendResponse?.({ ok, context: transcript || "" });
        } catch (e) {
          error("💥 extractContext error:", e?.message || e);
          sendResponse?.({ ok: false, error: String(e?.message || e) });
        }
        return;
      }
    })();
    return true; // async
  });

  //////////////////////////////
  // 👋 Handshake
  //////////////////////////////
  (function hello() {
    header("🧩 GEMINI ADAPTER INIT");
    chrome.runtime.sendMessage({
      type: "adapter:hello",
      site: SITE_ID,
      capabilities: {
        setPrompt: true,
        send: true,
        waitForFinal: true,
        extractAnswer: true,
        extractContext: true, // 👈 NEW (pour information)
      }
    }).then(() => { info("🤝 adapter:hello envoyé"); }).catch(() => {});
  })();

  info("✅ Adapter Gemini chargé (NEW <message-content> + Micro actif + Stop disparu + extractContext).");
})();
