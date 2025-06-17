import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import { IRabbitMqHandler } from "./interfaces/IRabbitMqHandler";
import { ILoggerHandler } from "../logging/interfaces/ILoggerHandler";

export class RabbitMqHandler implements IRabbitMqHandler {
  private rabbitMQConnection: Connection | null = null;
  private rabbitMQChannel: Channel | null = null;
  private readonly logger: ILoggerHandler;

  constructor(logger: ILoggerHandler){
    this.logger = logger;
  }

  async connectRabbitMQ(exchange: string): Promise<void> {
    const maxRetries = 5;
    let attempts = 0;
    let connected = false;
    while (attempts < maxRetries && !connected) {
      try {
        // Connexion à RabbitMQ en utilisant les variables d'environnement
        this.rabbitMQConnection = await amqplib.connect({
          protocol: "amqp",
          hostname: process.env.RABBITMQ_HOST,
          port: Number(process.env.RABBITMQ_PORT),
          username: process.env.RABBITMQ_USER,
          password: process.env.RABBITMQ_PASSWORD,
        });

        this.logger.info("Connected to RabbitMQ");
        connected = true;
        // Création d'un canal pour les communications
        this.rabbitMQChannel = await this.rabbitMQConnection.createChannel();

        // Déclaration d'un exchange de type "direct", "fanout", ou "topic" en fonction des besoins
        const exchangeType = "direct";
        await this.rabbitMQChannel.assertExchange(exchange, exchangeType, {
          durable: false,
        });
        this.logger.info(`Exchange "${exchange}" of type "${exchangeType}" created.`);

        // Gestion des erreurs de connexion
        this.rabbitMQConnection.on("error", (err) => {
          this.logger.error("Connection to RabbitMQ failed :", err);
          this.rabbitMQConnection = null;
        });

        this.rabbitMQConnection.on("close", () => {
          this.logger.info("RabbitMQ Connection Closed");
          this.rabbitMQConnection = null;
        });
      }
      catch (error) {
        this.logger.error(`Failed to connect to RabbitMQ (Attempt ${attempts + 1} of ${maxRetries}):`, error);
        attempts++;
        await new Promise(res => setTimeout(res, 3000));  // Wait before retrying
      }
    }
    if(!connected){
      this.logger.error("Unable to connect to RabbitMQ after multiple attempts");
      throw new Error("Unable to connect to RabbitMQ after multiple attempts");
    } 
  }

  async publishToExchange(exchange: string, routingKey: string, message: string): Promise<void> {
    if (!this.rabbitMQChannel) {
      this.logger.warn("RabbitMQ Channel is not available. Reconnecting...");
      await this.connectRabbitMQ(exchange); // Tentative de reconnexion si le canal n'est pas disponible
    }

    try {
      if (this.rabbitMQChannel) {
        // S'assurer que l'exchange existe avant de publier
        await this.rabbitMQChannel.assertExchange(exchange, "direct", { durable: true });

        // Publier le message dans l'exchange avec la clé de routage
        this.rabbitMQChannel.publish(exchange, routingKey, Buffer.from(message));
        this.logger.info(`Message sent to exchange "${exchange}" with routing key "${routingKey}":`, message);
      }
    } catch (error) {
      this.logger.error("Failed to publish message to exchange:", error);
    }
  }

  async consumeFromExchange(
    exchange: string,
    routingKey: string,
    onMessage: (msg: ConsumeMessage | null) => void
  ): Promise<void> {
    if (!this.rabbitMQChannel) {
      this.logger.warn("RabbitMQ Channel is not available. Reconnecting...");
      await this.connectRabbitMQ(exchange);
    }

    try {
      if (this.rabbitMQChannel) {
        // Création d'une queue temporaire et anonyme pour recevoir les messages de l'exchange
        const { queue } = await this.rabbitMQChannel.assertQueue("", { exclusive: true });
        this.logger.info(`Queue "${queue}" created for exchange "${exchange}" with routingKey "${routingKey}"`);

        // Liaison de la queue à l'exchange avec la clé de routage spécifiée
        await this.rabbitMQChannel.bindQueue(queue, exchange, routingKey);
        this.logger.info(`Queue "${queue}" bound to exchange "${exchange}" with routingKey "${routingKey}"`);

        this.logger.info(`Waiting for messages in exchange "${exchange}" with routingKey "${routingKey}"`);

        this.rabbitMQChannel.consume(queue, (msg) => {
          if (msg !== null) {
            this.logger.info(`Received message from exchange "${exchange}":`, msg.content.toString());
            onMessage(msg);
            this.rabbitMQChannel!.ack(msg); // Accuse réception pour enlever le message de la queue
          }
        });
      }
    } catch (error) {
      this.logger.error("Failed to consume messages from exchange:", error);
    }
  }
}
