# Utiliser une image Node.js officielle
FROM node:20

# Installer les dépendances nécessaires pour Expo
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    dnf \
    libgl1-mesa-glx \
    libglu1-mesa \
    && rm -rf /var/lib/apt/lists/*

# Créer un répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Installer Expo CLI globalement
RUN npm install -g expo-cli

# Copier tout le reste du projet
COPY . .

# Exposer les ports nécessaires
EXPOSE 19000 19001 19002

# Commande pour démarrer Expo
CMD ["npm", "start"]
