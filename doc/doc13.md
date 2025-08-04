# Document 13/10 (v2.0) : L'Arène de Raffinage du Miel

**Titre :** L'Arène de Raffinage : Du Grain Brut au Miel de Compétition

**Objectif :** Définir le cycle de vie complet d'une `KnowledgeCard` (le "Miel"), depuis la capture photographique jusqu'à son raffinement via un processus de **validation croisée** contrôlé par l'utilisateur, mettant en lice les deux Reines IA (Gemma 3n 2B et 4B) avec de multiples configurations.

---

### **1. Philosophie : Un Processus en Trois Actes 🎬**

Le voyage d'une information, de l'image à la connaissance vérifiée, se déroule en trois actes distincts, conçus pour offrir une expérience à la fois simple et d'une profondeur inégalée.

1.  **📸 Acte I : La Capture (Simple et Instantanée)**
    L'utilisateur capture le monde. L'application gère la complexité en arrière-plan.
2.  **🤖 Acte II : L'Identification (Automatique et Utile)**
    Une IA rapide fournit immédiatement une carte de base, utilisable et déjà informative.
3.  **🔬 Acte III : Le Raffinage (Contrôlé et Puissant)**
    L'utilisateur devient le Maître de l'Arène. Il peut, s'il le souhaite, lancer un tournoi d'IA pour affiner chaque facette de la connaissance, comparer les "esprits" des modèles et devenir le juge final de la vérité.

### **2. Le Déroulement du Flux, Étape par Étape**

#### **Étape 1 : Prise de Photos et Constitution du Grain 📸**
* L'utilisateur prend une ou plusieurs photos d'un sujet.
* En arrière-plan, l'application crée un `PollenGrain`, un dossier de travail contenant les images et les métadonnées initiales.

#### **Étape 2 : Identification Automatique et Création du "Miel Brut" 🍯**
* **Automatiquement**, dès la création du grain, une seule ouvrière IA rapide (probablement Gemma 3n 2B avec des paramètres standards) est lancée.
* **Sa seule tâche est l'identification principale** : elle détermine le `deckName` et le `specificName` du sujet.
* Le résultat est une carte de "Miel Brut" : une `KnowledgeCard` de base, avec seulement son nom et son image.
* Cette carte est immédiatement placée dans le deck approprié de la Ruche. Elle est visible et utilisable, bien que ses informations soient encore incomplètes.

#### **Étape 3 : L'Arène de Raffinage dans la Vue Détaillée 🔬**
* L'utilisateur ouvre la vue détaillée de ce "Miel Brut".
* Il y découvre toutes les propriétés potentielles de la carte, regroupées par thèmes (ex: "Caractéristiques Physiques", "Écologie").
* Chaque propriété (ex: `description`, `stats.lifespan`) est initialement vide et accompagnée d'un bouton : **[Lancer la Compétition ⚔️]**.

#### **Étape 4 : Le Tournoi des Analystes**
* En cliquant sur **[Lancer la Compétition ⚔️]**, l'utilisateur déclenche le benchmark complet.
* **Huit tâches d'analyse** sont ajoutées à la file d'attente de la Forge :
    * **Reine IA 1 : Gemma 3n 2B** (4 configs de T°/TopK variées)
    * **Reine IA 2 : Gemma 3n 4B** (4 configs de T°/TopK variées)
* L'utilisateur peut consulter les 8 résultats bruts au fur et à mesure qu'ils arrivent.

#### **Étape 5 : La Validation Croisée et le Jugement Final 👑**
* Une fois le tournoi des analystes terminé, le bouton **[Lancer la Synthèse Finale]** devient disponible. Le cliquer déclenche le processus de jugement final.
* **Phase 5.1 - Synthèse Parallèle :**
    * Une ouvrière **Synthétiseur (basée sur Gemma 2B)** reçoit les **8 rapports d'analyse** et produit la **Synthèse A**.
    * Une ouvrière **Synthétiseur (basée sur Gemma 4B)** reçoit les **8 mêmes rapports** et produit la **Synthèse B**.
* **Phase 5.2 - Jugement Croisé :**
    * Les deux synthèses sont soumises aux deux Reines Juge (configurées pour une objectivité maximale, T° 0.0).
* **Phase 5.3 - Le Rapport Final :**
    * L'interface présente à l'utilisateur une liste des **4 propositions finales**, chacune avec un score de confiance calculé par la Juge :
        1.  **Proposition A/2B :** `Synthèse A` jugée par `Reine Juge 2B` (Confiance : 98%)
        2.  **Proposition B/2B :** `Synthèse B` jugée par `Reine Juge 2B` (Confiance : 95%)
        3.  **Proposition A/4B :** `Synthèse A` jugée par `Reine Juge 4B` (Confiance : 99%)
        4.  **Proposition B/4B :** `Synthèse B` jugée par `Reine Juge 4B` (Confiance : 97%)
* **Le Choix du Maître Forgeron :**
    * **Par défaut**, la valeur de la carte est automatiquement définie sur la proposition ayant le **plus haut score de confiance** (dans cet exemple, la Proposition A/4B).
    * L'utilisateur a le **pouvoir final**. Il peut :
        * Accepter la valeur par défaut.
        * Sélectionner l'une des 3 autres propositions.
        * Ignorer les propositions et choisir l'un des 8 résultats d'analyse bruts.
        * **Introduire manuellement sa propre valeur**, devenant ainsi la source ultime de vérité pour sa carte.