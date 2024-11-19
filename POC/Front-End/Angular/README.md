# Documentation du POC Angular

## Introduction

Ce projet est une démonstration de base d'une application web créée avec Angular. L'objectif de ce POC est de montrer la création d'une application simple avec un composant interactif : un chronomètre. Ce chronomètre permet de démarrer, arrêter et réinitialiser un compteur en secondes.

## Structure du projet

La structure du projet est organisée de manière à séparer les composants et styles nécessaires pour une application modulaire.

### Répertoires principaux

- `src/app/components/` : Contient les composants réutilisables. Ici, le composant principal est `Chronometre`.
- `src/styles/` : Contient les fichiers SCSS globaux ou spécifiques au projet (par défaut dans Angular).
- `src/app/app.component.*` : Les fichiers de la racine de l'application, où le composant principal est intégré.

### Fichiers principaux

- `src/app/chronometre/chronometre.component.ts` : Contient la logique et les fonctions du chronomètre.
- `src/app/chronometre/chronometre.component.html` : Définit l'interface utilisateur du chronomètre.
- `src/app/chronometre/chronometre.component.scss` : Contient les styles spécifiques au composant.
- `src/app/app.component.html` : Intègre le composant `Chronometre` pour l'affichage global de l'application.

## Fonctionnalités du POC

Ce POC comprend une application Angular avec un composant interactif permettant de gérer un chronomètre.

### Composant Chronomètre

Le composant `Chronometre` est le cœur de l'application. Il inclut :
- Un affichage du temps écoulé en secondes.
- Trois boutons permettant de démarrer, arrêter et réinitialiser le chronomètre.

#### Fichiers clés :
- **`chronometre.component.ts`** : Gère l'état (`time`, `isRunning`) et les méthodes `start()`, `stop()`, et `reset()`.
- **`chronometre.component.html`** : Fournit une interface utilisateur simple avec un titre, l'affichage du temps et les boutons.
- **`chronometre.component.scss`** : Stylise l'interface pour une présentation visuelle propre et intuitive.

---

### Résumé du Flux d'Application

1. **Affichage initial** :
   - La page charge le composant `Chronometre` avec le compteur initialisé à zéro.
   - Les trois boutons sont visibles mais inactifs par défaut.

2. **Fonctionnement du chronomètre** :
   - En cliquant sur "Démarrer", le compteur commence à incrémenter toutes les secondes.
   - "Arrêter" met en pause le compteur.
   - "Réinitialiser" remet le compteur à zéro et le chronomètre s’arrête.

---

## Conclusion

Ce POC Angular démontre la structure de base d'une application web avec un composant interactif. Il met en avant la gestion d'état, l'interactivité via les événements utilisateur, et la séparation des responsabilités entre la logique, l'affichage et les styles.

Ce projet peut être facilement étendu pour inclure des fonctionnalités avancées telles que :
- La gestion du temps en heures/minutes/secondes.
- La persistance des données à l’aide du stockage local ou d’une API.
- Un affichage plus sophistiqué avec des animations et des thèmes.
