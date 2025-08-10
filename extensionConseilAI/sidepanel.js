// Side Panel UI logic — AI Council Orchestrator (avec LOGS MASSIFS) 🪵🪵🪵
// MàJ: ajout du bouton "📄 Copier contexte du tab" qui récupère TOUT le contexte
//       (tous les messages assistant) de l’onglet sélectionné, via background → adapter.

//////////////////////////////
// 🔊 LOGGING — helpers
//////////////////////////////

const LOG_PREFIX = "🧭 [AI-Council/Panel]";
const ENABLE_LOG = true;

function j(obj) { try { return JSON.stringify(obj, null, 2); } catch { return String(obj); } }
function log(...a)   { if (ENABLE_LOG) console.log(LOG_PREFIX, ...a); }
function info(...a)  { if (ENABLE_LOG) console.info(LOG_PREFIX, ...a); }
function warn(...a)  { if (ENABLE_LOG) console.warn(LOG_PREFIX, ...a); }
function error(...a) { if (ENABLE_LOG) console.error(LOG_PREFIX, ...a); }
function debug(...a) { if (ENABLE_LOG) console.debug(LOG_PREFIX, ...a); }
// Dumpers “plats”
function dumpHeader(kind, extra = "") { const ts = new Date().toISOString(); console.log(`${LOG_PREFIX} ${kind} ${extra} @${ts}`); }
function dumpTextBlock(title, text) { console.log(`${LOG_PREFIX} ${title} (len=${(text || "").length})`); console.log(text || ""); }
function dumpPrompt(where, text) { dumpHeader("📝 PROMPT→", `dest=${where}`); dumpTextBlock("📤 PROMPT BODY", text || ""); }
function dumpAnswer(from, text) { dumpHeader("💬 ANSWER←", `from=${from}`); dumpTextBlock("📥 ANSWER BODY", text || ""); }

//////////////////////////////
// 🔧 DOM refs
//////////////////////////////

const els = {
  refreshBtn: document.getElementById("refreshBtn"),
  promptInput: document.getElementById("promptInput"),
  sendToFirstBtn: document.getElementById("sendToFirstBtn"),
  autoMode: document.getElementById("autoMode"),

  agentList: document.getElementById("agentList"),
  agentItemTpl: document.getElementById("agentItemTpl"),
  emptyAgents: document.getElementById("emptyAgents"),

  answerPane: document.getElementById("answerPane"),
  answerFrom: document.getElementById("answerFrom"),
  answerText: document.getElementById("answerText"),
  routeSelect: document.getElementById("routeSelect"),
  routeSendBtn: document.getElementById("routeSendBtn"),
  copyBtn: document.getElementById("copyBtn"),
  copyContextBtn: document.getElementById("copyContextBtn"), // 🔥 nouveau

  eventLog: document.getElementById("eventLog"),
};

//////////////////////////////
// 🧠 STATE
//////////////////////////////

const STATE = {
  agents: /** @type {Array<Agent>} */([]),
  order: /** @type {Array<number>} */([]), // tabIds
  lastAnswer: /** @type {AnswerPayload|null} */(null),
  autoMode: false,
};

const STORAGE_KEYS = {
  AUTO: "aicouncil_auto_mode_v1",
};

// ----- Types (doc)
/**
 * @typedef {Object} Agent
 * @property {number} tabId
 * @property {string} site
 * @property {string} url
 * @property {string} title
 * @property {string} icon
 * @property {string} status
 * @property {Object} capabilities
 * @property {number} lastSeen
 */

/**
 * @typedef {Object} AnswerPayload
 * @property {string=} plainText
 * @property {string=} markdown
 * @property {string=} html
 * @property {{site:string, tabId:number, ts?:number}} meta
 */

//////////////////////////////
// 🚀 INIT
//////////////////////////////

(async function init() {
  dumpHeader("🧰 PANEL INIT");
  attachUI();
  await restoreAutoMode();
  await requestAgentsOnce();

  chrome.runtime.onMessage.addListener((msg) => {
    debug("📥 runtime.onMessage:", j({ type: msg?.type }));

    if (msg?.type === "agents:updated") {
      STATE.agents = msg.agents || [];
      STATE.order = msg.order || [];
      info(`🔄 agents:updated count=${STATE.agents.length} order=${STATE.order.join("→")}`);
      renderAgents();
      refreshRouteSelect();
      return;
    }

    if (msg?.type === "answer:received") {
      const from = findAgent(msg.fromTabId);
      const answer = /** @type {AnswerPayload} */(msg.answer || {});
      const originSite = from ? displayName(from) : `tab=${msg.fromTabId}`;
      const text = pickText(answer);
      dumpAnswer(originSite, text);
      if (from) {
        answer.meta = answer.meta || { site: from.site, tabId: from.tabId, ts: Date.now() };
      }
      onAnswerReceived(from, answer);
      return;
    }
  });

  info("✅ PANEL READY");
})();

//////////////////////////////
// 🎛️ UI Handlers
//////////////////////////////

function attachUI() {
  els.refreshBtn.addEventListener("click", () => {
    info("🔁 Refresh demandé");
    requestAgentsOnce();
  });

  els.sendToFirstBtn.addEventListener("click", async () => {
    const text = (els.promptInput.value || "").trim();
    if (!text) {
      warn("⚠️ Prompt vide au clic 'Envoyer au 1er agent'");
      return toast("Veuillez saisir un prompt.");
    }
    const firstId = firstAgentIdInOrder();
    if (firstId == null) {
      warn("⚠️ Aucun agent détecté pour l’envoi au 1er");
      return toast("Aucun agent détecté.");
    }
    dumpPrompt(`tab=${firstId} (first)`, text);
    const ok = await sendPromptTo(firstId, text);
    if (ok) {
      log(`🚀 Prompt envoyé au 1er agent tab=${firstId}`);
      logEvent(`Envoyé au 1er agent (tab ${firstId}).`);
    } else {
      error("💥 Échec sendPromptTo(first)");
    }
  });

  els.autoMode.addEventListener("change", async () => {
    STATE.autoMode = !!els.autoMode.checked;
    await chrome.storage.local.set({ [STORAGE_KEYS.AUTO]: STATE.autoMode });
    info(`⚙️ Auto-pipeline = ${STATE.autoMode ? "ON" : "OFF"}`);
    logEvent(`Mode auto-pipeline : ${STATE.autoMode ? "ON" : "OFF"}.`);
  });

  els.routeSendBtn.addEventListener("click", async () => {
    const toTabId = Number(els.routeSelect.value);
    if (!toTabId || !STATE.lastAnswer) {
      warn("⚠️ routeSendBtn: destination invalide ou pas de réponse");
      return;
    }
    const routedText = pickText(STATE.lastAnswer);
    dumpPrompt(`tab=${toTabId} (route)`, routedText);
    const ok = await routeAnswerTo(toTabId, STATE.lastAnswer);
    if (ok) {
      log(`🔁 Réponse routée vers tab=${toTabId}`);
      logEvent(`Routé vers ${labelForTabId(toTabId)}.`);
    } else {
      error("💥 Échec routeAnswerTo()");
      toast("Routage échoué.");
    }
  });

  els.copyBtn.addEventListener("click", async () => {
    const text = pickText(STATE.lastAnswer);
    if (!text) {
      warn("⚠️ Copie: pas de texte disponible");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      info("📋 Réponse copiée dans le presse-papiers");
      toast("Réponse copiée.");
    } catch (e) {
      error("💥 Clipboard error:", e);
      toast("Impossible de copier.");
    }
  });

  // 🔥 Nouveau : copier tout le contexte du tab sélectionné
  els.copyContextBtn.addEventListener("click", async () => {
    const toTabId = Number(els.routeSelect.value);
    if (!toTabId) {
      warn("⚠️ Copier contexte: aucune destination sélectionnée");
      return toast("Sélectionnez un onglet dans la liste.");
    }
    const label = labelForTabId(toTabId);
    info(`🧾 Demande de CONTEXTE complet pour ${label}…`);
    logEvent(`Extraction du contexte depuis ${label}…`);

    const ctx = await extractContextFrom(toTabId);
    if (!ctx) {
      error("💥 Aucun contexte récupéré (null/empty).");
      return toast("Impossible d’extraire le contexte.");
    }
    dumpTextBlock(`📦 CONTEXTE (${label})`, ctx);

    try {
      await navigator.clipboard.writeText(ctx);
      info("📋 Contexte copié dans le presse-papiers");
      toast("Contexte copié.");
    } catch (e) {
      error("💥 Clipboard error (context):", e);
      toast("Impossible de copier le contexte.");
    }
  });

  enableDragAndDrop();
}

//////////////////////////////
// 🔌 Background RPC
//////////////////////////////

async function requestAgentsOnce() {
  try {
    const resp = await chrome.runtime.sendMessage({ type: "panel:listAgents" });
    debug("📤 panel:listAgents (request) → reçu");
    if (resp) {
      STATE.agents = resp.agents || [];
      STATE.order = resp.order || [];
      info(`📡 Agents init: count=${STATE.agents.length} order=${STATE.order.join("→")}`);
      renderAgents();
      refreshRouteSelect();
    }
  } catch (e) {
    error("💥 Impossible d'obtenir la liste des agents.", e);
    toast("Impossible d'obtenir la liste des agents.");
  }
}

async function setOrder(order) {
  try {
    info("🔀 setOrder:", order.join("→"));
    const resp = await chrome.runtime.sendMessage({ type: "panel:setOrder", order });
    if (resp?.ok) {
      STATE.order = resp.order || order;
      debug("✅ setOrder confirmé par background");
    } else {
      warn("⚠️ setOrder refusé/échoué");
    }
  } catch (e) {
    error("💥 setOrder error:", e);
  }
}

async function sendPromptTo(tabId, text) {
  try {
    debug(`📨 sendPromptTo tab=${tabId} len=${(text || "").length}`);
    const resp = await chrome.runtime.sendMessage({ type: "panel:sendPrompt", tabId, text });
    if (!resp?.ok) {
      warn("⚠️ sendPromptTo: envoi échoué", j(resp));
      toast("Envoi échoué.");
      return false;
    }
    return true;
  } catch (e) {
    error("💥 sendPromptTo exception:", e);
    toast("Envoi impossible.");
    return false;
  }
}

async function setPromptOnly(tabId, text) {
  try {
    debug(`✍️ setPromptOnly tab=${tabId} len=${(text || "").length}`);
    const resp = await chrome.runtime.sendMessage({ type: "panel:setPromptOnly", tabId, text });
    return !!resp?.ok;
  } catch (e) {
    error("💥 setPromptOnly exception:", e);
    return false;
  }
}

async function triggerSend(tabId) {
  try {
    debug(`🚀 triggerSend tab=${tabId}`);
    const resp = await chrome.runtime.sendMessage({ type: "panel:send", tabId });
    return !!resp?.ok;
  } catch (e) {
    error("💥 triggerSend exception:", e);
    return false;
  }
}

async function routeAnswerTo(toTabId, payload) {
  try {
    const routed = pickText(payload);
    debug(`🔁 routeAnswerTo toTabId=${toTabId} len=${routed.length}`);
    const resp = await chrome.runtime.sendMessage({ type: "panel:routeAnswerTo", toTabId, payload });
    return !!resp?.ok;
  } catch (e) {
    error("💥 routeAnswerTo exception:", e);
    return false;
  }
}

// 🔥 Nouveau : demande d’extraction du contexte à background
async function extractContextFrom(tabId) {
  try {
    debug(`🧰 panel:extractContext → tab=${tabId}`);
    const resp = await chrome.runtime.sendMessage({ type: "panel:extractContext", tabId });
    if (resp?.ok && typeof resp.context === "string") {
      info(`✅ Context reçu (${resp.context.length} chars)`);
      return resp.context;
    }
    warn("⚠️ extractContextFrom: réponse vide/malformée", j(resp));
    return "";
  } catch (e) {
    error("💥 extractContextFrom exception:", e);
    return "";
  }
}

//////////////////////////////
// 🖼️ Rendering
//////////////////////////////

function renderAgents() {
  els.agentList.innerHTML = "";
  const orderedAgents = orderAgents(STATE.agents, STATE.order);
  info(`🖨️ renderAgents count=${orderedAgents.length}`);

  for (const a of orderedAgents) {
    debug(`· agent item: tab=${a.tabId} site=${a.site} status=${a.status}`);
    const li = /** @type {HTMLElement} */(els.agentItemTpl.content.firstElementChild.cloneNode(true));
    li.dataset.tabid = String(a.tabId);
    li.dataset.site = a.site;

    const siteBadge = li.querySelector(".site-badge");
    const title = li.querySelector(".title");
    const meta = li.querySelector(".meta");
    const status = /** @type {HTMLElement} */(li.querySelector(".status"));

    siteBadge.textContent = `${a.site} #${a.tabId}`;
    title.textContent = displayTitle(a);
    meta.textContent = a.url;
    status.textContent = a.status || "idle";
    status.dataset.s = normalizeStatus(a.status);

    // Actions
    const btnSet = li.querySelector(".btn.set");
    const btnSend = li.querySelector(".btn.send");
    const btnFocus = li.querySelector(".btn.focus");
    const btnRemove = li.querySelector(".btn.remove");

    btnSet.addEventListener("click", async () => {
      const text = (els.promptInput.value || "").trim();
      if (!text) {
        warn("⚠️ btnSet: prompt vide");
        return toast("Prompt vide.");
      }
      dumpPrompt(`tab=${a.tabId} (set only)`, text);
      const ok = await setPromptOnly(a.tabId, text);
      toast(ok ? "Prompt défini." : "Échec setPrompt.");
    });

    btnSend.addEventListener("click", async () => {
      const text = (els.promptInput.value || "").trim();
      if (text) {
        dumpPrompt(`tab=${a.tabId} (send)`, text);
        const ok = await sendPromptTo(a.tabId, text);
        if (ok) logEvent(`Envoyé à ${displayName(a)}.`);
      } else {
        debug("⏎ btnSend: aucun prompt dans le panel, on tente un simple 'send' sur le site");
        const ok = await triggerSend(a.tabId);
        if (!ok) toast("Impossible d'envoyer.");
      }
    });

    btnFocus.addEventListener("click", async () => {
      try {
        await chrome.tabs.update(a.tabId, { active: true });
        info(`👁️ Focus tab=${a.tabId}`);
      } catch {
        error("💥 Impossible d'activer l'onglet.");
        toast("Impossible d'activer l'onglet.");
      }
    });

    btnRemove.addEventListener("click", async () => {
      const ok = await removeAgent(a.tabId);
      if (!ok) {
        error("💥 Impossible de retirer l'agent.");
        toast("Impossible de retirer l'agent.");
      }
    });

    // Drag attrs
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer?.setData("text/plain", String(a.tabId));
      li.classList.add("dragging");
      debug(`🖐️ dragstart tab=${a.tabId}`);
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      debug(`🖐️ dragend tab=${a.tabId}`);
    });

    els.agentList.appendChild(li);
  }

  els.emptyAgents.hidden = orderedAgents.length > 0;
}

function orderAgents(agents, order) {
  const map = new Map(agents.map(a => [a.tabId, a]));
  const result = [];
  for (const id of order) {
    const a = map.get(id);
    if (a) { result.push(a); map.delete(id); }
  }
  for (const a of map.values()) result.push(a);
  return result;
}

function refreshRouteSelect() {
  const prev = Number(els.routeSelect.value || 0);
  els.routeSelect.innerHTML = "";
  const ordered = orderAgents(STATE.agents, STATE.order);
  info(`🔧 refreshRouteSelect options=${ordered.length}`);

  for (const a of ordered) {
    const opt = document.createElement("option");
    opt.value = String(a.tabId);                    // identifiant unique
    opt.textContent = displayName(a);               // ex: [gemini#448742229] Titre — host
    opt.dataset.site = a.site;
    opt.dataset.url = a.url || "";
    els.routeSelect.appendChild(opt);
  }
  if (prev) {
    const found = [...els.routeSelect.options].some(o => Number(o.value) === prev);
    if (found) els.routeSelect.value = String(prev);
  }
}

//////////////////////////////
// 🧲 DnD ordering
//////////////////////////////

function enableDragAndDrop() {
  els.agentList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = els.agentList.querySelector(".agent.dragging");
    if (!dragging) return;

    const after = elementAfter(els.agentList, e.clientY);
    if (after == null) {
      els.agentList.appendChild(dragging);
    } else {
      els.agentList.insertBefore(dragging, after);
    }
  });

  els.agentList.addEventListener("drop", async () => {
    const newOrder = [...els.agentList.querySelectorAll(".agent")].map(li => Number(li.dataset.tabid));
    info("📐 DnD drop → newOrder:", newOrder.join("→"));
    await setOrder(newOrder);
    STATE.order = newOrder;
    refreshRouteSelect();
    logEvent("Ordre du pipeline mis à jour.");
  });
}

function elementAfter(container, y) {
  const items = [...container.querySelectorAll(".agent:not(.dragging)")];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

//////////////////////////////
// 📬 Answer handling
//////////////////////////////

function onAnswerReceived(fromAgent, answer) {
  STATE.lastAnswer = answer;
  const text = pickText(answer);
  const label = fromAgent ? displayName(fromAgent) : `tab=${answer?.meta?.tabId || "?"}`;
  info(`✅ Réponse reçue: from=${label} chars=${text.length}`);

  els.answerFrom.textContent = `De ${label}`;
  els.answerText.textContent = text || "(réponse vide)";
  els.answerPane.classList.add("active");
  logEvent(`Réponse reçue de ${label}.`);

  if (STATE.autoMode && fromAgent) {
    const nextId = nextAgentIdAfter(fromAgent.tabId);
    if (nextId != null) {
      dumpPrompt(`tab=${nextId} (auto-route)`, text);
      routeAnswerTo(nextId, answer).then((ok) => {
        if (ok) logEvent(`Auto-routé vers ${labelForTabId(nextId)}.`);
        else toast("Routage auto échoué.");
      });
      els.routeSelect.value = String(nextId);
    } else {
      debug("ℹ️ Auto-mode: pas d’agent suivant.");
    }
  }
}

function pickText(answer) {
  if (!answer) return "";
  return (answer.plainText && answer.plainText.trim())
    || (answer.markdown && stripMarkdown(answer.markdown).trim())
    || (answer.html && stripHtml(answer.html).trim())
    || "";
}

//////////////////////////////
// 🧰 Helpers
//////////////////////////////

function findAgent(tabId) {
  return STATE.agents.find(a => a.tabId === tabId) || null;
}

function firstAgentIdInOrder() {
  const ordered = orderAgents(STATE.agents, STATE.order);
  return ordered.length ? ordered[0].tabId : null;
}

function nextAgentIdAfter(fromTabId) {
  const idx = STATE.order.indexOf(fromTabId);
  if (idx === -1) return null;
  for (let i = idx + 1; i < STATE.order.length; i++) {
    const id = STATE.order[i];
    if (STATE.agents.some(a => a.tabId === id)) return id;
  }
  return null;
}

function prettyUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`;
  } catch { return url; }
}

function displayTitle(agent) {
  return agent.title || prettyUrl(agent.url);
}

function displayName(agent) {
  const host = (() => { try { return new URL(agent.url || "").hostname; } catch { return ""; } })();
  const title = displayTitle(agent);
  return `[${agent.site}#${agent.tabId}] ${title}${host ? ` — ${host}` : ""}`;
}

function labelForTabId(tabId) {
  const a = findAgent(tabId);
  return a ? displayName(a) : `tab=${tabId}`;
}

function normalizeStatus(s) {
  if (!s) return "idle";
  const t = s.toLowerCase();
  if (t.includes("send")) return "sending";
  if (t.includes("done") || t.includes("complete")) return "done";
  if (t.includes("error") || t.includes("fail")) return "error";
  if (t.includes("loading")) return "loading";
  return "idle";
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return tmp.textContent || tmp.innerText || "";
}

function stripMarkdown(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~`>-]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function logEvent(text) {
  const line = document.createElement("div");
  line.className = "logline";
  const t = document.createElement("time");
  t.textContent = new Date().toLocaleTimeString();
  line.appendChild(t);
  line.append(" " + text);
  els.eventLog.prepend(line);
  debug("📝 Event:", text);
}

function toast(text) {
  console.warn(LOG_PREFIX, text);
  logEvent(text);
}

async function restoreAutoMode() {
  try {
    const { [STORAGE_KEYS.AUTO]: saved } = await chrome.storage.local.get(STORAGE_KEYS.AUTO);
    STATE.autoMode = !!saved;
    els.autoMode.checked = STATE.autoMode;
    info(`♻️ restoreAutoMode=${STATE.autoMode}`);
  } catch (e) {
    STATE.autoMode = false;
    warn("⚠️ restoreAutoMode: fallback OFF", e);
  }
}
