# Étape 1 : Construction de l'image pour compiler le code TypeScript
FROM node:22-alpine AS builder
WORKDIR /opt/panier

# Copier les fichiers nécessaires et installer les dépendances (y compris devDependencies pour le build)
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers dans l'image
COPY . .

# Compiler le TypeScript en JavaScript
RUN npm run build

# Étape 2 : Créer l'image finale en production
FROM node:22-alpine
WORKDIR /opt/panier

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY package*.json ./
RUN npm install --omit=dev

# Copier les fichiers compilés depuis l'étape précédente
COPY --from=builder /opt/panier/dist ./dist

# Copier le fichier openapi.yaml
COPY openapi.yaml ./openapi.yaml

# Définir l'environnement en production
ENV NODE_ENV=production

# Exposer le port 3000
EXPOSE 3000

# Ajout des informations pour le package git
LABEL org.opencontainers.image.source=https://github.com/MAALSI23G1/PANIER_API
LABEL org.opencontainers.image.description="Service Panier pour l'application Breizsport"
LABEL org.opencontainers.image.licenses=MIT

# Lancer l'application en utilisant le code JavaScript compilé
CMD ["node", "./dist/app.js"]