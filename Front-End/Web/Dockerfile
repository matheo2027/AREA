# Utiliser l'image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Construire le projet Next.js (ou un autre framework)
RUN npm run build

# Exposer le port du frontend
EXPOSE 8081

# Démarrer le serveur Next.js
CMD ["npm", "start"]
