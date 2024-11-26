# Documentation du POC Next.js

## Introduction

Ce projet est une démonstration simple d'une application web créée avec Next.js, un framework basé sur React. L'objectif de ce POC est de montrer la création d'une application de base avec une page d'accueil et un composant interactif.

## Structure du projet

La structure du projet est organisée de manière à séparer les pages, les composants réutilisables et les styles.

### Répertoires principaux

- `components/` : Contient les composants réutilisables utilisés dans les pages. Dans ce POC, il contient le composant `Counter` qui gère un compteur interactif.
- `pages/` : Contient les fichiers des pages de l'application. Chaque fichier `.js` dans ce répertoire correspond à une route dans l'application. Ici, le fichier `index.js` sert de page d'accueil.
- `public/` : Contient les fichiers statiques accessibles directement depuis l'URL (comme les images et les favicons).
- `styles/` : Contient les fichiers CSS pour styliser l'application. Le fichier `Home.module.css` est utilisé pour la page d'accueil.

### Fichiers principaux

- `pages/index.js` : La page principale de l'application, qui inclut le composant `Counter` et une structure de base.
- `components/Counter.js` : Le composant qui gère l'état du compteur et les interactions de l'utilisateur.
- `styles/Home.module.css` : Le fichier CSS utilisé pour styliser la page d'accueil.

## Fonctionnalités du POC

Ce POC inclut une page d'accueil avec un composant interactif et un compteur.

### Page d'accueil

La page d'accueil est la première vue de l'application. Elle affiche un titre de bienvenue et un compteur interactif avec deux boutons pour augmenter ou diminuer la valeur du compteur.

Le fichier `pages/index.js` contient la logique pour afficher cette page, y compris l'inclusion du composant `Counter` et le style de la page.

### Composant `Counter`

Le composant `Counter` est défini dans `components/Counter.js`. Il gère l'état du compteur à l'aide de `useState` et permet à l'utilisateur de l'augmenter ou de le diminuer en cliquant sur des boutons. Ce composant est réutilisable et peut être intégré dans d'autres pages si nécessaire.

Le fichier `Counter.js` contient la logique suivante :
- Un état local (`count`) qui garde la trace de la valeur actuelle du compteur.
- Deux fonctions, `increment` et `decrement`, qui modifient la valeur du compteur lorsqu'un utilisateur clique sur les boutons correspondants.

### Styles

Les styles de la page d'accueil sont définis dans `styles/Home.module.css`. Ce fichier ajoute des marges, du padding, et des couleurs de fond à la page, ainsi que des styles pour les boutons du composant `Counter`.

## Résumé du Flux d'Application

1. **Page d'accueil (`/`)** : L'utilisateur arrive sur la page d'accueil où il voit un titre de bienvenue et un compteur interactif avec des boutons pour ajuster la valeur.
2. **Composant interactif `Counter`** : En cliquant sur les boutons, l'utilisateur modifie la valeur du compteur, ce qui démontre l'interactivité de l'application.
3. **Pas de navigation entre pages** : Ce POC se concentre uniquement sur la page d'accueil et l'interactivité d'un composant. Il pourrait facilement être étendu pour inclure d'autres pages et des fonctionnalités de navigation.

## Conclusion

Ce POC Next.js montre la structure de base d'une application web avec une page d'accueil simple, un composant réutilisable et un état local géré par React. Ce projet peut servir de base pour des applications plus complexes, en y ajoutant de nouvelles pages, des API, et des fonctionnalités plus avancées.