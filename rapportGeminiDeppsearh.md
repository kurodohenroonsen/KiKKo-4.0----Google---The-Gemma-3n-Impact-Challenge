Rapport sur les Meilleures Pratiques de Documentation UML pour "Kikko's Saga Forge"
Ce rapport fournit un guide exhaustif et des conventions pour la création d'une documentation UML de classe mondiale pour le projet "Kikko's Saga Forge". L'objectif est de produire des diagrammes qui soient non seulement techniquement précis, mais aussi clairs, professionnels et esthétiquement en adéquation avec l'identité du projet, en utilisant PlantUML comme outil de génération.

Meilleures Pratiques pour UML dans un Contexte Kotlin/Android Moderne
Cette section établit les conventions fondamentales pour représenter avec précision les technologies modernes au cœur de l'architecture cible de Kikko. Nous allons au-delà de l'UML générique pour créer un dialecte spécifique qui parle couramment Kotlin et SQL natif.

Représenter les Fonctionnalités Idiomatiques de Kotlin en PlantUML
La modélisation des fonctionnalités spécifiques au langage Kotlin, qui ne sont pas natives de l'UML standard, est essentielle pour que nos diagrammes soient à la fois précis et expressifs.

Data Classes
Les data class de Kotlin, telles que PlayerCatalogue et Deck dans le code existant, sont au cœur de la modélisation des données du projet. Pour les distinguer clairement des classes ordinaires, nous utiliserons un stéréotype personnalisé, <<data>>.

class HoneyCard <<data>> {
  +id: String
  +name: String
  +type: String
  +description: String
}

Sealed Classes
Les sealed class sont fondamentales en Kotlin pour modéliser des hiérarchies restreintes. En UML, nous représenterons cette relation en utilisant l'héritage standard (<|--) tout en ajoutant un stéréotype <<sealed>> à la classe parente.

abstract class ProvenanceSource <<sealed>> {
  +sourceName: String
}

class HiveForgedSource extends ProvenanceSource
class HornetSourcedSource extends ProvenanceSource

Companion Objects & Singletons
Les singletons autonomes seront déclarés avec le mot-clé object. Les membres d'un companion object seront regroupés au sein de la définition de leur classe conteneur, sous un séparateur __ {static} __.

object GameConstants {
  +MASTER_DECK_LIST: List<String>
  +DECK_EMOJIS: Map<String, String>
}

class TrustedPackage <<data>> {
  +foragerName: String
  +cards: List<HoneyCard>
  --
  +toBytes(): ByteArray
  __ {static} __
  +fromBytes(bytes: ByteArray): TrustedPackage
}

Coroutines (suspend functions) & Flow
Les opérations asynchrones sont critiques. Nous utiliserons un stéréotype <<suspend>> pour annoter les méthodes correspondantes. Pour Flow, qui représente un flux de données réactif, nous l'utiliserons simplement comme type de retour.

interface CardDao <<DAO>> {
  -- Methods --
  +{abstract} getCardsByDeck(deckName: String): Flow<List<Card>>
  +{abstract} <<suspend>> insertCard(card: Card)
  +{abstract} <<suspend>> deleteCard(card: Card)
}

Caractéristique Kotlin|Représentation PlantUML
:---|:---
`data class`|`class NomDeLaClasse <<data>>`
`sealed class`|`abstract class NomDeLaClasse <<sealed>>` avec héritage (`<|--`)
`object` (singleton)|`object NomDeLObjet`
`companion object`|Séparateur `__ {static} __` à l'intérieur de la classe
`suspend fun`|`+nomDeLaMethode() <<suspend>>`
`Flow<T>`|`+nomDeLaMethode(): Flow<Type>` (utilisé comme type de retour)

Diagrammer les Composants d'Architecture Android (MVVM + SQL Vanilla)
Cette sous-section définit le langage visuel pour l'architecture cible MVVM (Model-View-ViewModel) de Kikko, en s'appuyant sur un **SQLiteOpenHelper** pour la persistance des données.

Nous établirons un langage visuel clair en utilisant des stéréotypes et des styles de relation cohérents pour les composants clés :
*   `<<ViewModel>>` : Pour les classes qui détiennent et exposent l'état de l'interface utilisateur (UI State).
*   `<<Repository>>` : Pour les classes qui servent de médiateur entre les sources de données.
*   `<<DAO>>` : Pour les objets d'accès aux données (Data Access Objects), qui encapsulent la logique des requêtes SQL brutes.
*   `<<SQLiteOpenHelper>>` : Pour la classe principale de gestion de la base de données, qui hérite de `SQLiteOpenHelper`.

Les relations entre ces composants suivront le flux de données unidirectionnel (UDF) :
*   Activity/Fragment --(observe)--> ViewModel
*   ViewModel --(utilise)--> Repository (Relation de dépendance)
*   Repository --(utilise)--> DAO (Relation de dépendance)
*   DAO --(utilise)--> DatabaseHelper (Relation de dépendance)

Extrait d'Exemple : Le Flux de Données d'une Card
Cet extrait sert d'exemple canonique des conventions établies ci-dessus, appliqué à l'entité centrale de notre application, la `Card`. Il modélise le flux de récupération d'une carte depuis la base de données pour l'afficher dans l'interface utilisateur, en suivant l'architecture MVVM + SQL Vanilla.

@startuml
' === NOUVELLE CONVENTION SANS ROOM ===
' Définition des stéréotypes pour la clarté
class CardDetailsViewModel <<ViewModel>>
class CardRepository <<Repository>>
class CardDao <<DAO>>
class DatabaseHelper <<SQLiteOpenHelper>>
class Card <<data>>

' Définition des relations
CardDetailsViewModel .> CardRepository : uses
CardRepository .> CardDao : uses
CardDao .> DatabaseHelper : uses ' Le DAO utilise le Helper pour obtenir une instance de la DB

' Détail des méthodes clés et des attributs
class CardDetailsViewModel {
  +card: LiveData<Card>
  --
  +loadCard(id: String)
}

class CardRepository {
  ' Le suspend ici indique que l'opération est longue et non bloquante
  +getCardById(id: String): Card <<suspend>>
  +insertCard(card: Card) <<suspend>>
}

class CardDao {
  ' Le DAO contient la logique SQL brute
  +getById(id: String): Card <<suspend>>
  +insert(card: Card) <<suspend>>
}

class DatabaseHelper {
  +getReadableDatabase(): SQLiteDatabase
  +getWritableDatabase(): SQLiteDatabase
  --
  +{static} getInstance(context: Context): DatabaseHelper
}

' Relation de données
CardRepository ..> Card
CardDao ..> Card
@enduml

PlantUML Avancé pour des Diagrammes Professionnels
Cette section se concentre sur l'élévation de nos diagrammes de simples croquis à des artefacts professionnels, soignés et maintenables.

Meilleures Pratiques pour des Diagrammes Propres et Lisibles
*   **Organisation et Mise en Page :** Utilisez des `package` pour regrouper les classes et des flèches directionnelles (`-down->`, `-right->`) pour guider la mise en page.
*   **Simplicité :** Concentrez-vous sur les attributs et opérations clés qui expliquent le rôle du composant.
*   **Stylisation Intelligente :** Utilisez la syntaxe `<style>` et des thèmes (`!theme`) pour une apparence cohérente. Définissez des styles personnalisés pour nos stéréotypes (`<<ViewModel>>`, `<<DAO>>`, etc.).
*   **Utilisation Efficace des Notes :** Utilisez des notes pour expliquer le "pourquoi" d'un choix de conception.

Un Exemple de "Beau" Diagramme PlantUML pour Kikko
Cette sous-section présente un diagramme soigné qui servira de référence visuelle. La création d'un fichier de thème dédié, `kikko_theme.puml`, est recommandée pour garantir une identité visuelle cohérente.

@startuml
' =================================================================
' Thème personnalisé Kikko
' Ce bloc peut être externalisé dans un fichier kikko_theme.puml
' et inclus avec !include kikko_theme.puml
' =================================================================
!$KIKKO_GOLD = "#FFD700"
!$KIKKO_CYAN = "#00BCD4"
!$KIKKO_BLACK = "#121212"
!$KIKKO_SURFACE = "#1E1E1E"
!$KIKKO_ON_SURFACE = "#FFFFFF"
!$KIKKO_RED = "#D32F2F"

!theme spacelab

<style>
  root {
    FontName "Roboto, Helvetica"
    FontSize 12
    FontColor $KIKKO_ON_SURFACE
    BackgroundColor $KIKKO_BLACK
  }
  class {
    BackgroundColor $KIKKO_SURFACE
    BorderColor $KIKKO_GOLD
    BorderThickness 1.5
    ArrowColor $KIKKO_CYAN
    StereotypeFontColor $KIKKO_CYAN
  }
  enum {
    BackgroundColor $KIKKO_SURFACE
    BorderColor $KIKKO_GOLD
    BorderThickness 1.5
  }
  interface {
    BackgroundColor $KIKKO_SURFACE
    BorderColor $KIKKO_CYAN
    BorderThickness 1.5
  }
  package {
    FontColor $KIKKO_GOLD
    BorderColor $KIKKO_GOLD
    BorderThickness 2
    BorderStyle dashed
  }
  note {
    BackgroundColor $KIKKO_SURFACE
    BorderColor $KIKKO_ON_SURFACE
    FontColor $KIKKO_ON_SURFACE
  }

  ' Styles pour les stéréotypes
 .data {
    BackgroundColor #333333
  }
 .entity {
    BackgroundColor #2E4053
    BorderColor $KIKKO_GOLD
    StereotypeFontColor $KIKKO_GOLD
  }
 .embedded {
    BackgroundColor #4A235A
    StereotypeFontColor #E8DAEF
  }
 .database { ' Remplacé par SQLiteOpenHelper mais on garde le style '
    BackgroundColor #4A235A
    StereotypeFontColor #E8DAEF
  }
  .SQLiteOpenHelper {
    BackgroundColor #4A235A
    StereotypeFontColor #E8DAEF
  }
 .dao {
    StereotypeFontColor $KIKKO_CYAN
  }
</style>
' =================================================================
' Fin du thème
' =================================================================

title Diagramme de Classes - Couche de Données de Kikko

package "Modèles de Données (Data Models)" {
  ' Pas d'entité Room, juste une data class standard
  class Card <<data>> {
    +id: Long ' Un Long pour la clé primaire SQL '
    +deckName: String
    +name: String
    +statsJson: String
    +quizJson: String
    +aiOverviewHtml: String
    +bourdonTTS: String
    +provenanceJson: String
  }

  class QuizQuestion <<data>> {
    +q: String
    +o: List<String>
    +c: Int
  }

  class Provenance <<data>> {
    +type: ProvenanceType
    +sourceName: String
    +isReproducible: Boolean
  }

  enum ProvenanceType {
    HIVE_FORGED
    HORNET_SOURCED
  }
}

package "Persistance (SQL Vanilla)" {
  class DatabaseHelper <<SQLiteOpenHelper>> {
    --
    +{static} getInstance(context: Context): DatabaseHelper
  }

  class CardDao <<DAO>> {
    +getById(id: Long): Card? <<suspend>>
    +getAll(): List<Card> <<suspend>>
    +insert(card: Card): Long <<suspend>>
  }
}

' --- Relations ---
Card "1" *-- "1..*" QuizQuestion : contains (via JSON) >
Card "1" *-- "1" Provenance : has (via JSON) >
Provenance "1" o-- "1" ProvenanceType : uses >

CardDao .> DatabaseHelper : uses
CardDao ..> Card : manipulates

note right of CardDao
  Les méthodes du DAO encapsulent
  les requêtes SQL brutes et utilisent
  le DatabaseHelper pour les exécuter.
end note
@enduml

Visualiser les Flux de Travail IA/ML Complexes
Cette dernière section aborde l'un des aspects les plus uniques du projet Kikko : la modélisation de son pipeline d'IA multi-étapes. Le **Diagramme d'Activité** reste le choix supérieur pour modéliser ce flux de travail, car il se concentre sur la transformation des données à travers le processus.

Exemple PlantUML : Le Flux de Travail de "Forge du Miel"
Cet exemple de diagramme d'activité reste pertinent et n'est pas impacté par le changement de la couche de persistance.

@startuml
title "Flux de Forge du Miel (Human-in-the-Loop)"

|#GoldenRod|Abeille Spécialiste|
  start
  :Analyser l'image (pollen);
  note right: Modèle TFLite (ex: Plants V1)
  :Produire une identification initiale\net un score de confiance;

|#LightBlue|Butineur (Utilisateur)|
  :Présenter l'identification initiale;
  if (Le score de confiance est bas OU le Butineur veut raffiner?) then (oui)
    :Demander une confirmation/correction;
    :Recevoir l'étiquette vérifiée par l'humain;
    note left
      Étape cruciale du
      "Human Refinement".
      L'utilisateur fournit la
      vérité terrain.
    end note
  else (non)
  endif

|#D1E8E2|Reine IA (Gemma)|
  :Recevoir les données vérifiées\n(image + étiquette finale);
  fork
    :Générer le script TTS du Bourdon;
  fork again
    :Générer le Quiz (questions/réponses);
  fork again
    :Extraire/Générer les statistiques;
  end fork
  :Assembler la 'Card' finale;
  :Stocker la 'Card' avec son\n'Fil de Provenance' complet;
stop

@enduml

Conclusion
Ce rapport a été mis à jour pour refléter la décision stratégique d'utiliser une base de données SQL vanilla via un `SQLiteOpenHelper` au lieu de Room. Les conventions UML ont été adaptées pour représenter cette nouvelle architecture avec précision. L'équipe est désormais équipée pour produire une documentation de la plus haute qualité, alignée avec la stack technique choisie.