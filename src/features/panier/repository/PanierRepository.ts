import { Panier } from "../entity/Panier";
import { IPanierRepository } from "../interfaces/IPanierRepository";
import { RedisClientType } from "redis";
import { IRedisHandler } from "../../../infrastructure/redis-cache/interfaces/IRedisHandler";
import { ILoggerHandler } from "../../../infrastructure/logging/interfaces/ILoggerHandler";

export class PanierRepository implements IPanierRepository{
    private client: RedisClientType;
    private readonly logger: ILoggerHandler;

    constructor(redisHandler: IRedisHandler, logger: ILoggerHandler) {
        this.client = redisHandler.client;
        this.logger = logger;
    }
   
    /**
     * Get all the basket for the user
     * @param user UserId
     * @returns Panier
     */
    async getBucket(user: string): Promise<Panier[] | null> {
        try {
            //Try to connect to the Redis Database
            await this.client.connect();
            // Get the data from Redis
            const panierData = await this.client.hGetAll(user);
            
    
            if (Object.keys(panierData).length === 0) return null;
    
            const panier: Panier[] = Object.values(panierData).map((itemData) =>
                JSON.parse(itemData)
            );
    
            return panier;
        } catch (error) {
            this.logger.error(`Error retriving basket ${user} from database:`,error);
            throw error;
        } finally {
            // Disconnect
            await this.client.disconnect();
        }
    }

    /**
     * Get one article in the basket
     * @param user UserId
     * @param articleId ArticleId
     * @returns Panier 
     */
    async getArticleInBucket(user: string, articleId: string): Promise<Panier | null> {
        try {
            //Try to connect to the Redis Database
            await this.client.connect();
            // Get the data from Redis
            const panierData = await this.client.hGet(user, articleId);
            
            if (!panierData) return null;

            const panier: Panier = JSON.parse(panierData);
            return panier;

        } catch (error) {
            this.logger.error(`Error retriving article ${articleId} in basket ${user} from database:`,error);
            throw error;
        }finally {
            // Disconnect
            await this.client.disconnect();
        }
    }

    /**
     * Add one article in the basket
     * @param data Panier
     */
    async addArticleInBucket(data: Panier): Promise<void> {
        try {
            await this.client.connect();
    
            await this.client.hSet(data.user, data.articleId, JSON.stringify(data));
        } catch (error) {
            this.logger.error(`Error adding basket in database:`, error);
            throw error;
        } finally {
            await this.client.disconnect();
        }
    }


    /**
     * Delete one article from the basket
     * @param user UserId
     * @param article ArticleId
     */
    async deleteOneArticleInBucket(user: string, article: string): Promise<void>{
        try {
            await this.client.connect();
    
            await this.client.hDel(user, article);
        } catch (error) {
            this.logger.error(`Error deleting basket ${user} from database:`, error);
            throw error;
        } finally {
            await this.client.disconnect();
        }
    }

    /**
     * Delete the basket for the user
     * @param user UserId
     */
    async deleteBucket(user: string): Promise<void>{
        try {
            await this.client.connect();
    
            await this.client.del(user);
        } catch (error) {
            this.logger.error(`Error deleting basket ${user} from database:`, error);
            throw error;
        } finally {
            await this.client.disconnect();
        }
    }
}