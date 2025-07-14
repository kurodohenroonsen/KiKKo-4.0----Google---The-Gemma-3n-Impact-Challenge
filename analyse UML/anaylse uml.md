
Préambule

0.1. Objectifs du Document
Ce document constitue le manifeste narratif qui démontre pourquoi "Kikko's Saga Forge" redéfinit les standards de l'IA embarquée. Il a été conçu pour servir de source de vérité unique à nos trois publics cibles : les Juges du concours, pour qui il sert de preuve argumentée de notre vision ; les Architectes logiciels, à qui il fournit une vue d'ensemble des principes de conception ; et les Développeurs, qui y trouveront un guide précis pour l'implémentation.

Il prouve que Kikko transcende le statut d'application classique pour répondre aux défis contemporains de l'amnésie digitale assistée et de la crise de confiance envers les IA opaques. Chaque diagramme illustre cette vision, forgeant une nouvelle catégorie : le    

Jeu de Connaissance Vérifiable (Verifiable Knowledge RPG).   

0.2. Conventions UML et Stylistiques
Pour garantir une clarté et une cohérence irréprochables, notre modélisation adhère à des standards stricts.

Outil et Identité Visuelle : Tous les diagrammes sont générés avec PlantUML. L'ensemble respecte rigoureusement notre thème personnalisé    

kikko_theme.puml, établissant une identité visuelle forte, alignée sur l'esthétique "high-tech organique" de la Ruche.   

Dialecte UML Spécialisé : Nous adoptons un dialecte UML enrichi pour représenter avec précision les technologies de notre stack. Nos stéréotypes sont organisés en deux familles claires et distinctes :

Stéréotypes Kotlin : Pour les idiomes du langage.

<<data>> : Pour les data class immuables.   

<<sealed>> : Pour les hiérarchies de sealed class.   

<<suspend>> : Pour les fonctions de coroutine non-bloquantes.   

<<object>> : Pour les singletons Kotlin.   

Stéréotypes Android Jetpack : Pour identifier les composants architecturaux standards.

<<ViewModel>>, <<Repository>>, <<DAO>>, <<Database>>.   


Partie 1 : La Vision Fonctionnelle - Le "Pourquoi"
Ce chapitre établit le périmètre fonctionnel du point de vue des utilisateurs et des acteurs du système.

1.1. Cas d'Utilisation Principaux

1.1.1. Analyse Textuelle : UC-01 - Premier Lancement & Initialisation de la Ruche

Description détaillée du flux d'onboarding, du téléchargement des modèles et de la création de la base de données.

1.1.2. Analyse Textuelle : UC-02 - Forger une Carte de Connaissance

Description de la boucle de gameplay "Explorer -> Capturer -> Forger -> Récompenser", incluant le partenariat Homme-IA et le "Dilemme du Frelon".

1.1.3. Analyse Textuelle : UC-03 - Défier un Ami (Saga Clash P2P)

Description du processus de connexion locale via Google Nearby et des règles d'échange de cartes.

1.2. Diagramme d'Activité : Une Journée dans la Saga

1.2.1. Analyse du Diagramme

Texte expliquant comment ce diagramme sert de "bande-annonce" et relie les cas d'utilisation en un récit cohérent.

1.2.2. Artefact UML

Génération du diagramme ACT_Journee_Dun_Butineur.puml.

Partie 2 : Le Cœur de l'Innovation - Le "Comment" (Avancé)
Ce chapitre se concentre sur les mécanismes uniques et différenciants qui constituent notre avantage concurrentiel.

2.1. Le Partenariat Homme-IA : La Forge du Miel

2.1.1. Analyse du Diagramme

Texte détaillant le flux de raffinement humain et la collaboration entre le Butineur et les IA.

2.1.2. Artefact UML

Génération du diagramme d'activité ACT_Forge_Du_Miel.puml.

2.2. L'Orchestration de la Guilde d'IA

2.2.1. Analyse du Diagramme

Texte expliquant la gestion des modèles TFLite, l'arbitrage de Gemma et la gestion des ressources on-device.

2.2.2. Artefact UML

Génération du diagramme de séquence SEQ_Orchestration_Guilde_IA.puml.

2.3. La Preuve par la Reproductibilité : Le Sceau de Confiance

2.3.1. Analyse du Diagramme

Texte décrivant le processus technique de vérification d'une carte via la reproduction d'inférence, en s'appuyant sur le "Fil de Provenance".

2.3.2. Artefact UML

Génération du diagramme de séquence SEQ_Reproduction_Inference.puml.

Partie 3 : Les Fondations Architecturales - Le "Quoi"
Ce chapitre documente la structure technique sous-jacente, prouvant la robustesse et la qualité de notre ingénierie.

3.1. Vue d'Ensemble de l'Architecture

3.1.1. Diagramme de Composants : Architecture de la Ruche

Analyse et génération de CMP_Systeme.puml.

3.1.2. Diagramme de Déploiement : Forteresse Embarquée

Analyse et génération de DPLY_OnDevice.puml.

3.2. Architecture Statique : Les Plans de la Ruche

3.2.1. Couche de Données

Analyse détaillée du modèle de données, de la classe Card, de la structure du Fil de Provenance, des DAO et de la couche Repository.

Génération du diagramme de classes CLS_Couche_Donnees.puml.

3.2.2. Couche d'Interface Utilisateur

Analyse des Activity, ViewModel, Adapter et vues personnalisées.

Génération du diagramme de classes CLS_Couche_UI.puml.

3.2.3. Plan de Migration des Données

Analyse de la transition des anciens modèles (HoneyCard, TrustedPackage) vers la nouvelle architecture.

Génération du diagramme de classes CLS_Refactoring_Legacy.puml.

3.3. Comportement Dynamique de Base : La Ruche en Action

3.3.1. Initialisation de la Ruche

Analyse et génération du diagramme d'activité ACT_Premier_Lancement.puml.

3.3.2. Flux de Données MVVM

Analyse et génération du diagramme de séquence SEQ_Flux_Donnees_MVVM.puml.

Annexes

A.1. Glossaire des Stéréotypes UML

A.2. Code Source du Thème PlantUML (kikko_theme.puml)