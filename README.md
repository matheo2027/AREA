# Action-REAction (AREA)

AREA est une plateforme d'automatisation inspirée d'IFTTT et Zapier, permettant aux utilisateurs de connecter différents services pour automatiser des actions en réponse à des événements spécifiques.

## Table des matières

1. [Description](#description)
2. [Fonctionnalités](#fonctionnalités)
3. [Architecture](#architecture)
4. [Technologies utilisées](#technologies-utilisées)
5. [Installation](#installation)
6. [API](#api)
7. [Contribution](#contribution)

## Description

AREA vise à simplifier la vie numérique des utilisateurs en automatisant les interactions entre plusieurs services. Les utilisateurs peuvent définir des **AREA** (Action-REAction), qui sont des règles reliant une action déclencheuse à une réaction prédéfinie.

Par exemple :
- Une nouvelle photo ajoutée à un dossier Google Drive déclenche son partage via email.
- La création d'une issue sur un dépôt GitHub envoie une notification sur Teams.

## Fonctionnalités

- **Gestion des utilisateurs** : Inscription, authentification via nom d'utilisateur/mot de passe ou OAuth2 (Google, Facebook, etc.).
- **Gestion des services** : Connexion de comptes tiers via OAuth2.
- **Actions et Réactions** :
  - Actions : Événements déclencheurs (ex. nouveau message, nouveau fichier).
  - Réactions : Tâches exécutées suite à une action (ex. envoyer un email, publier un message).
- **Configuration des AREA** : Liaison entre une action et une réaction pour automatiser un processus.
- **Déclencheurs** : Système de vérification pour activer les AREA dès que les conditions sont remplies.

## Architecture

AREA est divisé en trois modules principaux :
1. **Serveur d'application** : Héberge la logique métier et expose une API REST.
2. **Client web** : Interface utilisateur accessible depuis un navigateur.
3. **Client mobile** : Application native pour Android ou Windows Mobile.

Chaque module est conteneurisé via Docker pour une gestion simplifiée.

## Technologies utilisées

- **Backend** : [Next.js](https://nextjs.org/)
- **Frontend web** : [Nuxt.js](https://nuxt.com/)
- **Client mobile** : [React Native](https://reactnative.dev)
- **Base de données** : [PostgreSQL](https://www.postgresql.org)
- **API REST** : Respect des standards RESTful
- **Conteneurisation** : [Docker](https://www.docker.com), [Docker Compose](https://docs.docker.com/compose/)

- Pour comprendre nos choix, nous vous laissons regarder nos analyses comparatives. [Études Comparatives](./ComparativeAnalysis.md)

## Installation

### Prérequis
- Docker et Docker Compose installés.
- Node.js (si vous souhaitez développer localement).
- Une base de données PostgreSQL.

### Étapes

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-repo/AREA.git
   cd AREA
   ```

2. Configurez les variables d'environnement dans un fichier `.env`.

3. Lancez l'application avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

4. Accédez aux services :
   - Serveur : [http://localhost:8080](http://localhost:8080)
   - Client web : [http://localhost:8081](http://localhost:8081)


## API

L'API REST du serveur expose les fonctionnalités suivantes :

### Endpoint `/about.json`
**GET** : Renvoie des informations sur le serveur et les services supportés.

**Exemple de réponse** :
```json
{
  "client": {
    "host": "10.101.53.35"
  },
  "server": {
    "current_time": 1531680780,
    "services": [
      {
        "name": "facebook",
        "actions": [
          {
            "name": "new_message_in_group",
            "description": "A new message is posted in the group"
          }
        ],
        "reactions": [
          {
            "name": "like_message",
            "description": "The user likes a message"
          }
        ]
      }
    ]
  }
}
```

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre les étapes suivantes :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité ou correction (`git checkout -b feature/nouvelle-feature`).
3. Faites vos modifications et soumettez une pull request.


## Auteurs

Ce projet a été réalisé dans le cadre d'Epitech par l'équipe :

- matheo.piques@epitech.eu
- alex.aubry@epitech.eu
- godwin.bewa@epitech.eu
- babacar.sow@epitech.eu