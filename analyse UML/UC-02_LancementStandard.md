# Cas d'Utilisation : UC-02

**Nom** : Lancement Standard

**Acteur Primaire** : Le Butineur

**Objectif** : Lancer l'application rapidement après sa première initialisation pour accéder directement aux fonctionnalités principales sans revoir la séquence d'introduction.

**Préconditions** :
* L'application a déjà été lancée au moins une fois.
* L'indicateur `isFirstLaunch` est positionné à `false`.
* La base de données locale est initialisée.

**Postcondition de Succès** :
* Le Butineur se trouve sur l'écran principal de l'application (`HiveActivity` ou `MainActivity`), prêt à interagir.

**Postcondition d'Échec** :
* L'application affiche un message d'erreur et peut se fermer si la base de données est corrompue.

---

### Scénario Principal de Succès

1.  Le Butineur ouvre l'application.
2.  Le système vérifie l'indicateur `isFirstLaunch` et constate qu'il est `false`.
3.  Le système affiche directement l'écran principal de l'application.

---

### Extensions (Flux Alternatifs)

**3a. La base de données est détectée comme corrompue.**
    1.  Au démarrage, en tentant d'accéder à la base de données, le système reçoit une erreur de corruption.
    2.  Le système enregistre l'erreur pour le débogage.
    3.  Le système affiche un message d'erreur au Butineur : "Attention, la mémoire de ta Ruche semble endommagée. Il est conseillé de vider les données de l'application ou de la réinstaller."
    4.  Le cas d'utilisation se termine en échec.

**3b. Une migration de la base de données est nécessaire (futures mises à jour).**
    1.  Le système détecte que la version de l'application est plus récente que la version de la base de données.
    2.  Le système exécute les scripts de migration de la base de données (définis dans le code).
    3.  Une fois la migration réussie, le scénario principal reprend et l'application s'ouvre normalement.