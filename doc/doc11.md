<p align="center">
  <img src="../illustrations/doc11_banner.png" alt="A banner for the data structure document, showing a holographic, glowing Kikkō Guardian turtle. From its hexagonal shell, five distinct streams of light emerge, each forming a beautiful data constellation representing the five decks: Food, Plant, Insect, Bird, and Object.">
</p>

# Document 11/10 : L'Anatomie du Miel - Structure des Decks de Connaissance

**Titre :** L'Anatomie du Miel : Architecture des Données pour les Cinq Decks de la Saga

**Objectif :** Définir de manière formelle et exhaustive la structure de données pour chaque `KnowledgeCard` au sein des cinq decks de Kikko's Saga Forge. Ce document sert de référence technique pour les développeurs et de preuve de la profondeur de notre modélisation pour le jury.

---

### **Philosophie Fondamentale : La Structure au Service de la Confiance**

La valeur d'une `KnowledgeCard` ne réside pas seulement dans ses informations, mais dans la **cohérence et la prévisibilité de sa structure**. En définissant un schéma de données strict mais flexible pour chaque deck, nous atteignons plusieurs objectifs stratégiques :

1.  [cite_start]**Précision de la Forge :** La Reine IA (Gemma) dispose d'un cahier des charges clair pour ses tâches de génération et d'extraction, réduisant les hallucinations et améliorant la qualité du "Miel"[cite: 902, 903, 905].
2.  [cite_start]**Cohérence du Gameplay :** Toutes les cartes d'un même deck partagent des attributs comparables, ce qui est essentiel pour l'équilibrage des "Chocs des Sagas" et la pertinence des questions de l'Arbitre IA[cite: 7531, 7532].
3.  [cite_start]**Transparence et Reproductibilité :** Une structure de données bien définie est indispensable pour le "Fil de Provenance", car elle permet à une autre Ruche de vérifier non seulement l'inférence, mais aussi la conformité de la sortie au schéma attendu[cite: 7877, 7881].

### **Propriétés Communes à Toutes les Cartes**

Chaque `KnowledgeCard`, quel que soit son deck, est une entité qui partage un ensemble de propriétés fondamentales. Ces attributs constituent l'épine dorsale de chaque souvenir forgé.

| Propriété | Type de Données | Description | Source d'Information |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | [cite_start]Identifiant unique et clé primaire auto-généré dans la base de données locale[cite: 938, 956]. | Système (Base de données) |
| `specificName` | `String` | [cite_start]Le nom commun et spécifique du sujet de la carte (ex: "Abeille domestique")[cite: 930, 956]. | [cite_start]Reine IA (Gemma) [cite: 857] |
| `deckName` | `String` | [cite_start]Le nom du deck auquel la carte appartient ("Food", "Plant", etc.)[cite: 930, 956]. [cite_start]La liste maîtresse est définie dans `GameConstants`[cite: 15]. | [cite_start]Reine IA (Gemma) [cite: 857] |
| `imagePath` | `String?` | [cite_start]Chemin d'accès local vers le fichier image source principal de la carte[cite: 930, 956]. | Système (Capture du Pollen) |
| `confidence` | `Float` | [cite_start]Score de confiance (entre 0.0 et 1.0) de la Reine IA lors de l'identification initiale[cite: 930, 956]. | [cite_start]Reine IA (Gemma) [cite: 857] |
| `reasoning` | `Reasoning` | [cite_start]Objet contenant l'analyse textuelle de la Reine IA (`visualAnalysis`, `evidenceCorrelation`)[cite: 930, 956]. | [cite_start]Reine IA (Gemma) [cite: 858] |
| `description` | `String?` | [cite_start]La description narrative et engageante du sujet, générée pour être lue à haute voix[cite: 930, 956]. | [cite_start]Reine IA (Gemma) [cite: 864] |
| `quiz` | `List<QuizQuestion>?` | [cite_start]Une liste de questions à choix multiples sur le sujet de la carte[cite: 930, 957]. | [cite_start]Reine IA (Gemma) [cite: 877] |
| `translations`| `Map<String, TranslatedContent>?`| [cite_start]Une carte associant un code de langue (ex: "fr") à un objet contenant les champs traduits (`description`, `reasoning`, `quiz`)[cite: 930, 941, 953]. | [cite_start]Reine IA (Gemma) [cite: 1269] |

### **Propriétés Spécifiques par Deck**

La flexibilité de notre système réside dans la structure du champ `stats` et des champs additionnels (`allergens`, `ingredients`), qui sont spécifiques à chaque deck. Ces schémas guident la Reine IA lors de l'étape d'extraction des données.

---

#### **Deck 🍔 Food**
Ce deck couvre les aliments, qu'ils soient des ingrédients bruts ou des plats préparés. Sa structure est la plus complexe en raison des impératifs de sécurité (allergènes) et de détail (ingrédients).

| Propriété (dans `stats.items`) | Type de Données | Description |
| :--- | :--- | :--- |
| `Energy (kcal per 100g)` | `String` | [cite_start]Valeur énergétique de l'aliment[cite: 627, 895]. |
| `Protein (g per 100g)` | `String` | [cite_start]Quantité de protéines pour 100g[cite: 627, 895]. |
| *(Autres valeurs nutritionnelles)* | `String` | Le prompt peut être étendu pour inclure d'autres macronutriments (lipides, glucides). |

| Propriété (Niveau Racine) | Type de Données | Description |
| :--- | :--- | :--- |
| `allergens` | `List<String>?` | [cite_start]Liste des allergènes majeurs identifiés dans l'aliment[cite: 628, 642, 843, 871]. |
| `ingredients` | `List<String>?` | [cite_start]Liste des ingrédients composant le produit alimentaire[cite: 643, 645, 843, 871]. |

---

#### **Deck 🌿 Plant**
Ce deck est dédié au monde végétal, des fleurs sauvages aux arbres majestueux.

| Propriété (dans `stats.items`) | Type de Données | Description |
| :--- | :--- | :--- |
| `Maximum Height (m)` | `String` | [cite_start]La hauteur maximale que la plante peut atteindre[cite: 627, 895]. |
| `Flowering Period (months)`| `String` | [cite_start]La durée de la période de floraison en mois[cite: 627, 895]. |
| `Lifespan (years)` | `String` | [cite_start]La durée de vie moyenne de la plante[cite: 627, 895]. |
| `Minimum Temperature (°C)`| `String` | [cite_start]La température minimale que la plante peut tolérer[cite: 627, 895]. |

---

#### **Deck 🐞 Insect**
Ce deck catalogue le monde fascinant des insectes.

| Propriété (dans `stats.items`) | Type de Données | Description |
| :--- | :--- | :--- |
| `Average Length (mm)` | `String` | [cite_start]La longueur moyenne de l'insecte[cite: 627, 895]. |
| `Lifespan (days)` | `String` | [cite_start]La durée de vie moyenne en jours[cite: 627, 895]. |
| `Number of Legs` | `String` | [cite_start]Le nombre de pattes de l'insecte[cite: 627, 895]. |
| `Flying Speed (km/h)` | `String` | [cite_start]La vitesse de vol, si applicable[cite: 627, 895]. |

---

#### **Deck 🐦 Bird**
Ce deck se concentre sur les espèces d'oiseaux.

| Propriété (dans `stats.items`) | Type de Données | Description |
| :--- | :--- | :--- |
| `Wingspan (cm)` | `String` | [cite_start]L'envergure moyenne des ailes[cite: 627, 895]. |
| `Average Weight (g)` | `String` | [cite_start]Le poids moyen de l'oiseau[cite: 627, 895]. |
| `Lifespan (years)` | `String` | [cite_start]La durée de vie moyenne en années[cite: 627, 895]. |
| `Clutch Size (eggs)` | `String` | [cite_start]Le nombre moyen d'œufs par couvée[cite: 627, 895]. |

---

#### **Deck ⚙️ Object**
Ce deck sert de catégorie fourre-tout pour tout ce qui n'est pas biologique. Sa structure est intentionnellement générique pour s'adapter à une grande variété de sujets (véhicules, bâtiments, outils, etc.). La Reine IA est chargée de déterminer les 3 à 5 statistiques les plus pertinentes pour l'objet identifié.

| Propriété (dans `stats.items`) | Type de Données | Description |
| :--- | :--- | :--- |
| `Statistique Pertinente 1` | `String` | Une caractéristique clé de l'objet (ex: "Matériau Principal", "Vitesse Maximale"). |
| `Statistique Pertinente 2` | `String` | Une autre caractéristique clé (ex: "Date de Création", "Poids"). |
| `Statistique Pertinente 3` | `String` | Une troisième caractéristique clé (ex: "Pays d'Origine", "Puissance"). |

### **Conclusion : Un Avantage Compétitif Multi-facettes**

Cette architecture de données structurée n'est pas un simple détail technique ; c'est un avantage compétitif fondamental. Elle garantit que chaque `KnowledgeCard` est non seulement une pièce de connaissance riche et détaillée, mais aussi un objet de jeu cohérent et un artefact de données vérifiable. C'est sur cette fondation solide que repose toute la philosophie de confiance et de personnalisation de Kikko's Saga Forge.