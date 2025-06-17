import { IApiResponse } from "../../../infrastructure/api-response/interfaces/IApiResponse";
import { Panier } from "../entity/Panier";
import { IPanierInteractor } from "../interfaces/IPanierInteractor";
import { IPanierRepository } from "../interfaces/IPanierRepository";
import { ILoggerHandler } from "../../../infrastructure/logging/interfaces/ILoggerHandler";

export class PanierInteractor implements IPanierInteractor{

    private panierRepository: IPanierRepository;
    private readonly apiResponse :IApiResponse;
    private readonly logger :ILoggerHandler;

    constructor(repository: IPanierRepository, apiResponse: IApiResponse, logger: ILoggerHandler){
        this.panierRepository = repository;
        this.apiResponse = apiResponse;
        this.logger = logger;
    }

    async deletePanier(user: string){
        //Vérifie que le user soit renseigné
        if(!user){
            this.logger.error('User is required');
            throw this.apiResponse.buildError('User is required', 400);
        }
        await this.panierRepository.deleteBucket(user);

        return this.apiResponse.buildSuccess('Basket successfully removed', {});

    }

    async getPanier(user: string | undefined) {
        //Vérifie que le user soit renseigné
        if(!user){
            this.logger.error('User is required');
            throw this.apiResponse.buildError('User is required', 400);
        }
        //Récupération du panier dans la base
        const basketItems: Panier[] | null = await this.panierRepository.getBucket(user);
        //Si le panier est vide alors on return une 404
        if(!basketItems){
            this.logger.error(`Basket ${user} not found`, user);
            throw this.apiResponse.buildError(`Basket ${user} not found`, 404)
        } 
            
        return this.apiResponse.buildSuccess('Basket successfully retrieve', {
            basketItems: basketItems,
        });
    }

    async addPanier(body: Panier) {
        // Vérifie si l'élément existe déjà dans le panier de l'utilisateur
        const existingItemData: Panier | null = await this.panierRepository.getArticleInBucket(body.user, body.articleId);

        if (existingItemData) {
            // L'article existe, met à jour la quantité
            existingItemData.quantity = (existingItemData.quantity ?? 0) + 1;   

            // Met à jour l'article dans Redis
            await this.panierRepository.addArticleInBucket(existingItemData);
        } else {
            // L'article n'existe pas, on l'ajoute avec une quantité à 1
            body.quantity = 1;
            await this.panierRepository.addArticleInBucket(body);
        }
        return this.apiResponse.buildSuccess('Article successfully added to basket', {
            basketId: body.user,
        });
    }

    async removeArticleFromPanier(user: string | undefined, article: string | undefined, removeArticle: boolean = false) {
        //Vérifie que le user soit renseigné
        if(!user){
            this.logger.error('User is required');
            throw this.apiResponse.buildError('User is required', 400);
        }
        if(!article){
            this.logger.error('Article is required');
            throw this.apiResponse.buildError('Article is required', 400);
        }

        // Vérifie si l'élément existe déjà dans le panier de l'utilisateur
        const existingItemData: Panier | null = await this.panierRepository.getArticleInBucket(user, article);

        if (!existingItemData) {
            this.logger.error('Article is not in the basket');
            throw this.apiResponse.buildError('Article is not in the basket', 404);
        } else if (existingItemData.quantity == 1 || removeArticle){
            // L'article est existe avec quantite = 1, on supprime l'article
           await this.panierRepository.deleteOneArticleInBucket(user, article)
        } else {
            // L'article existe, met à jour la quantité
            existingItemData.quantity = (existingItemData.quantity ?? 0) - 1;   
            // Met à jour l'article dans Redis
            await this.panierRepository.addArticleInBucket(existingItemData);
        }

        return this.apiResponse.buildSuccess('Article successfully removed from basket', {});
    }

}