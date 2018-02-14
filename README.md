# good-accounts

Gestionnaire de comptes personnels et collaboratifs.

## Résumé

Une application Web simple et intuitif permettant de faire ses comptes et gérer des cagnottes communes.

## Milestones

- V1
	- Structure de l'application;
	- Formulaire de saisie d'une dépense simple (montant de la dépense / rentrée d'argent, date);
	- Résumé des comptes personnels;
	- Administration des comptes personnels;
	- Gestion Back-End des comptes personnels;
	- Gestion de l'authentification;
- V2
	- Formulaire de saisie d'une dépense avancée (débiteurs multiples);
	- Résumé des comptes collaboratifs;
	- Administration des comptes collaboratifs;
	- Gestion Back-End des comptes collaboratifs;
- V3
	- Interfaces multilingues;
	- Progressive Web App;
	- Image Docker.

## Technologies

### Front-End

L'application Web sera réalisée avec le framework [VueJS](https://vuejs.org/), et plus particulièrement avec [Vuetify](https://vuetifyjs.com) afin de réaliser une Single Page Application responsive et cross-browser le plus aisément et le plus rapidement possible.

### Back-End

Une simple API RESTful, réalisée en C#, Java, Node ou autre, en fonction des envies du moment.

## Présentation des concepts clefs

L'application se voudra très simple, intuitive. **L'idée principale est de pousser les utilisateurs à entrer leurs dépenses tout de suite après les avoir réaliser.**

Dans son utilisation au jour le jour, les fondements de l'application seront :
 - Une **authentification rapide** - voir pas d'authentification pour entrer des dépenses et un système de *push* des comptes une fois authentifier ?
 - Un **accès immédiat** à un **formulaire instinctif d'entrée de dépense**.

Lorsque l'utilisateur souhaitera administrer ses comptes, GoodAccounts proposera :
- Des résumés clairs des dépenses et rentrées d'argent sur le compte courant;
- Des outils permettant la mise en place d'alertes et rappels;
- Une interface simple de gestion des comptes communs, avec administration des utilisateurs et de leurs droits.


## Idées pour l'interface

Une interface moderne et simple (Material Design) :

 - Menu burger avec :
	 - Un bouton de déconnexion;
	 - Un bouton d'ajout de compte;
	 - La liste des comptes de l'utilisateur connecté; et
	 - Une barre de recherche pour filtrer ces derniers.
- La zone principale, par défaut sur un résumé de l'état du compte (paramétrable);
- Un bouton "Nouvelle dépense", la feature la plus important de l'application, qui permet d'accéder au formulaire d'ajout de dépense dans le compte courant.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test

# run RESTful api
npm run node
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
