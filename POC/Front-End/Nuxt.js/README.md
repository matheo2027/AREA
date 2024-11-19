# Documentation du POC Nuxt.js

## Introduction

Ce projet est une démonstration de base d'une application web créée avec Nuxt.js, un framework basé sur Vue.js. L'objectif de ce POC est de montrer la création d'une application simple avec des pages, des composants et une navigation de base.

## Structure du projet

La structure du projet se divise en plusieurs répertoires et fichiers qui contiennent les composants, pages et autres éléments nécessaires pour l'application.

### Répertoires principaux

- `assets/` : Contient les fichiers statiques comme les images ou les styles CSS globaux.
- `components/` : Contient les composants réutilisables à travers les pages de l'application.
- `layouts/` : Définit les structures de mise en page globales pour les pages de l'application.
- `pages/` : Contient les fichiers des pages de l'application. Chaque fichier `.vue` dans ce répertoire correspond à une route dans l'application.
- `static/` : Contient les fichiers statiques qui sont directement accessibles depuis l'URL.
- `store/` : Contient la gestion de l'état global de l'application (si utilisée).

### Fichiers principaux

- `nuxt.config.js` : Le fichier de configuration principal de Nuxt.js, où sont définies des options comme le titre de l'application, les plugins, etc.
- `package.json` : Fichier contenant les dépendances et scripts du projet.

## Fonctionnalités du POC

Ce POC comprend une application avec deux pages principales et un composant réutilisable.

### Page d'accueil

La page d'accueil est la première vue de l'application. Elle présente un message de bienvenue et un lien vers la page "À propos". Elle utilise également un composant personnalisé appelé `MyButton`.

Le fichier `pages/index.vue` contient la structure HTML et la logique nécessaire pour afficher cette page. Un bouton interactif est inclus, provenant du composant `MyButton`, et un lien de navigation permet à l'utilisateur de passer à la page "À propos".

### Page "À propos"

La page "À propos" est une autre vue qui présente des informations supplémentaires sur le projet. Le fichier `pages/about.vue` contient la structure de cette page, avec un message expliquant le but du POC et un lien permettant de revenir à la page d'accueil.

### Composant `MyButton`

Le composant `MyButton` est un bouton interactif défini dans `components/MyButton.vue`. Lorsqu'il est cliqué, il affiche une alerte à l'utilisateur. Ce composant est importé et utilisé dans la page d'accueil pour ajouter de l'interactivité.

Le bouton est simple, mais il montre comment créer un composant réutilisable qui peut être intégré dans différentes parties de l'application.

## Résumé du Flux d'Application

1. **Page d'accueil (`/`)** : L'utilisateur arrive sur la page d'accueil où il voit un message de bienvenue, un bouton interactif et un lien vers la page "À propos".
2. **Page "À propos" (`/about`)** : En cliquant sur le lien, l'utilisateur est redirigé vers la page "À propos", qui donne plus de détails sur le projet.
3. **Composant interactif** : Le bouton sur la page d'accueil permet de tester l'interactivité de l'application, en déclenchant une alerte.

## Conclusion

Ce POC Nuxt.js démontre la structure de base d'une application web avec des pages dynamiques, des composants réutilisables et un système de navigation simple. Ce projet peut être facilement étendu pour inclure plus de fonctionnalités et servir de base pour des applications plus complexes.
