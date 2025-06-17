import { ConsumeMessage } from "amqplib";
import { IRabbitMqHandler } from "../../../infrastructure/message-broker/interfaces/IRabbitMqHandler";
import { IPanierInteractor } from "../interfaces/IPanierInteractor";
import { ILoggerHandler } from "../../../infrastructure/logging/interfaces/ILoggerHandler";

export class RabbitMqController{
    private readonly interactor: IPanierInteractor;
    private readonly rabbitMq: IRabbitMqHandler;
    private readonly logger: ILoggerHandler;

    constructor(interactor: IPanierInteractor, rabbitMq: IRabbitMqHandler, logger: ILoggerHandler){
        this.interactor = interactor;
        this.rabbitMq = rabbitMq;
        this.logger = logger;
    }

     // Méthode pour démarrer l'écoute sur RabbitMQ
     public async startListening(): Promise<void> {
        try {
            const exchange = "clearBucket"; // Nom de l'exchange
            const routingKey = "clearBucket"; // Clé de routage pour filtrer les messages
            
            // Démarre la consommation depuis l'exchange avec un callback pour traiter chaque message
            await this.rabbitMq.consumeFromExchange(exchange, routingKey, async (msg: ConsumeMessage | null) => {
                if (msg) {
                    const messageContent = msg.content.toString();
                    this.logger.info("Received message:", messageContent);

                    // Désérialisation du message
                    const { userId, cmd } = JSON.parse(messageContent);

                    // Logique de traitement en appelant l'interactor
                    if (cmd === "clear") {
                        await this.interactor.deletePanier(userId);
                        this.logger.info(`Basket for user ${userId} has been cleared.`);
                    }
                }
            });

            this.logger.info("Listening for messages on exchange.");
        } catch (error) {
            this.logger.error("Failed to start listening for messages:", error);
        }
    }
}