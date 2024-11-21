# Documentation des Actions et Réactions des APIs

## Nombre total d'actions et de réactions
- **Nombre d'actions** : 9
- **Nombre de réactions** : 10
- **Répartition actions/réactions** : 9 actions pour 10 réactions.
La répartition des actions et réactions est de **47% - 53%**, ce qui respecte la contrainte d'une répartition minimum de ⅓ - ⅔.

## Nombre de services (API) utilisés
- **Nombre total de services/API utilisés** : 7
- **Nombre de services sans OAuth2** : 1

### Liste des services utilisés :
1. **OpenWeatherMap** (Météo) - OAuth2 **non requis**
2. **GitHub API** (Evénements GitHub) - OAuth2 **non requis**
3. **Microsoft Graph API** (Calendrier, Emails) - OAuth2 **requis**
4. **Spotify Web API** (Musique) - OAuth2 **requis**
5. **Twitter API** (Tweets) - OAuth2 **requis**
6. **Instagram Graph API** (Publications) - OAuth2 **requis**
7. **Slack API** (Messages) - OAuth2 **requis**

---

## Détails des actions et réactions des APIs

### 1. API : Météo & Localisation
- **Action** : Récupérer la localisation
  - **API utilisée** : Univers Google API ou Microsoft Azure
    - Par exemple, [IPStack](https://ipstack.com/) ou [GeoIP](https://www.maxmind.com/en/geoip2-services).
  - **Réaction** : Fournir la météo actuelle en fonction de la localisation de l'utilisateur via [OpenWeatherMap](https://openweathermap.org/)
  - **Gratuit/Payant** : Plan gratuit avec des limitations.
  - **Limitations** :
    - **OpenWeatherMap** : 60 appels par minute pour le plan gratuit.
    - **GeoIP** : 1 000 requêtes par mois pour le plan gratuit.
    - **IPStack** : 1 000 requêtes par mois pour le plan gratuit.
  - **Remarque** : Compte pour un seul service, car Google et Microsoft font partie de l'univers d'API.

### 2. API : Microsoft + Intra
- **Action** : Récupérer les activités enregistrées
  - **API utilisée** : [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)
  - **Réaction** : Marquer l'événement sur le calendrier Microsoft.
  - **Gratuit/Payant** : Gratuit pour un usage de base avec un abonnement Microsoft 365.
  - **Limitations** :
    - **Microsoft Graph** : Limité à 5 000 appels par utilisateur par jour pour les utilisateurs gratuits.
    - Pour un accès complet à toutes les fonctionnalités (email, calendrier, etc.), un abonnement Microsoft 365 est nécessaire.

### 3. Suivi des Crypto-monnaies
- **Action** : Suivre le prix d'une crypto-monnaie
  - **API utilisée** : [CoinGecko](https://www.coingecko.com/en/api)
  - **Réaction** : Alerter via Discord ou Telegram si le prix monte ou descend au-delà d'un certain seuil.
  - **Gratuit/Payant** : Gratuit avec des limitations sur les appels d'API. Des plans payants sont disponibles pour des fonctionnalités avancées.
  - **Limitations** :
    - **CoinGecko** : 50 appels par minute pour le plan gratuit.

### 4. Gestion des Emails
- **Action** : Suivre les nouveaux emails entrants via Microsoft Graph
  - **API utilisée** : [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)
  - **Réaction** : Envoyer une notification via Slack si l'email contient certains mots-clés ("urgent").
  - **Gratuit/Payant** : Gratuit pour un usage de base avec un abonnement Microsoft 365.
  - **Limitations** :
    - **Microsoft Graph** : Limité à 5 000 appels par utilisateur par jour pour les utilisateurs gratuits.

### 5. API : GitHub
- **Action** : Récupérer les derniers événements choisis
  - **API utilisée** : [GitHub API](https://docs.github.com/en/rest)
  - **Réaction** : Envoyer une notification sur un channel Discord.
  - **Gratuit/Payant** : Gratuit avec des limitations d'utilisation, plan payant disponible pour plus d'accès API.
  - **Limitations** :
    - **GitHub API** : 5 000 requêtes par heure pour les utilisateurs non authentifiés, 5 000 requêtes par heure par utilisateur pour les utilisateurs authentifiés.
    - Les appels d'API sont également limités par un quota global de 5 000 requêtes par heure pour tous les utilisateurs.

### 6. API : Spotify
- **Action** : Récupérer les notifications de Spotify
  - **API utilisée** : [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
  - **Réaction** : Mettre en pause la musique.
  - **Gratuit/Payant** : Gratuit avec des limitations d'accès (fonctionnalités complètes avec un abonnement premium).
  - **Limitations** :
    - **Spotify API** : 100 appels par heure par utilisateur pour les utilisateurs gratuits.
    - Pour certaines fonctionnalités comme la lecture musicale et les informations avancées sur les pistes, un abonnement Premium est nécessaire.

### 7. API : Twitter
- **Action** : Récupérer les derniers tweets d'un utilisateur
  - **API utilisée** : [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
  - **Réaction** : Publier un tweet ou envoyer une notification via un canal Discord si un tweet est spécifique.
  - **Gratuit/Payant** : Gratuit avec un nombre limité de requêtes, possibilité d'extension avec un plan payant.
  - **Limitations** :
    - **Twitter API** :
      - 500 000 tweets par mois pour les utilisateurs gratuits.
      - Limitations d'accès aux données spécifiques selon le plan (ex : tweets de certains comptes ou hashtags).
    - L'utilisation complète des fonctionnalités avancées nécessite un abonnement payant.

### 8. API : Instagram
- **Action** : Récupérer les dernières publications d'un utilisateur
  - **API utilisée** : [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
  - **Réaction** : Publier une image sur un compte Instagram.
  - **Gratuit/Payant** : Gratuit avec des limitations sur les appels d'API.
  - **Limitations** :
    - **Instagram API** : 200 appels par heure pour le plan gratuit.
    - Certaines fonctionnalités (comme publier des images) sont réservées aux utilisateurs disposant d'un compte professionnel et nécessitent une approbation supplémentaire de l'API.

### 9. API : Slack
- **Action** : Envoyer un message à un canal spécifique
  - **API utilisée** : [Slack API](https://api.slack.com/)
  - **Réaction** : Envoyer une alerte sur Slack si une condition spécifique est remplie (par exemple, un mot-clé dans un message).
  - **Gratuit/Payant** : Gratuit avec des fonctionnalités de base, abonnement payant pour des fonctionnalités supplémentaires.
  - **Limitations** :
    - **Slack API** : 1 000 appels par mois pour le plan gratuit.
    - Pour un usage intensif ou des fonctionnalités avancées (comme les appels d'API en temps réel), un plan payant est nécessaire.

---

## Conclusion sur la répartition actions/réactions et les services
La répartition des actions et des réactions est de **47% pour les actions** et **53% pour les réactions**, ce qui respecte la contrainte d'une répartition minimum de ⅓ - ⅔ entre actions et réactions. Le nombre total de services utilisés a été étendu à 7, avec 1 service sans OAuth2, respectant ainsi les contraintes d'authentification OAuth2.