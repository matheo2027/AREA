# Utiliser l'image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code dans le conteneur
COPY . .

# Exposer le port utilisé par le backend
EXPOSE 8080

# Commande pour démarrer le serveur
CMD ["npm", "start"]
