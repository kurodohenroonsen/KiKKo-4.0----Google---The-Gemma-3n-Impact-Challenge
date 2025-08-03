# Document 12/10 : L'Orchestration de la Forge Royale

**Titre :** La Forge Royale : Architecture d'un Processus de Génération de Connaissance Fiable et Managé

**Objectif :** Détailler l'architecture et le fonctionnement de la "Forge", le processus asynchrone qui transforme un `PollenGrain` brut en un `Pollen de Connaissance` structuré et vérifié. Ce document décrit le modèle multi-ouvrières, la gestion des états du processus, et l'interface de commandement pour le Maître de la Ruche.

---

### **1. Philosophie : De l'Inférence Unique au Tournoi d'IA**

Pour garantir une fiabilité maximale, nous rejetons le modèle simpliste où une seule IA génère une information. Chaque propriété critique d'un Pollen est le résultat d'un **tournoi d'intelligences**, un processus délibératif et compétitif qui se déroule en plusieurs étapes au sein de la Forge.

Ce processus garantit :
* **Robustesse :** En confrontant les résultats de plusieurs "ouvrières" avec des configurations différentes, nous minimisons le risque d'hallucination ou d'erreur isolée.
* **Richesse :** La synthèse des différentes perspectives produit un résultat plus nuancé et complet.
* **Traçabilité :** L'ensemble du processus, incluant les "opinions" de chaque ouvrière, est enregistré dans la Trace de Genèse, offrant un audit sans précédent.

### **2. Les Acteurs de la Forge**

La Forge est une chaîne de montage peuplée d'agents spécialisés (les "Workers").

| Acteur | Rôle | Description |
| :--- | :--- | :--- |
| **Le Grain de Pollen (`PollenGrain`)** | La Matière Première | Objet de données contenant les informations brutes à traiter : l'image source, les métadonnées initiales, et la liste des propriétés à forger. C'est l'unité de travail qui traverse la forge. |
| **L'Ouvrière Analyste** | La Spécialiste | Agent IA configuré pour une tâche précise sur une seule propriété. Il existe de multiples Analystes pour chaque propriété, chacune avec une configuration unique (ex: `ReineIA=Gemma3-2B`, `température=0.9` vs. `ReineIA=Qwen`, `température=0.2`). Elles travaillent en parallèle. |
| **L'Ouvrière Synthétiseur** | La Sage | Agent IA qui reçoit les résultats des différentes Ouvrières Analystes pour une même propriété. Son rôle est de comparer, de consolider et de produire la "meilleure" version possible de l'information. |
| **L'Ouvrière Juge** | La Gardienne de la Qualité | Agent IA final, configuré avec les paramètres les plus stricts (`température=0.0`). Elle reçoit la proposition du Synthétiseur et lui donne son sceau d'approbation final, ou la rejette si la qualité est insuffisante. |

### **3. Le Cycle de Vie d'un Grain : Les 4 États de la Forge**

Chaque `PollenGrain` soumis à la Forge traverse un cycle de vie en quatre états, permettant au Maître de la Ruche de suivre sa progression en temps réel.

| État | Icône | Description du Processus |
| :--- | :---: | :--- |
| **1. EN ATTENTE (`QUEUE`)** | ⏳ | Le `PollenGrain` a été accepté par la Forge. Il est dans la file d'attente, attendant que des ressources de calcul (CPU/GPU) se libèrent. |
| **2. ANALYSE (`ANALYZING`)** | 🔬 | Le travail a commencé. Pour chaque propriété à forger (ex: `description`, `stats.lifespan`), plusieurs Ouvrières Analystes sont lancées en parallèle. Chacune produit sa propre version de la réponse. L'interface affiche la progression pour chaque propriété. |
| **3. SYNTHÈSE (`SYNTHESIZING`)** | ⚖️ | Toutes les analyses pour une propriété sont terminées. L'Ouvrière Synthétiseur est activée. Elle compare les différentes versions et rédige sa proposition finale. Cette étape est suivie par le jugement rapide de l'Ouvrière Juge. |
| **4. TERMINÉ (`COMPLETE`)** | ✅ | Toutes les propriétés ont passé avec succès l'étape de Synthèse et de Jugement. Le `Pollen de Connaissance` final est assemblé, sa Trace de Genèse complète est scellée, et il est prêt à être sauvegardé dans la Ruche. |

### **4. L'Interface de Commandement de la Forge**

Le Maître de la Ruche n'est pas un spectateur passif. Il dispose d'une interface de commandement pour gérer le flux de travail de la Forge. Cette interface se présente comme un tableau de bord avec la liste de tous les `PollenGrains` en cours de traitement.

Pour chaque `PollenGrain` dans la liste, l'interface affiche :
* Une miniature de l'image source.
* Le nom de l'entité identifiée.
* Son **état actuel** (⏳, 🔬, ⚖️, ✅).
* Une barre de progression globale.

En sélectionnant un `PollenGrain`, le Maître de la Ruche accède à une vue détaillée qui lui offre les contrôles suivants :

| Action | État(s) où l'action est possible | Description |
| :--- | :--- | :--- |
| **⏸️ Stopper / Mettre en Pause** | `ANALYZING`, `SYNTHESIZING` | Interrompt immédiatement tous les workers actifs pour ce grain. L'état passe à `PAUSED`. Utile si le processus consomme trop de ressources. |
| **▶️ Relancer / Reprendre** | `PAUSED`, `ERROR` | Reprend le travail là où il s'était arrêté. Si un worker spécifique était en erreur, cette action tente de le relancer. |
| **🗑️ Supprimer / Annuler** | Tous les états | Annule définitivement le processus de forge pour ce grain. Le `PollenGrain` est supprimé de la file d'attente et toutes les ressources sont libérées. C'est un acte irréversible. |
| **🔍 Inspecter** | `ANALYZING`, `SYNTHESIZING`, `COMPLETE` | Permet d'ouvrir une vue détaillée montrant le travail de chaque ouvrière. En état `ANALYZING`, on peut voir en temps réel les différentes propositions des Analystes arriver. C'est l'outil de supervision ultime. |