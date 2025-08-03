<p align="center">
  <img src="../illustrations/doc11_banner.png" alt="A banner for the data structure document, showing a holographic, glowing Kikkō Guardian turtle. From its hexagonal shell, four distinct streams of light emerge, each forming a beautiful data constellation representing the four decks: Food, Plant, Insect, and Bird.">
</p>

# Document 11/10 (v3.0) : L'Anatomie du Miel - Structure des Decks de Connaissance

**Titre :** L'Anatomie du Miel : Architecture des Données pour les Quatre Decks de la Saga 🍯

**Objectif :** Définir de manière formelle et exhaustive la structure de données pour chaque `KnowledgeCard` au sein des quatre decks de Kikko's Saga Forge. Ce document sert de référence technique pour les développeurs et de preuve de la profondeur de notre modélisation pour le jury.

---

### **Philosophie Fondamentale : La Structure au Service de la Confiance** 💯

La valeur d'une `KnowledgeCard` ne réside pas seulement dans ses informations, mais dans la **cohérence et la prévisibilité de sa structure**. En définissant un schéma de données strict mais flexible pour chaque deck, nous atteignons plusieurs objectifs stratégiques :

1.  **Précision de la Forge 🎯:** La Reine IA (Gemma) dispose d'un cahier des charges clair pour ses tâches de génération et d'extraction, réduisant les hallucinations et améliorant la qualité du "Miel".
2.  **Cohérence du Gameplay 🎮:** Toutes les cartes d'un même deck partagent des attributs comparables, ce qui est essentiel pour l'équilibrage des "Chocs des Sagas" et la pertinence des questions de l'Arbitre IA.
3.  **Transparence et Reproductibilité ⛓️:** Une structure de données bien définie est indispensable pour le "Fil de Provenance", car elle permet à une autre Ruche de vérifier non seulement l'inférence, mais aussi la conformité de la sortie au schéma attendu.

### **Tableau Récapitulatif de la Structure des Données**

Le tableau suivant détaille chaque propriété, en distinguant celles qui sont communes à toutes les cartes de celles spécifiques à certains decks.

| Propriété | Description | 🍔 Food | 🌿 Plant | 🐞 Insect | 🐦 Bird | Standard / Source |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **A. Tron Commun (Toutes les Cartes)** | | | | | | |
| `id` | Identifiant unique (clé primaire). | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `specificName` | Nom commun et spécifique du sujet. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `deckName` | Deck d'appartenance. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `imagePath` | Chemin local vers l'image source. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `confidence` | Score de confiance de l'identification IA. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `reasoning` | Analyse de l'IA (visuelle et corrélation). | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `description` | Description narrative générée par l'IA. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `quiz` | Liste de questions à choix multiples. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `translations` | Contenus traduits pour différentes langues. | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `provenanceLog` | Journal JSON complet de la forge (inférences). | ✅ | ✅ | ✅ | ✅ | `Class.md` |
| **B. Tron Commun Biologique** | | | | | | |
| `scientificName` | Nom scientifique (latin). | | ✅ | ✅ | ✅ | Darwin Core (DwC) |
| `vernacularName`| Nom commun (synonyme de `specificName`). | | ✅ | ✅ | ✅ | Darwin Core (DwC) |
| `habitat` | Environnement naturel de l'espèce. | | ✅ | ✅ | ✅ | DwC, ABCD |
| `conservationStatus` | Statut de conservation (ex: "En danger"). | | ✅ | ✅ | ✅ | UICN / Extension |
| **C. Propriétés Spécifiques par Deck** | | | | | | |
| *-- 🍔 Deck Food --* | | | | | | |
| `stats.Energy (kcal/100g)` | Valeur énergétique. | ✅ | | | | `PromptGenerator.kt` |
| `stats.Protein (g/100g)` | Quantité de protéines. | ✅ | | | | `PromptGenerator.kt` |
| `allergens` | Liste des allergènes majeurs identifiés. | ✅ | | | | `KnowledgeCard.kt` |
| `ingredients` | Liste des ingrédients du produit. | ✅ | | | | `KnowledgeCard.kt` |
| *-- 🌿 Deck Plant --* | | | | | | |
| `stats.Max Height (m)` | Hauteur maximale de la plante. | | ✅ | | | `PromptGenerator.kt` |
| `stats.Flowering Period` | Période de floraison. | | ✅ | | | `PromptGenerator.kt` |
| `stats.Lifespan (years)` | Durée de vie moyenne. | | ✅ | | | `PromptGenerator.kt` |
| `stats.Uses` | Utilisations (médicinale, culinaire, etc.). | | ✅ | | | Botanique Économique |
| *-- 🐞 Deck Insect --* | | | | | | |
| `stats.Avg Length (mm)` | Longueur moyenne. | | | ✅ | | `PromptGenerator.kt` |
| `stats.Lifespan (days)` | Durée de vie moyenne. | | | ✅ | | `PromptGenerator.kt` |
| `stats.Diet` | Régime alimentaire (herbivore, etc.). | | | ✅ | | ABCD |
| `stats.Lifecycle` | Étapes du cycle de vie. | | | ✅ | | ABCD |
| *-- 🐦 Deck Bird --* | | | | | | |
| `stats.Wingspan (cm)` | Envergure des ailes. | | | | ✅ | `PromptGenerator.kt` |
| `stats.Avg Weight (g)` | Poids moyen. | | | | ✅ | `PromptGenerator.kt` |
| `stats.Clutch Size` | Nombre moyen d'œufs par couvée. | | | | ✅ | `PromptGenerator.kt` |
| `stats.Social Behavior`| Comportement social (solitaire, groupe). | | | | ✅ | ABCD |