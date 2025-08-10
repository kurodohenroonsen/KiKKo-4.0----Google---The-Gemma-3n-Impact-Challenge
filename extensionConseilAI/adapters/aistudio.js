// Content script — Google AI Studio adapter (LOGS MASSIFS) 🪵🪵🪵
//
// ✅ VERSION 7 : Remplacement de l'attente par un MutationObserver pour la réponse.
//  • C'est la méthode la plus fiable pour détecter l'ajout de nouveaux éléments au DOM.
//  • Le script attend l'apparition d'un nouveau `ms-chat-turn.model` contenant un `ms-prompt-chunk`.
//  • Conserve le double clic et le délai initial pour une robustesse maximale.

(() => {
  //////////////////////////////
  // 🔊 LOGGING — helpers
  //////////////////////////////
  const LOG_PREFIX = "✨ [AI-Council/AIStudio]";
  const ENABLE_LOG = true;

  function log(...a)   { if (ENABLE_LOG) console.log(LOG_PREFIX, ...a); }
  function info(...a)  { if (ENABLE_LOG) console.info(LOG_PREFIX, ...a); }
  function warn(...a)  { if (ENABLE_LOG) console.warn(LOG_PREFIX, ...a); }
  function error(...a) { if (ENABLE_LOG) console.error(LOG_PREFIX, ...a); }
  function debug(...a) { if (ENABLE_LOG) console.debug(LOG_PREFIX, ...a); }
  function j(obj) { try { return JSON.stringify(obj, null, 2); } catch { return String(obj); } }

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
  const SITE_ID    = "aistudio";
  const TIMEOUT_MS = 120_000;
  let lastSendController = null;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qs    = (sel, root = document) => root.querySelector(sel);
  const qsa   = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function isVisible(el) {
    if (!el) return false;
    if (el.offsetParent === null) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && s.opacity !== "0";
  }
  function dispatchInput(el) {
    try {
      el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch {}
  }
  function sendState(status) {
    debug("📡 sendState:", status);
    chrome.runtime.sendMessage({ type: "adapter:state", status }).catch(() => {});
  }

  //////////////////////////////
  // 🔎 Sélecteurs / repères (AI Studio)
  //////////////////////////////
  const SEND_BUTTON_CANDIDATES = [
    'footer run-button[aria-label="Run"]',
    'run-button[aria-label="Run"]',
    'button[aria-label="Run"]'
  ];

  function findEditor() {
    return qs('textarea[placeholder="Start typing a prompt"]');
  }

  function findSendButton(checkDisabled = true) {
    for (const selector of SEND_BUTTON_CANDIDATES) {
      const btn = qs(selector);
      if (btn && isVisible(btn)) {
        if (checkDisabled && btn.disabled) {
          continue;
        }
        debug(`✅ findSendButton: Trouvé via "${selector}"`);
        return btn;
      }
    }
    return null;
  }
  
  function isGenerating() {
    const btn = findSendButton(false);
    if (!btn) return true;
    return btn.disabled;
  }

  function findAllModelTurns() {
    return qsa('ms-chat-turn.model');
  }

  function lastModelTurn() {
    const turns = findAllModelTurns();
    return turns.length > 0 ? turns[turns.length - 1] : null;
  }
  
  function extractTextFromTurn(turnNode) {
    if (!turnNode) return "";
    const chunks = qsa('ms-prompt-chunk', turnNode);
    if (chunks.length === 0) {
      const content = qs('[data-turn-role="Model"]', turnNode) || turnNode;
      return content.textContent.trim();
    }
    const responseParts = [];
    for (const chunk of chunks) {
      if (chunk.querySelector('ms-thought-chunk')) {
        continue; 
      }
      responseParts.push(chunk.textContent.trim());
    }
    return responseParts.join('\n\n').trim();
  }

  //////////////////////////////
  // 🧪 Primitives
  //////////////////////////////
  
  async function setPrompt(text) {
    debug("✍️ setPrompt(len):", (text || "").length);
    const ed = findEditor();
    if (!ed) throw new Error("AI Studio: Editor textarea not found");
    
    const autosizeWrapper = ed.closest('ms-autosize-textarea');
    if (!autosizeWrapper) throw new Error("AI Studio: Autosize wrapper not found");

    ed.value = text;
    autosizeWrapper.dataset.value = text;
    dispatchInput(ed);
    
    info("✅ setPrompt: Textarea value and data-value updated.");
  }
  
  async function send() {
    sendState("sending");
    const baseline = lastModelTurn();
    
    let btn = findSendButton();
    if (!btn) throw new Error("AI Studio: Send button not found or disabled for the first click");
    
    info("🖱️ Performing first click...");
    btn.click();

    info("⏱️ Waiting 500ms before second click...");
    await sleep(1500);

    btn = findSendButton();
    if (btn) {
      info("🖱️ Performing second click...");
      btn.click();
    } else {
      warn("⚠️ Send button not available for second click (prompt likely sent on first try).");
    }
    
    const answerText = await waitForFinal(baseline);
    dumpAnswer(answerText);
    
    chrome.runtime.sendMessage({
      type: "adapter:finalAnswer",
      answer: { plainText: answerText }
    }).catch(() => {});
  }
  
  async function waitForFinal(baselineNode) {
    if (lastSendController) lastSendController.abort();
    lastSendController = new AbortController();
    const { signal } = lastSendController;
    const t0 = performance.now();
    
    // --- 1) Attendre l'apparition d'un nouveau tour de chat du modèle avec un MutationObserver ---
    const targetNode = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        observer.disconnect();
        reject(new Error("Timeout: No new message turn appeared after 20s."));
      }, 20000);

      const observer = new MutationObserver((mutations) => {
        const last = lastModelTurn();
        if (last && last !== baselineNode) {
          // On vérifie que le nouveau tour contient bien un début de réponse
          if (last.querySelector('ms-prompt-chunk')) {
            info(`🆕 New model turn detected: ${last.id}`);
            clearTimeout(timeout);
            observer.disconnect();
            resolve(last);
          }
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      info("👀 Observer is watching for a new model response...");
    });

    // --- 2) Attendre la fin de la génération ---
    await new Promise((resolve) => {
        const check = () => {
          if (signal.aborted) return resolve();
          if (performance.now() - t0 > TIMEOUT_MS) {
            warn("⚠️ Timeout waiting for generation to complete. Continuing anyway.");
            return resolve();
          }
          if (!isGenerating()) {
            info("✅ Generation complete: Send button is enabled.");
            return resolve();
          }
          setTimeout(check, 300);
        };
        info("⏳ Waiting for generation to finish...");
        check();
    });

    sendState("done");
    const finalTxt = extractTextFromTurn(targetNode);
    info("🏁 Réponse stabilisée. chars=", finalTxt.length);
    return finalTxt;
  }

  //////////////////////////////
  // 📬 Orchestrateur
  //////////////////////////////
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    debug("📥 onMessage:", j(msg));
    (async () => {
      if (msg?.type === "orchestrator:setAndSend") {
        dumpPrompt(msg.text, "orchestrator:setAndSend");
        try {
          await setPrompt(msg.text);
          info("⏱️ Waiting 1000ms for UI to enable send button...");
          await sleep(1000); // Délai confirmé par l'utilisateur
          await send();
          sendResponse?.({ ok: true });
        } catch (e) {
          error("💥 setAndSend error:", e?.message || e);
          sendResponse?.({ ok: false, error: String(e?.message || e) });
        }
        return;
      }
      // ... autres commandes ...
    })();
    return true; // async
  });

  //////////////////////////////
  // 👋 Handshake
  //////////////////////////////
  (function hello() {
    header("🧩 AI STUDIO ADAPTER INIT (v7 - MutationObserver)");
    chrome.runtime.sendMessage({
      type: "adapter:hello",
      site: SITE_ID,
      capabilities: {
        setAndSend: true,
      }
    }).then(() => { info("🤝 adapter:hello envoyé"); }).catch(() => {});
  })();

  info("✅ Adapter AI Studio (v7) chargé.");
})();