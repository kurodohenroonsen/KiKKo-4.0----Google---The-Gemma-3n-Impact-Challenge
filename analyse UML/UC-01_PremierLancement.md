# Cas d'Utilisation : UC-01

**Nom** : Premier Lancement & Initialisation de la Ruche

**Acteur Primaire** : Le Butineur

**Objectif** : Lancer l'application pour la première fois, être guidé à travers une séquence de bienvenue, et voir l'application s'initialiser complètement (téléchargement des modèles, création de la base de données avec ses données initiales complètes) pour être prête à l'emploi.

**Préconditions** :
* L'application est installée sur l'appareil.
* L'application n'a encore jamais été lancée (`isFirstLaunch` est `true` ou non existant).

**Postcondition de Succès** :
* Le Butineur est sur l'écran principal de l'application (`HiveActivity`).
* La base de données locale est créée et contient les 16 cartes de départ, **incluant leurs images sources et leurs journaux de provenance détaillés**.
* Les modèles d'IA nécessaires sont téléchargés.
* L'indicateur `isFirstLaunch` est positionné à `false`.

**Postcondition d'Échec** :
* L'application est fermée et l'état du système est inchangé, ou l'application informe le Butineur d'une erreur critique l'empêchant de continuer.

---

### Scénario Principal de Succès

1.  Le Butineur ouvre l'application.
2.  Le système affiche l'écran d'introduction (`IntroActivity`).
3.  Le système joue la séquence de bienvenue du Bourdon.
4.  Le Butineur interagit avec l'interface pour continuer.
5.  Le système lance le téléchargement en arrière-plan des modèles d'IA requis, affichant une progression visuelle.
6.  Le système attend la fin du téléchargement.
7.  Le système vérifie si la base de données est vide.
8.  Le système lit le fichier de données initiales (`default_cards.json`).
9.  **Le système insère les 16 cartes, chacune avec son journal de provenance complet et ses images sources encodées en Base64, dans la base de données.**
10. Le système met à jour l'indicateur `isFirstLaunch` à `false`.
11. Le système redirige le Butineur vers l'écran principal et termine l'activité d'introduction.

---

### Extensions (Flux Alternatifs)

**3a. Le Butineur quitte l'application pendant la séquence de bienvenue (avant l'étape 5).**
    1.  À la prochaine ouverture, le système détecte que `isFirstLaunch` est toujours `true`.
    2.  Le scénario principal reprend à l'étape 1.

**5a. Échec de Téléchargement (Réseau/Stockage).**
    1.  Le système détecte un problème (pas d'internet, pas d'espace) avant ou pendant le téléchargement.
    2.  Le système affiche un message d'erreur expliquant le problème.
    3.  Le système propose un bouton "Réessayer".
    4.  Le cas d'utilisation se met en pause jusqu'à l'interaction du Butineur.

**9a. Échec d'Initialisation de la Base de Données.**
    1.  Le système ne parvient pas à lire le fichier JSON ou à écrire dans la base de données.
    2.  C'est une erreur de corruption de l'application. Le système enregistre l'erreur.
    3.  Le système affiche un message d'erreur critique demandant au Butineur de réinstaller l'application.
    4.  Le cas d'utilisation se termine en échec.