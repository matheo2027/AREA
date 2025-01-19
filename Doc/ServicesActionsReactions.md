
# Documentation des Actions et Réactions des APIs

---

## Nombre total d'actions et de réactions

- **Nombre d'actions** : 4  
- **Nombre de réactions** : 2  
- **Répartition actions/réactions** : 4 actions pour 2 réactions.  
  La répartition des actions et réactions est de **67% - 33%**, ce qui respecte la contrainte d'une répartition minimum de ⅓ - ⅔.

---

## Nombre de services (API) utilisés

- **Nombre total de services/API utilisés** : 4  
- **Nombre de services sans OAuth2** : 1  

### Liste des services utilisés :

1. **GitHub API** (Nouvelle étoile sur un dépôt) - OAuth2 **requis**
2. **Discord API** (Nouveau message et notifications) - OAuth2 **requis**
3. **YouTube API** (Nouvelle vidéo d’une chaîne) - OAuth2 **requis**
4. **OpenWeatherMap API** (Prévisions météo) - OAuth2 **non requis**

---

## Détails des actions et réactions des APIs

### 1. API : GitHub

- **Action** : Nouvelle étoile sur un dépôt  
  - **Nom** : GitHub - New Star  
  - **Description** : Déclenché lorsqu’un dépôt obtient une nouvelle étoile.  
  - **API utilisée** : [GitHub API](https://docs.github.com/en/rest)  
  - **Réaction possible** : Envoyer un email.  
  - **Gratuit/Payant** : Gratuit avec des limitations d’utilisation, plan payant disponible pour plus d’accès API.  
  - **Limitations** :  
    - **GitHub API** : 5 000 requêtes par heure par utilisateur pour les utilisateurs authentifiés.

---

### 2. API : Discord

- **Action** : Nouveau message sur un canal Discord  
  - **Nom** : Discord - New Message  
  - **Description** : Déclenché lorsqu’un nouveau message est reçu sur un canal Discord.  
  - **API utilisée** : [Discord API](https://discord.com/developers/docs/intro)  
  - **Réaction possible** : Envoyer un message privé à un utilisateur Discord.  
  - **Gratuit/Payant** : Gratuit pour les bots avec des limitations d’utilisation.  
  - **Limitations** :  
    - **Discord API** : Le bot doit être ajouté au serveur et disposer des autorisations nécessaires pour accéder au canal.

---

### 3. API : YouTube

- **Action** : Nouvelle vidéo d’une chaîne  
  - **Nom** : YouTube - New Video  
  - **Description** : Déclenché lorsqu’une nouvelle vidéo est publiée sur une chaîne YouTube spécifiée.  
  - **API utilisée** : [YouTube API](https://developers.google.com/youtube/v3)  
  - **Réaction possible** : Envoyer un email.  
  - **Gratuit/Payant** : Gratuit avec des limitations.  
  - **Limitations** :  
    - **YouTube API** : 10 000 quotas d’unités par jour pour le plan gratuit.

---

### 4. API : OpenWeatherMap

- **Action** : Prévision de pluie  
  - **Nom** : Weather - Rain Forecast  
  - **Description** : Déclenché lorsqu’une prévision de pluie est détectée dans une localisation spécifiée.  
  - **API utilisée** : [OpenWeatherMap](https://openweathermap.org/)  
  - **Réaction possible** : Envoyer un email.  
  - **Gratuit/Payant** : Gratuit avec un plan limité à 60 appels par minute.  
  - **Limitations** :  
    - **OpenWeatherMap** : Pour des fonctionnalités avancées comme des prévisions détaillées, un abonnement payant est nécessaire.

---

## Liste des Réactions

### 1. Réaction : Envoyer un email
- **Nom** : Send an Email  
- **Description** : Envoie un email de notification à un destinataire spécifié.  
- **APIs utilisées** :  
  - **GitHub API** pour déclencher l’action.  
  - **YouTube API** pour surveiller de nouvelles vidéos.  
  - **OpenWeatherMap API** pour détecter la pluie.  
- **Gratuit/Payant** : Gratuit pour un usage basique avec une limite des appels par minute.

---

### 2. Réaction : Envoyer un message Discord
- **Nom** : Send Discord Message  
- **Description** : Envoie un message privé à un utilisateur Discord spécifié.  
- **APIs utilisées** : Discord API.  
- **Gratuit/Payant** : Gratuit pour les bots avec certaines limitations.

---

## Conclusion sur la répartition actions/réactions et les services

La répartition des actions et des réactions est de **67% pour les actions** et **33% pour les réactions**, ce qui respecte la contrainte d'une répartition minimum de ⅓ - ⅔ entre actions et réactions. Le nombre total de services utilisés est de 4, avec 1 service sans OAuth2, respectant ainsi les contraintes d'authentification OAuth2.
