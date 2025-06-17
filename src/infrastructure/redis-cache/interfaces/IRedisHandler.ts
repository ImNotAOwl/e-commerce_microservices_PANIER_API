import { RedisClientType } from "redis";

export interface IRedisHandler{

    /**
     * Client redis
     */
    client: RedisClientType;

    /**
    * Permet de créer le client Redis.
    */
    createRedisClient(): RedisClientType;
}