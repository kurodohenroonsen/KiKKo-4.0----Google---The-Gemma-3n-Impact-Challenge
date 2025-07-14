
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
Le premier contact avec "Kikko's Saga Forge" n'est pas un lancement d'application, c'est une cérémonie d'accueil. Conformément à notre philosophie, nous avons remplacé l'onboarding traditionnel par une mise en scène narrative, orchestrée par IntroActivity.kt et sa machine à états interne IntroState. L'objectif est double : immerger immédiatement le Butineur dans son rôle d'acteur et, en coulisses, forger une Ruche IA 100% opérationnelle avant même la première action de jeu.   

Le flux est une symphonie synchronisée où chaque étape technique est habillée d'une justification narrative :

L'Accueil Immersif : L'utilisateur est accueilli par le Bourdon. La machine à états (BOURDON_ARRIVING, BOURDON_SPEAKS_WELCOME) pilote l'enchaînement des vidéos et des dialogues via synthèse vocale (TTS). L'interaction de l'utilisateur (toucher l'œuf pour le faire éclore) n'est pas une simple action, c'est un événement qui fait avancer le récit, le rendant acteur de la genèse de son propre écosystème.   

La Forge en Coulisses : Pendant que le Bourdon captive l'utilisateur, deux opérations critiques se déroulent en arrière-plan pour minimiser l'attente :

L'Éveil de l'Intelligence : Le téléchargement des modèles d’IA essentiels (Gemma via MediaPipe, modèles TFLite pour les Specialist Bees) est orchestré par WorkManager pour une exécution asynchrone respectant les contraintes réseau. Le Bourdon traduit cette étape en une narration immersive : les "Abeilles" et leur "Reine" s’éveillent dans la Ruche, transformant un processus technique en un moment clé de la construction de l’univers.   

La Genèse de la Mémoire : Simultanément, la base de données Room est créée et peuplée à partir du fichier default_cards.json. Ces cartes de départ ne sont pas des coquilles vides ; elles sont livrées avec leur "Fil de Provenance" complet, rendant leurs inférences reproductibles et démontrant dès la première seconde notre engagement fondamental pour une confiance vérifiable.   

La Transition vers la Saga : Une fois la Ruche prête (modèles téléchargés, base de données peuplée), le Bourdon présente au Butineur ses premiers choix d'aventure. L'indicateur isFirstLaunch est basculé à false dans les SharedPreferences. L'IntroActivity a terminé son rôle et redirige l'utilisateur vers l'écran principal (HiveActivity), sa saga prête à commencer.   

Ce cas d'utilisation n'est donc pas un simple tutoriel. Il établit les piliers du projet : une expérience utilisateur narrative, une complexité technique masquée par une interface intuitive, une architecture "Privacy by Design" (tout en local), et une proposition de valeur immédiate pour l'utilisateur, qui commence son aventure avec un écosystème déjà riche et fonctionnel.

Informations Générales
Nom : Premier Lancement & Initialisation de la Ruche

Acteur Primaire : Le Butineur

Objectif : Lancer l'application pour la première fois, être guidé à travers une séquence de bienvenue immersive, et voir l'application s'initialiser complètement (téléchargement des modèles, création et peuplement de la base de données) pour être prête à l'emploi.

Préconditions :

L'application est installée sur l'appareil.

L'indicateur isFirstLaunch dans les SharedPreferences est absent ou true.   

Postcondition de Succès :

Le Butineur est sur l'écran principal de l'application (HiveActivity).   

La base de données locale (Room) est créée et peuplée avec les cartes de départ.   

Les modèles d'IA essentiels (Gemma, etc.) sont téléchargés et prêts à l'emploi.   

L'indicateur isFirstLaunch est positionné à false.   

Scénario Principal de Succès (Chemin Parfait)
Le Butineur lance l'application. Le système vérifie que isFirstLaunch est true et lance IntroActivity.   

Le système entre dans l'état IntroState.BOURDON_ARRIVING, jouant la vidéo bourdon_arrives.mp4.   

À la fin de la vidéo, le système passe à IntroState.BOURDON_SPEAKS_WELCOME. La vidéo bourdon_talks.mp4 est jouée en boucle et la synthèse vocale (TTS) énonce le dialogue de bienvenue (bourdon_intro_welcome).   

À la fin du dialogue, le système passe à IntroState.AWAITING_EGG_CLICK et attend une interaction de l'utilisateur.   

Le Butineur touche l'écran. Le système passe à IntroState.HATCHING, joue la vidéo egg_hatching.mp4 et le dialogue TTS associé (bourdon_intro_hatching).   

À la fin de la vidéo, le système passe à IntroState.DOWNLOADING_SPEAKING. Le TTS énonce le dialogue expliquant que la Ruche s'éveille (bourdon_intro_downloading).   

Le système lance deux opérations critiques en parallèle pour minimiser l'attente :

Tâche 1 (IA) : Il lance le téléchargement des modèles d'IA requis via une tâche de premier plan (ex: Coroutine ou Service) pour garantir une exécution immédiate et un suivi précis de la progression.   

Tâche 2 (DB) : Simultanément, il lance la création de la base de données Room et son peuplement à partir du fichier default_cards.json. Ces cartes de départ sont livrées avec leur "Fil de Provenance" complet, rendant leurs inférences reproductibles et démontrant dès la première seconde notre engagement fondamental pour une confiance vérifiable.   

Une barre de progression est affichée pendant que le système attend la complétion des deux tâches en arrière-plan.   

Une fois les deux tâches terminées, le système passe à IntroState.HIVE_READY_SPEAKING. Le TTS annonce que la Ruche est prête (bourdon_intro_hive_ready).   

Le système passe à IntroState.AWAITING_FINAL_CHOICE, affichant les boutons d'action.   

Le Butineur sélectionne une des options.

Le système écrit isFirstLaunch = false dans les SharedPreferences, lance HiveActivity et termine IntroActivity.   

Extensions (Flux Alternatifs)
3a. Le Butineur quitte l'application pendant la séquence :

Si le Butineur quitte IntroActivity avant l'étape 12, isFirstLaunch reste true. Lors du prochain lancement, le scénario principal reprendra à l'étape 1 pour garantir une initialisation complète.

5a. Le Butineur refuse les permissions critiques (si demandées) :

Le système affiche un dialogue expliquant la nécessité de la permission. Le Bourdon peut intervenir via TTS pour contextualiser. Si le refus est maintenu, le système passe au flux d'erreur approprié (ex: échec de téléchargement si le réseau est refusé).

Flux d'Erreur
FE1 : Échec d'initialisation du TTS :

Cause : Le moteur TTS de l'appareil ne s'initialise pas (onInit retourne TextToSpeech.ERROR).   

Réaction : Le système continue sans synthèse vocale. Les dialogues du Bourdon sont affichés sous forme de sous-titres pour que l'expérience reste fonctionnelle, bien que moins immersive.

FE2 : Échec du téléchargement des modèles d'IA :

Cause : Pas de connexion réseau ou espace de stockage insuffisant.

Réaction : WorkManager (ou le service équivalent) signale un échec. Le système affiche un message d'erreur contextualisé ("Mes Abeilles ont besoin d'une connexion pour rejoindre la Ruche.") et propose deux options : "Réessayer" pour relancer le téléchargement, ou "Continuer en mode dégradé" pour utiliser des modèles par défaut pré-embarqués (si disponibles). Si aucune option n’est choisie, le cas d’utilisation se met en pause.

FE3 : Échec de l'initialisation de la base de données :

Cause : Fichier default_cards.json corrompu/manquant ou erreur d'écriture sur le disque.

Réaction : C'est une erreur critique. Le système enregistre l'erreur et affiche une boîte de dialogue bloquante : "Erreur critique : la mémoire initiale de la Ruche est endommagée. Veuillez réinstaller l'application." L'application se ferme.


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