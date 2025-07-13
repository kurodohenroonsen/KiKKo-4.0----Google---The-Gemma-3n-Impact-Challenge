### Classe : Card

* **Stéréotype** : `<<data class>>`, `<<entity>>`
* **Description** : Représente l'entité centrale et unique de notre application : une carte de connaissance. C'est l'objet qui sera stocké dans la base de données Room. Il remplace les anciennes classes `HoneyCard` et `TrustedPackage`.
* **Attributs Principaux** :
    * `id: String` : L'identifiant unique (clé primaire).
    * `deckName: String` : Le nom du deck ("Animals", "Plants", etc.).
    * `name: String` : Le nom spécifique de la carte (ex: "Dandelion", "Saarloos Wolfdog").
    * `stats: Map<String, Double>` : Les statistiques chiffrées (sera converti en JSON pour la DB).
    * `quiz: List<QuizQuestion>` : La liste des questions du quiz (sera converti en JSON pour la DB).
    * `aiOverviewHtml: String` : Le HTML brut et nettoyé de l'AI Overview source.
    * `bourdonTTS: String` : Le script narratif généré pour le Bourdon.
    * `provenance: Provenance` : L'objet contenant les données de provenance (sera imbriqué dans la table).
* **Relations Principales** :
    * Composition de 1..* `QuizQuestion`.
    * Composition de 1 `Provenance`.

---

### Classe : QuizQuestion

* **Stéréotype** : `<<data class>>`
* **Description** : Représente une seule question à choix multiple pour une carte. N'est pas une table séparée, son instance sera stockée dans la liste `quiz` de l'entité `Card`.
* **Attributs Principaux** :
    * `q: String` : Le texte de la question (clé JSON courte).
    * `o: List<String>` : La liste des 4 options de réponse (clé JSON courte).
    * `c: Int` : L'index de la bonne réponse (clé JSON courte).
* **Relations Principales** :
    * Agrégation par `Card`.

---

### Classe : Provenance

* **Stéréotype** : `<<data class>>`, `<<embedded>>`
* **Description** : Contient les métadonnées sur l'origine d'une carte. Ses champs seront directement intégrés comme des colonnes dans la table `Card`.
* **Attributs Principaux** :
    * `type: ProvenanceType` : L'origine (`HIVE_FORGED` ou `HORNET_SOURCED`).
    * `sourceName: String` : Le nom de la source (ex: "AI Overview (Google)").
    * `isReproducible: Boolean` : Vrai si l'inférence peut être rejouée.
* **Relations Principales** :
    * Composant de `Card`.
    * Utilise l'énumération `ProvenanceType`.

---

### Classe : ProvenanceType

* **Stéréotype** : `<<enum>>`
* **Description** : Définit les types d'origine possibles pour une carte.
* **Attributs Principaux** :
    * `HIVE_FORGED`
    * `HORNET_SOURCED`
* **Relations Principales** :
    * Utilisé par `Provenance`.

### Classe : AppDatabase

* **Stéréotype** : `<<Database>>` (RoomDatabase)
* **Description** : Représente la base de données Room de l'application. C'est le point d'accès principal pour toute interaction avec les données stockées localement. Elle est implémentée comme un singleton pour garantir une seule instance dans toute l'application. Elle déclare les entités (`Card`) qui composent la base de données et fournit les DAOs pour y accéder.
* **Méthodes Principales** :
    * `cardDao(): CardDao` : Fournit une instance du DAO pour les cartes.
    * `getInstance(context: Context): AppDatabase` : Méthode statique pour obtenir l'instance unique de la base de données.
* **Relations Principales** :
    * Définit `Card` comme son entité.
    * Fournit une instance de `CardDao`.
    * Utilise la classe `TypeConverters`.

---

### Classe : CardDao

* **Stéréotype** : `<<DAO>>` (Interface)
* **Description** : DAO (Data Access Object) pour l'entité `Card`. Cette interface définit toutes les opérations de base de données autorisées (CRUD : Create, Read, Update, Delete) pour les cartes. L'implémentation concrète de ces méthodes est générée automatiquement par Room lors de la compilation.
* **Méthodes Principales** :
    * `insertAll(cards: List<Card>)` : Insère une liste de cartes.
    * `getById(id: String): Card?` : Récupère une carte par son identifiant unique.
    * `getAll(): List<Card>` : Récupère toutes les cartes de la base.
    * `getCount(): Int` : Compte le nombre total de cartes dans la base.
* **Relations Principales** :
    * Manipule l'entité `Card`.
    * Est fournie par `AppDatabase`.

---

### Classe : TypeConverters

* **Stéréotype** : `<<Utility>>`
* **Description** : Une classe utilitaire cruciale pour Room. Elle contient des méthodes pour convertir des types de données complexes (que Room ne peut pas stocker nativement) en types simples (généralement `String` via JSON), et vice-versa. Cela permet de stocker des listes et des objets dans une seule colonne de la base de données.
* **Méthodes Principales** :
    * `fromQuizList(quiz: List<QuizQuestion>): String` : Convertit une liste de questions en une chaîne JSON.
    * `toQuizList(json: String): List<QuizQuestion>` : Convertit une chaîne JSON en une liste de questions.
    * `fromStatsMap(stats: Map<String, Double>): String` : Convertit une map de stats en une chaîne JSON.
    * `toStatsMap(json: String): Map<String, Double>` : Convertit une chaîne JSON en une map de stats.
* **Relations Principales** :
    * Utilisée par `AppDatabase` pour permettre le stockage correct des champs complexes de l'entité `Card`.


### Classe : IntroActivity

* **Stéréotype** : `<<Activity>>`
* [cite_start]**Description** : Gère la séquence d'introduction lors du tout premier lancement de l'application[cite: 668]. [cite_start]Elle utilise une machine à états (`IntroState`) pour orchestrer l'affichage de vidéos, les dialogues du Bourdon (via TTS), et le déclenchement du téléchargement des modèles d'IA[cite: 651, 674].
* **Relations Principales** :
    * [cite_start]Redirige vers `HiveActivity` une fois la séquence terminée[cite: 680].

---

### Classe : LoadingActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : (Classe planifiée, non existante) Nouvelle activité qui servira d'écran de chargement. Son rôle sera de vérifier l'état de l'application et de déclencher l'initialisation de la base de données à partir de `default_cards.json` si nécessaire, avant de rediriger vers l'écran principal. Deviendra la nouvelle activité de démarrage de l'application.
* **Relations Principales** :
    * Redirigera vers `HiveActivity` ou `MainActivity`.
    * Interagira avec le `CardRepository` (à créer) pour peupler la base de données.

---

### Classe : HiveActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : Conçue pour être l'écran d'accueil ou le "hub" principal de l'application. [cite_start]Actuellement, elle affiche une simple vidéo de fond en boucle représentant l'intérieur de la Ruche[cite: 649, 650].
* **Relations Principales** :
    * [cite_start]Est lancée par `IntroActivity` après l'initialisation[cite: 680].

---

### Classe : MainActivity

* **Stéréotype** : `<<Activity>>`
* [cite_start]**Description** : Gère la fonctionnalité "Arène P2P" via l'API Google Nearby Connections[cite: 707, 729]. [cite_start]Elle est responsable de la recherche (`discovery`) et de la publication (`advertising`) d'autres Butineurs à proximité[cite: 719, 714]. Elle affiche les joueurs trouvés via une `RadarView` et un `RecyclerView`.
* **Relations Principales** :
    * Utilise `RadarView` et `PlayerAdapter`.
    * Interagit avec le `ConnectionsClient` de Google.

---

### Classe : PlayerAdapter

* **Stéréotype** : `<<Adapter>>`
* **Description** : Un adaptateur pour `RecyclerView` qui gère l'affichage de la liste des Butineurs découverts à proximité. [cite_start]Il prend les données d'un `PlayerCatalogue` et les affiche dans la vue `item_player_card.xml`[cite: 741, 742].
* **Relations Principales** :
    * Est utilisé par `MainActivity`.
    * Manipule des objets `DiscoveredPlayer` et `PlayerCatalogue`.

---

### Classe : RadarView

* **Stéréotype** : `<<View>>` (Custom View)
* **Description** : Une vue personnalisée qui affiche la position des autres Butineurs sur un radar. [cite_start]Elle utilise les capteurs du téléphone (accéléromètre, magnétomètre) pour s'orienter en fonction de la boussole de l'appareil[cite: 748, 764, 765].
* **Relations Principales** :
    * Est utilisée par `MainActivity`.
    * Affiche des données provenant d'objets `PlayerCatalogue`.

---

### Classe : DiscoveredPlayer

* **Stéréotype** : `<<data class>>` (UI Model)
* [cite_start]**Description** : Une classe de données simple utilisée spécifiquement par la couche UI pour lier l'identifiant technique d'un joueur (`endpointId`) à son catalogue de données (`PlayerCatalogue`)[cite: 694].
* **Relations Principales** :
    * Utilisée par `PlayerAdapter`.
    * Contient un `PlayerCatalogue`.

### Classe : HoneyCard

* **Stéréotype** : `<<data class>>` **(Déprécié)**
* [cite_start]**Description** : L'ancienne structure de données pour une carte de connaissance, définie dans `KikkoData.kt`[cite: 57]. Très simple, elle ne contenait que les informations de base. Elle sera entièrement remplacée par la nouvelle classe `Card`, beaucoup plus riche et structurée.
* **Attributs Principaux** :
    * `id: String`
    * `name: String`
    * `type: String`
    * `description: String`
* **Relations Principales** :
    * Faisait partie de `TrustedPackage`.

---

### Classe : TrustedPackage

* **Stéréotype** : `<<data class>>` **(Déprécié)**
* [cite_start]**Description** : L'ancien conteneur pour l'échange de données entre Butineurs via Google Nearby, défini dans `KikkoData.kt`[cite: 57]. [cite_start]Il encapsulait une liste de `HoneyCard`[cite: 57]. Ce mécanisme sera remplacé par un système d'échange basé sur la nouvelle classe `Card` et son `Provenance`.
* **Attributs Principaux** :
    * [cite_start]`foragerName: String` [cite: 57]
    * [cite_start]`cards: List<HoneyCard>` [cite: 57]
* **Relations Principales** :
    * Composition de `HoneyCard`.

---

### Classe : PlayerCatalogue

* **Stéréotype** : `<<data class>>` **(À refactoriser)**
* [cite_start]**Description** : Représente le profil partiel d'un joueur découvert via Nearby, défini dans `KikkoModels.kt`[cite: 61]. [cite_start]Il contient des informations sur le nom du joueur, ses decks, ses victoires/défaites et sa position[cite: 61, 62, 63]. Cette classe sera probablement conservée, mais modifiée pour être générée à partir d'une liste de `Card` plutôt que de l'ancienne classe `Deck`.
* **Attributs Principaux** :
    * [cite_start]`playerName: String` [cite: 61]
    * [cite_start]`decks: List<Deck>` [cite: 61]
    * [cite_start]`latitude: Double?` [cite: 62]
    * [cite_start]`longitude: Double?` [cite: 62]
    * [cite_start]`wins: Int` [cite: 63]
    * [cite_start]`losses: Int` [cite: 63]
* **Relations Principales** :
    * Composition de `Deck`.
    * Utilisé par `DiscoveredPlayer`.

---

### Classe : Deck

* **Stéréotype** : `<<data class>>` **(À refactoriser/remplacer)**
* [cite_start]**Description** : Représentait un deck de cartes avec simplement son nom et le nombre de cartes, défini dans `KikkoModels.kt`[cite: 60]. Ce concept sera désormais directement géré par le champ `deckName` de la classe `Card`. Cette classe `Deck` pourrait disparaître au profit d'une logique de regroupement dynamique sur la collection de `Card` du joueur.
* **Attributs Principaux** :
    * [cite_start]`name: String` [cite: 60]
    * [cite_start]`cardCount: Int` [cite: 60]
* **Relations Principales** :
    * Faisait partie de `PlayerCatalogue`.