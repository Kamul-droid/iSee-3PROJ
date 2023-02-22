# Projet 3APIs - Corentin Hoareau

Ce readme contient les instructions d'installations, un guide d'utilisation, ainsi que les différentes commandes npm à exécuter pour ce projet.

- [Projet 3APIs - Corentin Hoareau](#projet-3apis---corentin-hoareau)
  - [Présentation](#présentation)
    - [API](#api)
    - [Données](#données)
    - [Upload](#upload)
    - [Sécurité et authentification](#sécurité-et-authentification)
    - [Tests](#tests)
  - [Installation](#installation)
  - [Utilisation](#utilisation)
    - [Swagger](#swagger)
    - [Lancement du serveur](#lancement-du-serveur)
    - [Lancement des tests](#lancement-des-tests)
    - [Relations](#relations)
  - [Précisions par rapport au sujet](#précisions-par-rapport-au-sujet)

## Présentation

Ce projet a été réalisé avec node `v18.12.1`.

Il consiste en la mise en place d'une API permettant la gestion d'une structure ferroviaire.

### API

L'api fonctionne avec le module Express. Ses fonctionnalités principales sont séparées en différents endpoints pour lesquelles les méthodes GET/POST/PATCH et DELETE sont exposées.

L'API renvoie des codes HTTPs associés au résultat/à l'erreur rencontré(e), ainsi que les données requêtées.

### Données

Les données sont hébergées sur une base de données MongoDB, l'API interface avec celle-ci grâce au module mongoose.

Les données sont validées par le module Joi avant leur sauvegarde sur la base de données.

### Upload

Les images uploadées sont traitées avec le module Sharp, permettant de valider leur intégrité et standardiser leur format, lorsqu'un endpoint renvoie la propriété 'image', celle-ci est accessible à l'addresse "localhost:8080/{valeur de la variable image}".

### Sécurité et authentification

Les endpoints métiers sensibles sont protégés par un système d'authentification JWT ainsi qu'un système de rôles, en accord avec les spécifications du sujet.

### Tests

Mocha permet de lancer les différents fichiers de test. Des tests unitaires sont effectués sur les services et les helpers, des tests fonctionnels sont effectués sur les contrôleurs.

## Installation

**Prérequis**: Assurez-vous d'avoir node, npm, et mongoDB server installés sur votre machine.

L'installation se fait avec npm, à la racine du projet:

```bash
npm i
```

## Utilisation

### Swagger

L'api est documentée et peut être testée avec Swagger.

Pour cela, connectez-vous à [l'éditeur en ligne](https://editor.swagger.io/) et copiez-y le contenu du fichier swagger.yml se trouvant à la racine du projet.

### Lancement du serveur

Dans la racine du dossier, lancez :

```bash
npm run start:prod
```

### Lancement des tests

Les tests peuvent être lancés avec trois commandes :

```bash
npm test # exécute tous les tests
npm run test:unit # uniquement les test unitaires
npm run test:functional # uniquement les test fonctionnels
```

### Relations

Pour les relations telles que les stations de départ et d'arrivée des trains, vous pouvez faire une requête findAll sur les stations, pour ensuite utiliser leur attribut "_id" dans le payload du train.

## Précisions par rapport au sujet

Plusieurs points n'ont pas étés totalement précisés par le sujet, cette partie servira donc à justifier les choix d'implémentation

- Gestion des rôles;
  - Seul un administrateur peut changer les rôles des autres utilisateurs (ainsi que le sien, dans quel cas il ne sera plus considéré comme administrateur);
- Tri & Pagination;
  - Le tri et la pagination sont implémentés sur les endpoints "stations" et "trains"
  - Le tri se fait avec un unique paramètre "sort", celui-ci prend une chaîne de caractère, celle-ci doit être constituées des différents attributs par lesquels nous voulons trier, préfixés d'un "-" dans le cas où nous souhaitons trier par ordre décroissant. Pour trier les noms par ordre croissant, puis les dates par ordre décroissant, la syntaxe est par exemple "name -date";
- Gestion des tickets;
  - Plusieurs endpoints sont exposés pour les tickets, ceux-ci permettent;
    - La consultation, par _id du ticket ou de utilisateur;
    - L'achat, par _id du train;
    - La validation, par _id du ticket;
  - Un ticket possède trois états: acheté, validé, et annulé;
  - Un ticket est associé à un utilisateur et un train;
- Contraintes;
  - Afin d'éviter les accidents, un administrateur ne peut pas supprimer une station ayant des trains assignés, ou un train ayant des tickets assignés et non-encore validés;
  - L'administrateur peut passer outre ces contraintes en passant le query parameter "?force=true" dans sa requête, les ressources associées seront alors supprimées ou annulées (dans le cas des tickets).
- La suite de tests fonctionnels se base sur son propre index.js, car supertest rencontre des bugs s'il initialise l'application deux fois (app.listen). Or cela est nécessaire afin de séparer le test des enpoints en différents fichiers.
