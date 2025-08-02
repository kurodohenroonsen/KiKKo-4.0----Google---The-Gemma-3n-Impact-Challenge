<p align="center">
  <img src="../illustrations/doc11_banner.png" alt="A banner for the data structure document, showing a holographic, glowing Kikkō Guardian turtle. From its hexagonal shell, five distinct streams of light emerge, each forming a beautiful data constellation representing the five decks: Food, Plant, Insect, Bird, and Object.">
</p>

# Document 11/10 (v2.0) : L'Anatomie du Miel - Structure des Decks de Connaissance

**Titre :** L'Anatomie du Miel : Architecture des Données pour les Cinq Decks de la Saga

**Objectif :** Définir de manière formelle et exhaustive la structure de données pour chaque `KnowledgeCard` au sein des cinq decks de Kikko's Saga Forge. Ce document sert de référence technique pour les développeurs et de preuve de la profondeur de notre modélisation pour le jury.

---

### **Philosophie Fondamentale : La Structure au Service de la Confiance**

La valeur d'une `KnowledgeCard` ne réside pas seulement dans ses informations, mais dans la **cohérence et la prévisibilité de sa structure**. En définissant un schéma de données strict mais flexible pour chaque deck, nous atteignons plusieurs objectifs stratégiques :

1.  **Précision de la Forge :** La Reine IA (Gemma) dispose d'un cahier des charges clair pour ses tâches de génération et d'extraction, réduisant les hallucinations et améliorant la qualité du "Miel".
2.  **Cohérence du Gameplay :** Toutes les cartes d'un même deck partagent des attributs comparables, ce qui est essentiel pour l'équilibrage des "Chocs des Sagas" et la pertinence des questions de l'Arbitre IA.
3.  **Transparence et Reproductibilité :** Une structure de données bien définie est indispensable pour le "Fil de Provenance", car elle permet à une autre Ruche de vérifier non seulement l'inférence, mais aussi la conformité de la sortie au schéma attendu.

### **Tableau Récapitulatif de la Structure des Données**

Le tableau suivant détaille chaque propriété, en distinguant celles qui sont communes à toutes les cartes de celles spécifiques à certains decks.

| Propriété | Description | Food | Plant | Insect | Bird | Object | Standard / Source |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **A. Tron Commun (Toutes les Cartes)** | | | | | | | |
| `id` | [cite_start]Identifiant unique (clé primaire). [cite: 5612, 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `specificName` | [cite_start]Nom commun et spécifique du sujet. [cite: 5614, 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `deckName` | [cite_start]Deck d'appartenance. [cite: 5613, 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `imagePath` | [cite_start]Chemin local vers l'image source. [cite: 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `confidence` | [cite_start]Score de confiance de l'identification IA. [cite: 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `reasoning` | [cite_start]Analyse de l'IA (visuelle et corrélation). [cite: 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `description` | [cite_start]Description narrative générée par l'IA. [cite: 5618, 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `quiz` | [cite_start]Liste de questions à choix multiples. [cite: 5616, 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `translations` | [cite_start]Contenus traduits pour différentes langues. [cite: 7282] | ✅ | ✅ | ✅ | ✅ | ✅ | `KnowledgeCard.kt` |
| `provenanceLog` | [cite_start]Journal JSON complet de la forge (inférences). [cite: 5619] | ✅ | ✅ | ✅ | ✅ | ✅ | `Class.md` |
| **B. Tron Commun Biologique** | | | | | | | |
| `scientificName` | Nom scientifique (latin). | | ✅ | ✅ | ✅ | | Darwin Core (DwC) |
| `vernacularName` | Nom commun (synonyme de `specificName`). | | ✅ | ✅ | ✅ | | Darwin Core (DwC) |
| `habitat` | Environnement naturel de l'espèce. | | ✅ | ✅ | ✅ | | DwC, ABCD |
| `conservationStatus` | Statut de conservation (ex: "En danger"). | | ✅ | ✅ | ✅ | | UICN / Extension |
| **C. Propriétés Spécifiques par Deck** | | | | | | | |
| *-- Deck Food --* | | | | | | | |
| `stats.Energy (kcal/100g)` | [cite_start]Valeur énergétique. [cite: 7296] | ✅ | | | | | `PromptGenerator.kt` |
| `stats.Protein (g/100g)` | [cite_start]Quantité de protéines. [cite: 7296] | ✅ | | | | | `PromptGenerator.kt` |
| `allergens` | [cite_start]Liste des allergènes majeurs identifiés. [cite: 7282] | ✅ | | | | | `KnowledgeCard.kt` |
| `ingredients` | [cite_start]Liste des ingrédients du produit. [cite: 7282] | ✅ | | | | | `KnowledgeCard.kt` |
| *-- Deck Plant --* | | | | | | | |
| `stats.Max Height (m)` | [cite_start]Hauteur maximale de la plante. [cite: 7296] | | ✅ | | | | `PromptGenerator.kt` |
| `stats.Flowering Period` | Période de floraison. | | ✅ | | | | `PromptGenerator.kt` |
| `stats.Lifespan (years)` | [cite_start]Durée de vie moyenne. [cite: 7296] | | ✅ | | | | `PromptGenerator.kt` |
| `stats.Uses` | Utilisations (médicinale, culinaire, etc.). | | ✅ | | | | Botanique Économique |
| *-- Deck Insect --* | | | | | | | |
| `stats.Avg Length (mm)` | [cite_start]Longueur moyenne. [cite: 7296] | | | ✅ | | | `PromptGenerator.kt` |
| `stats.Lifespan (days)` | [cite_start]Durée de vie moyenne. [cite: 7296] | | | ✅ | | | `PromptGenerator.kt` |
| `stats.Diet` | Régime alimentaire (herbivore, etc.). | | | ✅ | | | ABCD |
| `stats.Lifecycle` | Étapes du cycle de vie. | | | ✅ | | | ABCD |
| *-- Deck Bird --* | | | | | | | |
| `stats.Wingspan (cm)` | [cite_start]Envergure des ailes. [cite: 7296] | | | | ✅ | | `PromptGenerator.kt` |
| `stats.Avg Weight (g)` | [cite_start]Poids moyen. [cite: 7296] | | | | ✅ | | `PromptGenerator.kt` |
| `stats.Clutch Size` | [cite_start]Nombre moyen d'œufs par couvée. [cite: 7296] | | | | ✅ | | `PromptGenerator.kt` |
| `stats.Social Behavior` | Comportement social (solitaire, groupe). | | | | ✅ | | ABCD |
| *-- Deck Object --* | | | | | | | |
| `stats.Primary Material` | Matériau principal de l'objet. | | | | | ✅ | Proposition |
| `stats.Date of Creation` | Date de fabrication ou de conception. | | | | | ✅ | Proposition |
| `stats.Country of Origin`| Pays d'origine ou de fabrication. | | | | | ✅ | Proposition |