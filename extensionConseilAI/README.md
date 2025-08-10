# AI Council Orchestrator (Chrome Side Panel)

Orchestre des **onglets IA** (ChatGPT, Gemini, …) : détecte automatiquement les tabs, permet de définir **l’ordre du pipeline**, d’**envoyer un prompt** au 1er agent, d’**attendre la réponse**, puis de **router** la sortie vers l’onglet suivant (automatique ou manuel).

## Fonctionnalités
- Side Panel listant **en direct** les onglets IA détectés.
- **Drag & drop** pour définir l’ordre du pipeline.
- **Prompt initial** : envoi au 1er agent ou à un agent choisi.
- **Attente de la réponse** (stabilité DOM, bouton *Stop* disparu, etc.).
- **Routage** de la réponse vers l’agent suivant (auto) ou choisi (manuel).
- Journal d’événements dans le panel.
- Adaptateurs fournis : **ChatGPT** (`chat.openai.com`), **Gemini** (`gemini.google.com`).

## Arborescence
/ (racine de l’extension)
├─ manifest.json
├─ background.js
├─ sidepanel.html
├─ sidepanel.js
└─ adapters/
├─ chatgpt_adapter.js
└─ gemini_adapter.js

markdown
Copier
Modifier

## Installation (mode développeur)
1. **Chrome** → `chrome://extensions`
2. Activer **Developer mode** (coin droit).
3. **Load unpacked** → sélectionner le dossier contenant ces fichiers.
4. L’icône de l’extension apparaît → cliquez pour ouvrir le **Side Panel** (ou via la barre latérale).

> Le service worker ouvre le Side Panel à l’icône. Vous pouvez épingler l’icône dans la barre d’outils.

## Permissions
- `"sidePanel"`, `"tabs"`, `"scripting"`, `"storage"`
- `"host_permissions"` :  
  - `https://chat.openai.com/*`  
  - `https://gemini.google.com/*`  
Chrome peut demander l’autorisation quand vous ouvrez ces domaines la première fois.

## Utilisation
1. Ouvrez le Side Panel (extension).
2. Ouvrez des onglets **ChatGPT** / **Gemini** ; ils apparaissent dans la liste.
3. Réordonnez les agents via **drag & drop** pour définir le pipeline.
4. Saisissez le **prompt** en haut, cliquez **Envoyer au 1er agent**.
5. Quand la réponse arrive, elle s’affiche :  
   - **Mode auto** activé → routage direct vers l’agent suivant.  
   - **Mode manuel** → choisissez la destination dans *Envoyer vers…* puis **Envoyer**.

## Heuristiques d’attente (fin de génération)
- Disparition du bouton *Stop* (si présent).
- **MutationObserver** : aucune mutation pendant ~**1.2 s**.
- Timeout global ~**90 s** (configuré dans les adaptateurs).

## Limitations connues
- Les sites peuvent changer leur DOM. Les adaptateurs incluent des **fallbacks** mais il faudra parfois ajuster les sélecteurs.
- Si un site impose un **captcha**/auth 2FA, l’adaptateur ne contourne rien : complétez l’étape manuellement puis relancez.
- Pas de collecte externe : tout se passe **localement** (état en `chrome.storage.local`).

## Dépannage
- Rien n’apparaît dans la liste :  
  - vérifiez l’URL (doit matcher `chat.openai.com` ou `gemini.google.com`),  
  - vérifiez `chrome://extensions` → votre extension → **Errors** (CSP, host permissions).
- Envoi bloqué : réessayez avec le bouton **Envoyer** de l’agent, ou changez de méthode (Enter vs bouton).
- Réponse non capturée : augmentez l’attente (QUIET_MS) dans l’adaptateur concerné.

## Ajouter un nouvel adaptateur (autre site IA)
1. Dupliquez un fichier `adapters/*_adapter.js`.
2. Adaptez les sélecteurs : **éditeur**, **bouton envoyer**, **bouton stop**, **conteneur de messages**.
3. Exportez les primitives `setPrompt()`, `send()`, `waitForFinal()` (interne), et appelez le **handshake** :
   ```js
   chrome.runtime.sendMessage({ type: "adapter:hello", site: "votresite", capabilities: {...} });
Enregistrez l’adaptateur dans background.js (table ADAPTERS) avec un match({url}) et le chemin script.

Sécurité / confidentialité
Pas d’appels réseau côté extension (hors ceux du site ouvert).

Pas de stockage externe.

Si nécessaire, effacez l’état via chrome.storage.local.clear() depuis la console du service worker.

Licence : MIT (adapter selon votre projet).

markdown
Copier
Modifier

Dis-moi **GO** quand tu veux que je t’envoie un autre fichier (ex. un **adapter template** pour ajouter facilement de nouveaux sites).
::contentReference[oaicite:0]{index=0}