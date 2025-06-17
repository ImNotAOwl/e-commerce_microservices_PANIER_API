import { RedisClientType, createClient } from "redis";
import { IRedisHandler } from "./interfaces/IRedisHandler";
import { ILoggerHandler } from "../logging/interfaces/ILoggerHandler";

export class RedisHandler implements IRedisHandler{

  client: RedisClientType;
  private readonly logger: ILoggerHandler;

  constructor(logger: ILoggerHandler){
    this.logger = logger;
    this.client = this.createRedisClient()
  }

  createRedisClient(): RedisClientType {
    try{ 
        this.client =  createClient({
          url: `redis://${process.env.BUCKET_REDIS_HOST}:${process.env.BUCKET_REDIS_PORT}`,
        });
        
        this.client.on("error", (err) => this.logger.error("Redis Client Error", err));
    }
    catch (error) {
      this.logger.error(`Failed to connect to Redis databse`, error);
    }
    return this.client;
  }

}