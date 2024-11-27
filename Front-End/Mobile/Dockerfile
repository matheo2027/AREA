# Utiliser l'image officielle de React Native (par exemple)
FROM reactnativecommunity/react-native-android:latest

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Commande pour construire l'application
CMD ["npm", "run", "android"]
