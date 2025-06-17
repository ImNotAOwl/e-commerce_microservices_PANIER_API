import { ConsumeMessage } from "amqplib";

export interface IRabbitMqHandler {

    /**
    * Connecte au serveur RabbitMQ et initialise la file d'attente.
    */
    connectRabbitMQ(exchange: string): Promise<void>;

    /**
    * Envoie un message dans la file d'attente spécifiée
    * @param exchange - Le nom de l'échange où envoyer les messages.
    * @param routingKey - Clé de routage des échanges
    * @param message - Le message à envoyer, sous forme de chaîne de caractères.
    */
    publishToExchange(exchange: string, routingKey: string, message: string): Promise<void>;

    /**
     Démarre l'écoute des messages dans la file d'attente et exécute
     * la fonction `onMessage` pour chaque message reçu.
     * @param exchange - Le nom de l'échange où ecouter les messages.
     * @param routingKey - Clé de routage des échanges
     * @param onMessage - Fonction de rappel exécutée pour chaque message reçu, prenant le message sous forme de chaîne de caractères.
     */
    consumeFromExchange(exchange: string, routingKey: string, onMessage: (msg: ConsumeMessage | null) => void): Promise<void>
}