// Content script — ChatGPT adapter (LOGS MASSIFS) 🪵🪵🪵
//
// ✅ Inclus :
//  • setPrompt(text) • send() • waitForFinal(baseline)
//  • Détection d’un NOUVEAU message assistant
//  • Attente de la fin: texte stable + bouton “Stop generating” disparu (fallback si pas présent)
//  • NEW: orchestrator:extractContext → renvoie tout le contexte (user + assistant) en texte brut
//
// Messages entrants : orchestrator:setPrompt • orchestrator:send • orchestrator:setAndSend • orchestrator:extractContext

(() => {
  //////////////////////////////
  // 🔊 LOGGING — helpers
  //////////////////////////////
  const LOG_PREFIX = "🪐 [AI-Council/ChatGPT]";
  const ENABLE_LOG = true;

  function log(...a){ if (ENABLE_LOG) console.log(LOG_PREFIX, ...a); }
  function info(...a){ if (ENABLE_LOG) console.info(LOG_PREFIX, ...a); }
  function warn(...a){ if (ENABLE_LOG) console.warn(LOG_PREFIX, ...a); }
  function error(...a){ if (ENABLE_LOG) console.error(LOG_PREFIX, ...a); }
  function debug(...a){ if (ENABLE_LOG) console.debug(LOG_PREFIX, ...a); }
  function j(obj){ try { return JSON.stringify(obj, null, 2); } catch { return String(obj); } }

  function header(kind, extra = "") {
    const ts = new Date().toISOString();
    console.log(`${LOG_PREFIX} ${kind} ${extra} @${ts}`);
  }
  function dumpTextBlock(title, text) {
    console.log(`${LOG_PREFIX} ${title} (len=${(text||"").length})`);
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
  // ⚙️ Constantes & utils
  //////////////////////////////
  const SITE_ID    = "chatgpt";
  const QUIET_MS   = 1200;     // durée de stabilité du texte avant de considérer la réponse finale
  const TIMEOUT_MS = 120_000;  // certaines réponses sont longues

  let lastSendController = null;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const now   = () => performance.now();
  const qs    = (sel, root=document) => root.querySelector(sel);
  const qsa   = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function isVisible(el){
    if(!el) return false;
    const s = getComputedStyle(el);
    return s && s.visibility !== "hidden" && s.display !== "none";
  }
  function dispatchInput(el){
    try{
      el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }catch{}
  }
  function pressEnter(el){
    try{
      el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",which:13,keyCode:13,bubbles:true}));
      el.dispatchEvent(new KeyboardEvent("keypress",{key:"Enter",code:"Enter",which:13,keyCode:13,bubbles:true}));
      el.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",which:13,keyCode:13,bubbles:true}));
    }catch{}
  }
  function sendState(status){
    debug("📡 sendState:", status);
    chrome.runtime.sendMessage({ type:"adapter:state", status }).catch(()=>{});
  }

  //////////////////////////////
  // 🔎 Sélecteurs / repères (ChatGPT)
  //////////////////////////////

  // Éditeur de prompt
  function findEditor(){
    const candidates = [
      // UI récente
      'textarea[data-testid="textbox"]',
      'form textarea',
      // UI alternative / ancienne
      'textarea[aria-label*="Send a message"]',
      'div[data-testid="composer"] textarea',
      // fallback
      'textarea',
      '[contenteditable="true"][role="textbox"]'
    ];
    for (const sel of candidates){
      const el = qs(sel);
      if (el && isVisible(el)) { debug("🖊️ findEditor:", sel); return el; }
    }
    warn("⚠️ findEditor: aucun éditeur visible trouvé");
    return null;
  }

  // Bouton d’envoi
  function findSendButton(){
    const candidates = [
      'button[data-testid="send-button"]',
      'button[aria-label="Send message"]',
      'form button[type="submit"]',
      'button[aria-label*="Send"]',
    ];
    for (const sel of candidates){
      const el = qs(sel);
      if (el && isVisible(el) && !el.disabled) { debug("📨 findSendButton:", sel); return el; }
    }
    warn("⚠️ findSendButton: aucun bouton visible");
    return null;
  }

  // Bouton STOP pendant génération (“Stop generating”)
  function findStopButton(){
    const candidates = [
      'button[data-testid="stop-button"]',
      'button[aria-label*="Stop"]',
      'button[aria-label*="Interrompre"]',
      'button[aria-label*="Arrêter"]',
    ];
    for (const sel of candidates){
      const el = qs(sel);
      if (el && isVisible(el)) return el;
    }
    return null;
  }
  function describeStopBtn(btn){
    if(!btn) return "absent";
    const lab = btn.getAttribute("aria-label") || "";
    const cls = btn.className || "";
    return `present(label="${lab}" class="${cls}")`;
  }

  // Conteneur principal de chat
  function chatContainer(){
    const sels = [
      // wrapper messages
      '[data-testid="conversation-turns"]',
      'main',
      '[data-theme]',
      'body'
    ];
    for (const sel of sels){
      const el = qs(sel);
      if (el) return el;
    }
    return document.body || document.documentElement;
  }

  // Messages assistant (réponses)
  function findAllAssistantNodes(){
    const root = chatContainer();
    const sels = [
      '[data-message-author-role="assistant"]',
      '[data-testid="conversation-turn"] [data-message-author-role="assistant"]',
      // fallback général
      'article:has(.markdown)'
    ];
    let nodes = [];
    for (const sel of sels) nodes = nodes.concat(qsa(sel, root));
    nodes = nodes.filter(isVisible);
    // dédoublonnage / ordre DOM
    const seen = new Set(), ordered = [];
    for (const n of nodes){ if(!seen.has(n)){ seen.add(n); ordered.push(n); } }
    return ordered;
  }
  function lastAssistantNode(){
    const list = findAllAssistantNodes();
    return list.length ? list[list.length - 1] : null;
  }

  // Messages user
  function findAllUserNodes(){
    const root = chatContainer();
    const sels = [
      '[data-message-author-role="user"]',
      '[data-testid="conversation-turn"] [data-message-author-role="user"]'
    ];
    let nodes = [];
    for (const sel of sels) nodes = nodes.concat(qsa(sel, root));
    nodes = nodes.filter(isVisible);
    const seen = new Set(), ordered = [];
    for (const n of nodes){ if(!seen.has(n)){ seen.add(n); ordered.push(n); } }
    return ordered;
  }

  // Extraction de texte (assistant / user)
  function extractTextFromAssistant(node){
    if(!node) return "";
    const clone = node.cloneNode(true);
    // supprimer éléments interactifs / non textuels
    qsa('button,nav,menu,form,input,textarea,svg,style,script,link,meta,[role="button"]', clone).forEach(n=>n.remove());
    // markdown (classique) si présent
    const md = clone.querySelector?.('.markdown');
    const txt = (md ? md.textContent : clone.textContent) || "";
    return txt.trim();
  }
  function extractTextFromUser(node){
    if(!node) return "";
    const clone = node.cloneNode(true);
    qsa('button,nav,menu,form,input,textarea,svg,style,script,link,meta,[role="button"]', clone).forEach(n=>n.remove());
    const txt = (clone.textContent || "");
    return txt.trim();
  }

  function nodeSig(n){
    if(!n) return "(null)";
    return n.id ? `#${n.id}` : `${n.tagName.toLowerCase()}@${(n.className||"").trim()}`;
  }

  //////////////////////////////
  // 🧪 Primitives
  //////////////////////////////
  async function setPrompt(text){
    debug("✍️ setPrompt(len):", (text||"").length);
    const ed = findEditor();
    if(!ed) throw new Error("Editor not found");

    if (ed.tagName === "TEXTAREA"){
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

  async function send(){
    sendState("sending");

    // 1) Baseline: dernier message assistant visible
    const baseline = lastAssistantNode();
    header("⏳ ATTENTE NOUVEAU MESSAGE ASSISTANT", `baseline=${nodeSig(baseline)}`);

    // 2) Envoi
    const btn = findSendButton();
    const ed  = findEditor();
    if (btn){ btn.click(); debug("🖱️ send: click send-button"); }
    else if (ed){ pressEnter(ed); debug("⏎ send: simulate Enter on editor"); }
    else { throw new Error("No send method available"); }

    // 3) Attente de la réponse complète
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
    }).catch(()=>{});
  }

  // Attendre: nouveau message assistant + stabilité du texte + stop disparu
  async function waitForFinal(baselineNode){
    if (lastSendController) lastSendController.abort();
    lastSendController = new AbortController();
    const { signal } = lastSendController;

    const t0 = now();

    // --- 1) Attendre NOUVEAU nœud assistant
    const targetNode = await waitForNewAssistant(baselineNode, signal);
    header("🆕 NOUVEAU MESSAGE ASSISTANT DÉTECTÉ", nodeSig(targetNode));

    // --- 2) Observer CE nœud jusqu’à stabilité + stop disparu
    let lastHash   = hashText(extractTextFromAssistant(targetNode));
    let lastChange = now();

    const nodeObs = new MutationObserver(() => {
      const txt = extractTextFromAssistant(targetNode);
      const h = hashText(txt);
      if (h !== lastHash) {
        lastHash = h;
        lastChange = now();
      }
    });
    nodeObs.observe(targetNode, { subtree: true, childList: true, characterData: true });

    const root = chatContainer();
    const uiObs = new MutationObserver(() => {});
    uiObs.observe(root, { subtree: true, childList: true, characterData: true });

    header("⛔ ATTENTE STOP DISPARU", "Le bouton 'Stop generating' doit disparaître.");

    let prevStopPresent = null;

    try {
      for(;;){
        if (signal?.aborted) throw new Error("Aborted");
        const stopBtn = findStopButton();
        const stopPresent = !!stopBtn;
        const quiet = now() - lastChange;
        const textReady = quiet >= QUIET_MS;

        if (prevStopPresent !== stopPresent){
          console.log(`${LOG_PREFIX} ⏹️ stopBtn CHANGED → ${stopPresent ? describeStopBtn(stopBtn) : "absent"}`);
          prevStopPresent = stopPresent;
        }
        debug(`⏱️ quiet=${Math.round(quiet)}ms textReady=${textReady} stopPresent=${stopPresent}`);

        // Condition principale: texte stable ET pas de stop
        if (textReady && !stopPresent){
          info("✅ Condition atteinte: texte STABLE + stop DISPARU");
          break;
        }

        // Fallback: certains UIs n’affichent pas 'stop' -> on se contente de texte stable pendant plus longtemps
        if (textReady && !findStopButton()){
          info("✅ Fallback: texte STABLE (pas de bouton stop détecté)");
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
    const finalTxt = extractTextFromAssistant(targetNode);
    info("🏁 Réponse stabilisée. chars=", finalTxt.length);
    return finalTxt;
  }

  async function waitForNewAssistant(baselineNode, signal){
    const root = chatContainer();
    let found = null;

    // Cas rapide
    const last = lastAssistantNode();
    if (last && last !== baselineNode){
      console.log(`${LOG_PREFIX} ⚡️ NEW assistant déjà présent: ${nodeSig(last)}`);
      return last;
    }

    console.log(`${LOG_PREFIX} 🧿 WAIT NEW assistant message…`);
    await new Promise((resolve, reject) => {
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations){
          for (const n of m.addedNodes){
            if (!(n instanceof HTMLElement)) continue;

            if (n.matches?.('[data-message-author-role="assistant"]')){
              if (n !== baselineNode){ found = n; console.log(`${LOG_PREFIX} 🆕 NEW assistant (direct): ${nodeSig(n)}`); obs.disconnect(); resolve(true); return; }
            }
            const inner = n.querySelector?.('[data-message-author-role="assistant"]');
            if (inner && inner !== baselineNode){ found = inner; console.log(`${LOG_PREFIX} 🆕 NEW assistant (desc): ${nodeSig(inner)}`); obs.disconnect(); resolve(true); return; }

            // Fallback: article markdown
            if (n.matches?.('article:has(.markdown)')){ found = n; console.log(`${LOG_PREFIX} 🆕 NEW article(markdown)`); obs.disconnect(); resolve(true); return; }
            const art = n.querySelector?.('article .markdown, article');
            if (art && art.closest('[data-message-author-role="assistant"]')){ found = art.closest('[data-message-author-role="assistant"]'); obs.disconnect(); resolve(true); return; }
          }
        }
      });
      obs.observe(root, { subtree:true, childList:true });

      const tStart = now();
      (async () => {
        try{
          while(!found){
            if (signal?.aborted){ obs.disconnect(); reject(new Error("Aborted")); return; }
            if (now() - tStart > 20_000){ obs.disconnect(); reject(new Error("Timeout new assistant message")); return; }
            await sleep(100);
          }
        }catch(e){ obs.disconnect(); reject(e); }
      })();
    });

    return found || lastAssistantNode();
  }

  //////////////////////////////
  // 🧾 EXTRACT CONTEXT (user + assistant)
  //////////////////////////////
  function buildTranscript(){
    const root = chatContainer();

    // Approche 1 : se baser sur les "conversation turns"
    let turns = qsa('[data-testid="conversation-turn"]', root).filter(isVisible);

    const lines = [];

    if (turns.length > 0){
      header("📚 EXTRACT CONTEXT via conversation-turn", `count=${turns.length}`);
      for (const t of turns){
        const user = t.querySelector?.('[data-message-author-role="user"]');
        const asst = t.querySelector?.('[data-message-author-role="assistant"]');
        const uTxt = extractTextFromUser(user);
        const aTxt = extractTextFromAssistant(asst);
        if (uTxt) lines.push(`[USER]\n${uTxt}`);
        if (aTxt) lines.push(`[ASSISTANT]\n${aTxt}`);
      }
    } else {
      // Approche 2 : balayage DOM linéaire
      header("📚 EXTRACT CONTEXT via balayage DOM", "");
      let linear = []
        .concat(findAllUserNodes().map(n => ({kind:"user", node:n})))
        .concat(findAllAssistantNodes().map(n => ({kind:"assistant", node:n})));
      linear.sort((a,b)=>{
        if (a.node === b.node) return 0;
        const pos = a.node.compareDocumentPosition(b.node);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });

      for (const it of linear){
        if (it.kind === "user"){
          const t = extractTextFromUser(it.node);
          if (t) lines.push(`[USER]\n${t}`);
        } else {
          const t = extractTextFromAssistant(it.node);
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
  function hashText(s){
    let h = 0, i = 0;
    while (i < s.length){ h = (h * 31 + s.charCodeAt(i++)) | 0; }
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
  (function hello(){
    header("🧩 CHATGPT ADAPTER INIT");
    chrome.runtime.sendMessage({
      type: "adapter:hello",
      site: SITE_ID,
      capabilities: {
        setPrompt: true,
        send: true,
        waitForFinal: true,
        extractAnswer: true,
        extractContext: true,
      }
    }).then(()=>{ info("🤝 adapter:hello envoyé"); }).catch(()=>{});
  })();

  info("✅ Adapter ChatGPT chargé (NEW assistant + Stop disparu + extractContext).");
})();
