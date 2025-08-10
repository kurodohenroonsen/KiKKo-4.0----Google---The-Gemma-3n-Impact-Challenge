A. VISION & PORTÉE (révisée)

OBJECTIFS
Le projet "AI Council Orchestrator" vise à fournir une interface unifiée, via un side panel Chrome, pour piloter plusieurs onglets d'agents conversationnels (IA). L'objectif est de permettre à un utilisateur de créer un "pipeline" de traitement en enchaînant les requêtes et les réponses entre différents services d'IA (ex: ChatGPT, Gemini). Le système doit automatiser la détection des onglets compatibles, l'injection de prompts, l'attente de la réponse finale, et le routage de cette dernière vers l'agent suivant, de manière manuelle ou automatique.

ACTEURS
*   **Utilisateur Final :** Interagit avec le side panel pour définir un prompt, organiser le pipeline d'agents, et consulter les réponses et les journaux d'événements.
*   **Sidepanel (UI) :** Le composant d'interface (sidepanel.html, sidepanel.js). Il affiche la liste des agents détectés, permet leur réorganisation par glisser-déposer, et présente la dernière réponse reçue ainsi que les options de routage.
*   **Background Service Worker (Orchestrateur) :** Le cœur de l'extension (background.js). Il maintient l'état des agents, gère la communication entre le side panel et les onglets, persiste l'ordre du pipeline, et exécute la logique de routage.
*   **Adapters (Content Scripts) :** Des scripts spécifiques à chaque site (chatgpt_adapter.js, gemini_adapter.js) injectés dans les onglets IA. Ils manipulent le DOM de la page pour y insérer un prompt, simuler un envoi, et détecter la fin de la génération de la réponse.
*   **Onglets IA (Cibles) :** Les pages web des services IA, comme chat.openai.com et gemini.google.com, qui sont contrôlées par les adapters.

PÉRIMÈTRE & CONTRAINTES
*   **Technologie :** L'extension est basée sur le Manifest V3 de Chrome, utilisant un Service Worker pour le traitement en arrière-plan et l'API sidePanel pour l'interface.
*   **Périmètre d'exécution :** Le fonctionnement est entièrement local au navigateur, sans appel à un serveur externe. Le périmètre actuel se concentre exclusivement sur l'orchestration d'onglets web. L'intégration de modèles locaux comme Gemini Nano n'est pas incluse dans cette version.
*   **Gestion des sessions :** Le système ne gère pas les mécanismes d'authentification (connexion, CAPTCHA). L'utilisateur est responsable de s'assurer que les sessions sur les onglets IA cibles sont actives et prêtes à recevoir des prompts.
*   **Types de données :** Le flux de données entre les agents est strictement limité au texte brut. Les entrées et sorties non textuelles (images, fichiers) ne sont pas prises en charge par le pipeline.
*   **Sécurité et Confidentialité :** Les permissions requises (tabs, storage, scripting, host_permissions) sont limitées aux sites IA cibles pour garantir la confidentialité. L'injection de script se fait dans un monde isolé (ISOLATED) pour une meilleure sécurité.
*   **Robustesse :** Le système est dépendant de la structure DOM des sites cibles. Pour pallier la volatilité de cette structure, les adapters utilisent des listes de sélecteurs CSS alternatifs (fallbacks) afin de localiser les éléments nécessaires (zone de saisie, bouton d'envoi, etc.).