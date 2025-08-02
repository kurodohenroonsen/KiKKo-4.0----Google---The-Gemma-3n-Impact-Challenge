### Classe : Card

* **Stéréotype** : `<<data class>>`, `<<entity>>`
* **Description** : Représente l'entité centrale et unique de notre application : une carte de connaissance. C'est l'objet qui sera stocké dans la base de données Room.
* **Attributs Principaux** :
    * `id: String` : L'identifiant unique (clé primaire).
    * `deckName: String` : Le nom du deck ("Animals", "Plants", etc.).
    * `name: String` : Le nom spécifique de la carte (ex: "Dandelion", "Saarloos Wolfdog").
    * `stats: Map<String, Double>` : Les statistiques chiffrées (sera converti en JSON pour la DB).
    * `quiz: List<QuizQuestion>` : La liste des questions du quiz (sera converti en JSON pour la DB).
    * `aiOverviewHtml: String` : Le HTML brut et nettoyé de l'AI Overview source.
    * `bourdonTTS: String` : Le script narratif généré pour le Bourdon.
    * `provenance: Provenance` : L'objet contenant les données de provenance (sera imbriqué dans la table).
    * **`provenanceLog: String` : (NOUVEAU) Le journal de bord JSON complet et détaillé des inférences.**
    * **`imagesBase64: List<String>` : (NOUVEAU) La liste des images sources encodées en Base64 (sera converti en JSON pour la DB).**
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
* **Description** : Représente la base de données Room de l'application. C'est le point d'accès principal pour toute interaction avec les données stockées localement. Elle est implémentée comme un singleton pour garantir une seule instance dans toute l'application. Elle déclare l'entité `Card` et s'appuie fortement sur la classe `TypeConverters` pour gérer les nouveaux champs complexes.
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
* **Description** : DAO (Data Access Object) pour l'entité `Card`. Cette interface définit toutes les opérations de base de données autorisées (CRUD : Create, Read, Update, Delete) pour les cartes. L'implémentation concrète de ces méthodes est générée automatiquement par Room.
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
* **Description** : Une classe utilitaire cruciale pour Room. Elle contient des méthodes pour convertir des types de données complexes en types simples (généralement `String` via JSON), et vice-versa. Son rôle est étendu pour gérer la nouvelle liste d'images.
* **Méthodes Principales** :
    * `fromQuizList(quiz: List<QuizQuestion>): String` : Convertit une liste de questions en une chaîne JSON.
    * `toQuizList(json: String): List<QuizQuestion>` : Convertit une chaîne JSON en une liste de questions.
    * `fromStatsMap(stats: Map<String, Double>): String` : Convertit une map de stats en une chaîne JSON.
    * `toStatsMap(json: String): Map<String, Double>` : Convertit une chaîne JSON en une map de stats.
    * **`fromStringList(images: List<String>): String` : (NOUVEAU) Convertit une liste de chaînes (pour `imagesBase64`) en une chaîne JSON.**
    * **`toStringList(json: String): List<String>` : (NOUVEAU) Convertit une chaîne JSON en une liste de chaînes.**
* **Relations Principales** :
    * Utilisée par `AppDatabase` pour permettre le stockage correct des champs complexes de l'entité `Card`.

### Classe : IntroActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : Gère la séquence d'introduction lors du tout premier lancement de l'application. Elle utilise une machine à états (`IntroState`) pour orchestrer l'affichage de vidéos, les dialogues du Bourdon (via TTS), et le déclenchement du téléchargement des modèles d'IA.
* **Relations Principales** :
    * Redirige vers `HiveActivity` une fois la séquence terminée.

---

### Classe : LoadingActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : (Classe planifiée) Nouvelle activité qui servira d'écran de chargement. Son rôle sera de déclencher l'initialisation de la base de données via le `CardRepository`, en peuplant la DB avec les objets `Card` complets (incluant provenance détaillée et images Base64) depuis `default_cards.json`.
* **Relations Principales** :
    * Redirigera vers `HiveActivity` ou `MainActivity`.
    * Interagira avec le `CardRepository` (à créer).

---

### Classe : HiveActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : Conçue pour être l'écran d'accueil ou le "hub" principal de l'application. C'est ici que le Butineur pourra visualiser sa collection de `Card`.
* **Relations Principales** :
    * Est lancée par `IntroActivity` ou `LoadingActivity`.

---

### Classe : MainActivity

* **Stéréotype** : `<<Activity>>`
* **Description** : Gère la fonctionnalité "Arène P2P" via l'API Google Nearby Connections. Elle est responsable de la recherche et de la publication d'autres Butineurs à proximité. **Son fonctionnement dépendra de la refactorisation de `PlayerCatalogue` pour utiliser le nouveau modèle `Card`.**
* **Relations Principales** :
    * Utilise `RadarView` et `PlayerAdapter`.
    * Interagit avec le `ConnectionsClient` de Google.

---

### Classe : PlayerAdapter

* **Stéréotype** : `<<Adapter>>`
* **Description** : Un adaptateur pour `RecyclerView` qui gère l'affichage de la liste des Butineurs découverts à proximité. **Il devra être refactorisé pour afficher des informations de deck dérivées de la collection de `Card` du joueur distant, via un `PlayerCatalogue` mis à jour.**
* **Relations Principales** :
    * Est utilisé par `MainActivity`.
    * Manipule des objets `DiscoveredPlayer` et `PlayerCatalogue`.

---

### Classe : RadarView

* **Stéréotype** : `<<View>>` (Custom View)
* **Description** : Une vue personnalisée qui affiche la position des autres Butineurs sur un radar. **Les données qu'elle affiche (`PlayerCatalogue`) devront être refactorisées pour être cohérentes avec le nouveau modèle de données `Card`.**
* **Relations Principales** :
    * Est utilisée par `MainActivity`.
    * Affiche des données provenant d'objets `PlayerCatalogue`.

---

### Classe : DiscoveredPlayer

* **Stéréotype** : `<<data class>>` (UI Model)
* **Description** : Une classe de données simple utilisée spécifiquement par la couche UI pour lier l'identifiant technique d'un joueur (`endpointId`) à son `PlayerCatalogue`. **Subira les mêmes impacts de refactorisation que `PlayerCatalogue`.**
* **Relations Principales** :
    * Utilisée par `PlayerAdapter`.
    * Contient un `PlayerCatalogue`.

### Classe : HoneyCard

* **Stéréotype** : `<<data class>>` **(Déprécié)**
* **Description** : L'ancienne structure pour une carte de connaissance. **Action : Sera entièrement supprimée et remplacée par la nouvelle entité `Card`.**
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
* **Description** : L'ancien conteneur pour l'échange de données via Google Nearby. **Action : Sera entièrement supprimé. Le partage se fera via un nouveau mécanisme d'export/import de `Card` et de leurs journaux de provenance.**
* **Attributs Principaux** :
    * `foragerName: String`
    * `cards: List<HoneyCard>`
* **Relations Principales** :
    * Composition de `HoneyCard`.

---

### Classe : PlayerCatalogue

* **Stéréotype** : `<<data class>>` **(À refactoriser)**
* **Description** : Représente le profil partiel d'un joueur envoyé via Nearby pour la découverte. **Action : Sera conservé, mais sa construction sera modifiée. Il sera généré "à la volée" à partir de la collection de `Card` du joueur, en agrégeant les statistiques et les decks pour la publicité Nearby.**
* **Attributs Principaux** :
    * `playerName: String`
    * `decks: List<Deck>`
    * `latitude: Double?`
    * `longitude: Double?`
    * `wins: Int`
    * `losses: Int`
* **Relations Principales** :
    * Composition de `Deck`.
    * Utilisé par `DiscoveredPlayer`.

---

### Classe : Deck

* **Stéréotype** : `<<data class>>` **(À refactoriser/remplacer)**
* **Description** : Représentait un résumé de deck. **Action : Cette classe sera probablement supprimée. La notion de deck et le comptage des cartes seront dérivés dynamiquement de la collection de `Card` (en faisant un `groupBy` sur le champ `deckName`).**
* **Attributs Principaux** :
    * `name: String`
    * `cardCount: Int`
* **Relations Principales** :
    * Faisait partie de `PlayerCatalogue`.

