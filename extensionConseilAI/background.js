// Background Service Worker — AI Council Orchestrator
// MV3 / type:module compatible (pas d'import externe)
// 🪵 LOGS MASSIFS et compat “copier la console” (pas de groups/collapse)

const LOG_PREFIX = "🧭 [AI-Council/BG]";
function log(...a){console.log(LOG_PREFIX,...a)}
function info(...a){console.info(LOG_PREFIX,...a)}
function warn(...a){console.warn(LOG_PREFIX,...a)}
function error(...a){console.error(LOG_PREFIX,...a)}
function j(x){try{return JSON.stringify(x)}catch{return String(x)}}

// ---- Storage keys
const SK = {
  ORDER: "aicouncil_pipeline_order_v1",
};

// ---- In-memory state
/** @type {Map<number, Agent>} */
const AGENTS = new Map();
/** @type {Set<number>} */
const INJECTED = new Set();
/** @type {number[]} */
let ORDER = [];

// ---- Types (doc)
/**
 * @typedef {Object} Agent
 * @property {number} tabId
 * @property {string} site     // 'gemini' | 'chatgpt' | 'aistudio' | 'unknown'
 * @property {string} url
 * @property {string} title
 * @property {string} icon
 * @property {string} status   // 'idle' | 'sending' | 'done' | 'error'
 * @property {Object} capabilities
 * @property {number} lastSeen
 */

// ============= Utilities =============
async function getStorage(key){
  return new Promise(r=>chrome.storage.local.get(key, v=>r(v?.[key])));
}
async function setStorage(obj){
  return new Promise(r=>chrome.storage.local.set(obj, ()=>r(true)));
}
function pickText(payload){
  if(!payload) return "";
  const t = (payload.plainText||"").trim()
    || (payload.markdown||"").trim()
    || (payload.html||"").trim();
  return t;
}

function detectSite(url){
  try{
    const u = new URL(url||"");
    // ✅ MODIFICATION : Ajout de la détection pour aistudio.google.com
    if (u.hostname === "aistudio.google.com") return "aistudio";
    if (u.hostname.endsWith("google.com") && u.pathname.startsWith("/app")) return "gemini";
    if (u.hostname === "gemini.google.com") return "gemini";
    if (u.hostname === "chat.openai.com") return "chatgpt";
    return null;
  }catch{ return null; }
}

function adapterPathFor(site){
  if(site==="gemini") return "adapters/gemini_adapter.js";
  if(site==="chatgpt") return "adapters/chatgpt_adapter.js";
  // ✅ MODIFICATION : Ajout du chemin vers le nouvel adaptateur AI Studio
  if(site==="aistudio") return "adapters/aistudio.js";
  return null;
}

function displayAgent(a){
  return `[${a.site}#${a.tabId}] ${a.title||a.url}`;
}
function normalizeStatus(s){
  if(!s) return "idle";
  const t = s.toLowerCase();
  if (t.includes("send")) return "sending";
  if (t.includes("done")||t.includes("complete")) return "done";
  if (t.includes("error")||t.includes("fail")) return "error";
  if (t.includes("loading")) return "loading";
  return "idle";
}
async function sendToTab(tabId, msg){
  return new Promise((resolve)=>{
    try{
      chrome.tabs.sendMessage(tabId, msg, (resp)=>{
        if(chrome.runtime.lastError){
          warn("📨 sendToTab lastError:", chrome.runtime.lastError.message);
          resolve(null);
          return;
        }
        resolve(resp);
      });
    }catch(e){
      error("💥 sendToTab exception:", e);
      resolve(null);
    }
  });
}

// Keep side panel opening on toolbar button click
chrome.runtime.onInstalled.addListener(async ()=>{
  log("🧰 onInstalled → setPanelBehavior + bootstrapAtStartup()");
  try{
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    info("✅ sidePanel.setPanelBehavior ok");
  }catch(e){
    warn("⚠️ sidePanel.setPanelBehavior:", e?.message||e);
  }
  await bootstrapAtStartup();
});

// Also at service worker startup
bootstrapAtStartup();

async function bootstrapAtStartup(){
  info("🧹 Bootstrap: rechargement ordre pipeline + scan des tabs existantes…");
  try{
    ORDER = (await getStorage(SK.ORDER)) || [];
    log("📜 Ordre pipeline restauré:", ORDER.join("→") || "(vide)");
  }catch(e){
    ORDER = [];
    warn("⚠️ Lecture ORDER échouée:", e?.message||e);
  }
  const tabs = await chrome.tabs.query({});
  info(`🔎 ${tabs.length} onglet(s) trouvé(s) au démarrage.`);
  for (const t of tabs){
    await maybeDetectAndInject(t);
  }
  broadcastAgents();
}

// -------- Tab listeners
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)=>{
  if(changeInfo.status==="loading" || changeInfo.status==="complete"){
    await maybeDetectAndInject(tab);
  }
  // Update meta if title/url changed
  const a = AGENTS.get(tabId);
  if(a && (changeInfo.title || changeInfo.url)){
    a.title = tab.title || a.title;
    a.url = tab.url || a.url;
    a.lastSeen = Date.now();
    AGENTS.set(tabId, a);
    broadcastAgents();
  }
});

chrome.tabs.onActivated.addListener(async ({tabId})=>{
  info("🎯 onActivated", tabId);
  const tab = await chrome.tabs.get(tabId);
  await maybeDetectAndInject(tab);
});

chrome.tabs.onRemoved.addListener((tabId)=>{
  if (AGENTS.has(tabId)){
    AGENTS.delete(tabId);
    INJECTED.delete(tabId);
    info("🗑️ Agent retiré (tab fermé):", tabId);
    ORDER = ORDER.filter(id=>id!==tabId);
    setStorage({[SK.ORDER]: ORDER});
    broadcastAgents();
  }
});

// -------- Detect & inject
async function maybeDetectAndInject(tab){
  if(!tab || !tab.id || !tab.url) return;
  const tabId = tab.id;
  const site = detectSite(tab.url);
  if(!site) return;
  info(`🛰️ Détection IA: tab=${tabId} site=${site} url=${tab.url}`);

  // upsert agent
  upsertAgent({
    tabId,
    site,
    url: tab.url,
    title: tab.title||"",
    icon: "",
    status: "idle",
    capabilities: {},
    lastSeen: Date.now(),
  });

  if(INJECTED.has(tabId)){
    // still re-inject after navigation complete
    if (site) { await injectAdapter(tabId, site, tab.url); }
    return;
  }
  await injectAdapter(tabId, site, tab.url);
}

async function injectAdapter(tabId, site, url){
  const path = adapterPathFor(site);
  if(!path){
    warn("⚠️ Pas d’adapter pour site=", site, "url=", url);
    return;
  }
  info(`🧩 Injection adapter='${path}' sur tab=${tabId} (${url})`);
  try{
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [path],
      world: "ISOLATED", // best effort; ignored on some channels but fine
    });
    INJECTED.add(tabId);
    info(`✅ Injection ok: ${path} → tab=${tabId}`);
  }catch(e){
    error("💥 Injection échouée:", e?.message||e);
  }
}

// -------- Agents state mgmt
function upsertAgent(partial){
  const prev = AGENTS.get(partial.tabId) || {};
  const agent = {
    tabId: partial.tabId,
    site: partial.site || prev.site || "unknown",
    url: partial.url || prev.url || "",
    title: partial.title || prev.title || "",
    icon: partial.icon || prev.icon || "",
    status: normalizeStatus(partial.status || prev.status || "idle"),
    capabilities: partial.capabilities || prev.capabilities || {},
    lastSeen: partial.lastSeen || Date.now(),
  };
  AGENTS.set(agent.tabId, agent);

  // Ensure ORDER contains this tab once
  if (!ORDER.includes(agent.tabId)) {
    ORDER.push(agent.tabId);
    setStorage({[SK.ORDER]: ORDER});
  }

  info(`📇 upsertAgent tab=${agent.tabId} site=${agent.site} status=${agent.status}`);
  broadcastAgents();
}

function broadcastAgents(){
  const list = [...AGENTS.values()].sort((a,b)=>ORDER.indexOf(a.tabId)-ORDER.indexOf(b.tabId));
  chrome.runtime.sendMessage({ type: "agents:updated", agents: list, order: [...ORDER] }).catch(()=>{});
}

// ============= Messages from content scripts (adapters) =============
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  if (!msg || typeof msg !== "object") return; // ignore
  // console visible + simple (no groups)
  if (msg.type) log("📥 from content:", msg.type);

  (async()=>{
    if (msg.type === "adapter:hello"){
      const tabId = sender.tab?.id;
      if (!tabId) return;
      const site = msg.site || detectSite(sender.tab?.url||"") || "unknown";
      info(`🤝 adapter:hello tab=${tabId} site=${site} caps=${j(msg.capabilities||{})}`);
      upsertAgent({
        tabId,
        site,
        url: sender.tab?.url||"",
        title: sender.tab?.title||"",
        capabilities: msg.capabilities||{},
        status: "idle",
        lastSeen: Date.now(),
      });
      sendResponse?.({ok:true});
      return;
    }

    if (msg.type === "adapter:state"){
      const tabId = sender.tab?.id;
      if (!tabId) return;
      const a = AGENTS.get(tabId);
      if (a){
        a.status = normalizeStatus(msg.status||"idle");
        a.lastSeen = Date.now();
        AGENTS.set(tabId, a);
        broadcastAgents();
      }
      sendResponse?.({ok:true});
      return;
    }

    if (msg.type === "adapter:finalAnswer"){
      const tabId = sender.tab?.id;
      const size = (pickText(msg.answer)||"").length;
      info(`📦 adapter:finalAnswer tab=${tabId} size=${size} chars`);
      chrome.runtime.sendMessage({ type: "answer:received", fromTabId: tabId, answer: msg.answer }).catch(()=>{});
      sendResponse?.({ok:true});
      return;
    }
  })();

  return true; // async
});

// ============= Messages from side panel =============
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse)=>{
  if (!msg || typeof msg !== "object") return;
  if (msg.type?.startsWith("panel:")) log("📨 from panel:", msg.type);

  (async ()=>{
    if (msg.type === "panel:listAgents"){
      const list = [...AGENTS.values()];
      sendResponse?.({ agents: list, order: [...ORDER] });
      return;
    }

    if (msg.type === "panel:setOrder"){
      const order = (msg.order||[]).filter((id)=>typeof id==="number");
      ORDER = order;
      await setStorage({[SK.ORDER]: ORDER});
      info("🧭 pipeline order set:", ORDER.join("→"));
      broadcastAgents();
      sendResponse?.({ ok: true, order: [...ORDER] });
      return;
    }

    if (msg.type === "panel:removeAgent"){
      const tabId = Number(msg.tabId);
      AGENTS.delete(tabId);
      INJECTED.delete(tabId);
      ORDER = ORDER.filter(id=>id!==tabId);
      await setStorage({[SK.ORDER]: ORDER});
      broadcastAgents();
      sendResponse?.({ok:true});
      return;
    }

    if (msg.type === "panel:setPromptOnly"){
      const tabId = Number(msg.tabId);
      const text = String(msg.text||"");
      info(`✍️ panel:setPromptOnly → tab=${tabId} len=${text.length}`);
      const resp = await sendToTab(tabId, { type: "orchestrator:setPrompt", text });
      sendResponse?.({ ok: !!(resp && resp.ok), resp });
      return;
    }

    if (msg.type === "panel:send"){
      const tabId = Number(msg.tabId);
      info(`🚀 panel:send → tab=${tabId}`);
      const resp = await sendToTab(tabId, { type: "orchestrator:send" });
      sendResponse?.({ ok: !!(resp && resp.ok), resp });
      return;
    }

    if (msg.type === "panel:sendPrompt"){
      const tabId = Number(msg.tabId);
      const text = String(msg.text||"");
      info(`📨 panel:sendPrompt → tab=${tabId} len=${text.length}`);
      const resp = await sendToTab(tabId, { type: "orchestrator:setAndSend", text });
      sendResponse?.({ ok: !!(resp && resp.ok), resp });
      return;
    }

    if (msg.type === "panel:routeAnswerTo"){
      const toTabId = Number(msg.toTabId);
      const routed = pickText(msg.payload||{});
      info(`🔁 panel:routeAnswerTo → toTabId=${toTabId} len=${routed.length}`);
      const resp = await sendToTab(toTabId, { type: "orchestrator:setAndSend", text: routed });
      sendResponse?.({ ok: !!(resp && resp.ok), resp });
      return;
    }

    // 🔥 NOUVEAU : extraire tout le contexte (messages) du tab cible
    if (msg.type === "panel:extractContext"){
      const tabId = Number(msg.tabId);
      info(`🧾 panel:extractContext → tab=${tabId}`);
      // On demande à l’adapter du tab une extraction "brute" de tout le contexte
      // Convention: l’adapter répond { ok:true, context:"..." } ou { ok:false, error:"..." }
      const resp = await sendToTab(tabId, { type: "orchestrator:extractContext" });
      if (!resp || !resp.ok){
        warn("⚠️ extractContext: échec ou vide. resp=", j(resp));
        sendResponse?.({ ok:false, context:"", error: resp?.error||"no-response" });
        return;
      }
      const sz = (resp.context||"").length;
      info(`📚 Contexte reçu (${sz} chars) depuis tab=${tabId}`);
      sendResponse?.({ ok:true, context: String(resp.context||"") });
      return;
    }
  })();

  return true; // async
});