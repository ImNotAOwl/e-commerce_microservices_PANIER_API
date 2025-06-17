# PANIER_API
Service - Panier

# Lancement manuel 

**Setup des container Redis et RabbitMq**
-   `docker run -d --name panierApi_redis -p 6379:6379 redis `
-   `docker run -d --name panierApi_rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=rabbit -e RABBITMQ_DEFAULT_PASS=carotte rabbitmq:4.0-management `

**Build de l'application avec docker**
-   `docker build -t panier-api . `

**Run de l'application**
-   `docker run --name panierApi -d --env-file .env -p 3000:3000 panier-api `

**Obtenir les logs docker**
-   `docker logs panierApi `

# Lancement auto avec compose
**Docker compose up**
-   `docker-compose up --build -d `

**Docker compose down**
-   `docker-compose down `

# Ajouter l'image dans le registry

**Ajouter l'image dans le registry**
-   Creer un GIT PAT : Settings > Developer Settings > Personal access token (classic) > Choisir les droits : read:packages / write:packages / delete:packages
-   Ajouter le PAT dans les variables d'environnement => `export GIT_PAT=valeur `
-   Se connecter au registry => `echo $GIT_PAT | docker login ghcr.io -u userName --password-stdin `
-   Build l'image docker avec un TAG => `docker build -t ghcr.io/maalsi23g1/panier_api/panier_service:1.0 . `
-   Push l'image sur le registry => `docker push ghcr.io/maalsi23g1/panier_api/panier_service:1.0 `
  
**Pull l'image depuis le registry**
-    ```docker pull ghcr.io/maalsi23g1/panier_api/panier_service:1.0```

# Requêtes disponibles

**HealthChek**
-   http://localhost:3000/api/health/live : Vérifie que l'API est up
-   http://localhost:3000/api/health/ready : Vérifie que l'API est disponible
-   http://localhost:3000/api/health : Vérifie que l'API est lancée

**Panier**
-   GET - http://localhost:3000/api/panier?user={userId} : Récupération du panier d'un utilisateur
-   POST - http://localhost:3000/api/panier : Ajout d'un article dans le panier pour un utilisateur
    ` 
    {
        "user": "userId",
        "articleId": "articleId",
        "name": "articleName",
        "picture": "",
        "description": "articleDesc",
        "price": 0
    }
    `

**RabbitMq**
-   Ajouter le message dans l'Exchange "clearBucket" avec routingKey "clearBucketd" : 
    `
    {
        "userId": "AZEAZE",
        "cmd": "clear"
    }
    `
https://github.com/MAALSI23G1/PANIER_API/actions
# CI/CD Pipeline Status
![Node.js CI/CD Pipeline](https://github.com/MAALSI23G1/PANIER_API/actions/workflows/main.yml/badge.svg)

