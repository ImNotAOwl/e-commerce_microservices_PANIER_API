import { RabbitMqController } from "./features/panier/controller/RabbitMqController";
import { ApiResponse } from "./infrastructure/api-response/ApiResponse";
import { PanierInteractor } from "./features/panier/interactor/PanierInteractor";
import { RabbitMqHandler } from "./infrastructure/message-broker/RabbitMqHandler";
import { PanierRepository } from "./features/panier/repository/PanierRepository";
import { RedisHandler } from "./infrastructure/redis-cache/RedisHandler";
import { Logger } from "./infrastructure/logging/LoggerHandler";

// Initialisation des dépendances
const logger = Logger.getInstance();
const apiResponse = new ApiResponse();
const rabbitMqHandler = new RabbitMqHandler(logger);
const redisHandler = new RedisHandler(logger);
const repository = new PanierRepository(redisHandler,logger);
const panierInteractor = new PanierInteractor(repository,apiResponse,logger);

// Instanciation du contrôleur
const rabbitMqController = new RabbitMqController(panierInteractor, rabbitMqHandler,logger);

// Démarrer l'écoute sur RabbitMQ
rabbitMqController.startListening();