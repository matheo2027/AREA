# Utiliser une image Node.js comme base
FROM node:18-alpine

# Installer Expo CLI globalement
RUN npm install -g expo-cli

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port par défaut pour Expo
EXPOSE 19000 19001 19002

# Lancer le serveur Expo
CMD ["npm", "start"]
