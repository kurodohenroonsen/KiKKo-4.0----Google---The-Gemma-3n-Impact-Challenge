# Document 12/10 (v2.0) : L'Atelier de la Forge Royale

**Titre :** L'Atelier de la Forge : Une Interface de Commandement pour la Création de Connaissance sur Mesure

**Objectif :** Détailler l'architecture et le fonctionnement de la "Forge", l'environnement interactif qui transforme un `PollenGrain` brut en un `Pollen de Connaissance` structuré. Ce document décrit le modèle de **tâches à la demande**, la gestion des états, et l'interface de commandement qui vous place au centre du processus créatif.

---

### **1. Philosophie : Le Maître Forgeron au Cœur du Processus 🧑‍🔬**

Nous abandonnons le modèle de la chaîne de montage automatique pour une approche plus fine et contrôlée. La forge n'est pas un processus passif, mais un **atelier interactif**. Chaque `PollenGrain` est une pièce brute, et pour chaque propriété à ciseler (la description, une statistique...), vous disposez d'une panoplie d'outils (les "tâches") que vous pouvez déployer à votre guise.

Ce modèle vous donne un contrôle absolu :
* **Contrôle des Ressources 🔋:** C'est vous qui décidez quand lancer un calcul, évitant ainsi de surcharger votre appareil.
* **Contrôle Expérimental 🧪:** Vous pouvez lancer différentes "ouvrières" (avec des modèles et des paramètres variés) sur la même tâche et comparer directement leurs résultats, transformant chaque forge en une session de benchmark.
* **Contrôle Qualitatif ✨:** Vous n'êtes pas obligé de tout forger. Vous pouvez vous concentrer sur le raffinage d'une seule propriété qui vous semble importante, et ne lancer la synthèse que lorsque vous êtes satisfait des analyses.

### **2. Les Composants de l'Atelier**

| Composant | Rôle | Description |
| :--- | :--- | :--- |
| **Le Grain de Pollen (`PollenGrain`)** | La Pièce à Forger | L'objet de données contenant l'image source et la liste des propriétés à définir. Il est au centre de l'atelier. |
| **La Tâche d'Analyse (`AnalysisTask`)** | L'Outil Potentiel | Une **définition de travail en attente**. Pour chaque propriété, une liste de tâches est disponible, chacune encapsulant une configuration unique (ex: `modèle=Gemma3-2B`, `température=0.9`). **Ces tâches ne sont pas lancées automatiquement.** |
| **L'Ouvrière Synthétiseur** | L'Artisan Consolideur | Agent IA qui, **sur votre ordre**, prend les résultats des tâches d'analyse que vous avez choisi d'exécuter pour les synthétiser en une proposition unique et cohérente. |
| **L'Ouvrière Juge** | Le Contrôle Qualité Final | Agent IA qui valide la proposition du Synthétiseur avant l'intégration finale. |

### **3. Le Flux de Travail de l'Atelier : Un Processus sous Votre Contrôle**

Le processus n'est plus une séquence linéaire, mais un ensemble d'états gérés depuis l'interface détaillée de chaque carte.

| État du Grain | Icône | Description du Processus |
| :--- | :---: | :--- |
| **1. À FORGER (`TODO`)** | 📋 | Le `PollenGrain` est créé. Dans sa vue détaillée, la liste des propriétés à définir est affichée. Pour chaque propriété, la liste des **tâches d'analyse disponibles** est visible, chacune avec un bouton "Lancer". |
| **2. EN COURS (`FORGING`)** | 🔥 | Vous avez lancé une ou plusieurs tâches. L'interface affiche en temps réel l'état de chaque tâche (En attente ⏳, En cours 🔬, Terminé ✅, Erreur ❌). Vous pouvez lancer plusieurs tâches pour la même propriété et voir les résultats arriver au fur et à mesure. |
| **3. EN SYNTHÈSE (`SYNTHESIZING`)**| ⚖️ | Une fois qu'au moins une tâche d'analyse est terminée pour une propriété, le bouton "Synthétiser" devient actif pour celle-ci. En cliquant dessus, vous activez l'Ouvrière Synthétiseur, puis le Juge. |
| **4. FORGÉ (`FORGED`)** | ✅ | Une propriété (ou l'ensemble des propriétés) a passé avec succès l'étape de Synthèse. Le résultat est "verrouillé" et le `Pollen de Connaissance` est progressivement assemblé. |

### **4. L'Interface de Commandement de la Forge**

L'écran principal de la Forge liste les `PollenGrains`. Cliquer sur un grain ouvre l'**Atelier**, une vue détaillée où le véritable travail s'effectue.

**Vue de l'Atelier pour un `PollenGrain` :**

* **En-tête :** Image, nom identifié, statut global.
* **Liste des Propriétés :** Une section pour chaque propriété (`description`, `stats.lifespan`, etc.).

**Pour chaque propriété dans la liste :**

* **État de la Propriété :** (ex: "À définir", "Analyse en cours", "Synthèse prête", "Terminé").
* **Section "Tâches Disponibles" :**
    * Tâche 1: "Analyse Créative (Gemma 2B, T°0.9)" - [**Lancer ▶️**]
    * Tâche 2: "Analyse Factuelle (Qwen, T°0.2)" - [**Lancer ▶️**]
    * ...
* **Section "Résultats d'Analyse" :**
    * Une fois une tâche terminée, son résultat apparaît ici, avec le nom de l'ouvrière. Vous pouvez inspecter chaque résultat individuellement.
* **Bouton d'Action Principal :**
    * Le bouton **[Synthétiser ⚖️]** apparaît dès qu'au moins un résultat est disponible.
* **Contrôles Globaux du Grain :**
    * **🗑️ Supprimer le Grain :** Annule tout le travail et supprime le grain de la forge.

Ce design vous donne un contrôle granulaire sans précédent et transforme le processus de forge en une exploration fascinante des capacités des différentes IA.