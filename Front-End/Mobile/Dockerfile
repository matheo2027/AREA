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

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19000

CMD ["expo", "start", "--tunnel"]
