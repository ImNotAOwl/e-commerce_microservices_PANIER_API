import { Context, Next } from "koa";
import { IPanierInteractor } from "../interfaces/IPanierInteractor";
import { Panier } from "../entity/Panier";
import { ILoggerHandler } from "../../../infrastructure/logging/interfaces/ILoggerHandler";

export class PanierController {
    private interactor: IPanierInteractor;
    private logger: ILoggerHandler
    constructor(interactor: IPanierInteractor, logger: ILoggerHandler){
        this.interactor = interactor;
        this.logger = logger;
    }

    /**
     * Get data from bucket
     * @param ctx 
     * @param next 
     */
    async onGetPanier(ctx: Context, next: Next){
        try {
            const user = ctx.query.user?.toString();
            this.logger.info(`Fetching basket for user=${user}`);
            const {status, message, ...rest } = await this.interactor.getPanier(user);

            ctx.status = status;
            ctx.body = {message, ...rest };
            this.logger.info('Basket fetched successfully:', { status, message });
          } catch (error) {
            const { status, message } = error as any;
            this.logger.error('Error fetching basket:', error);
            ctx.status = status;
            ctx.body = { message };
          }
    }

    /**
     * Add one article in bucket
     * @param ctx 
     * @param next 
     */
    async onAddArticleToPanier(ctx: Context, next: Next){
        try {
            const { body } = ctx.request;
            this.logger.info('Adding article to basket with data:', body);

            const {status, message, ...rest } = await this.interactor.addPanier(body as Panier);

            ctx.status = status;
            ctx.body = {message, ...rest };
            this.logger.info('Article successfully added to basket:', { status, message });
          } catch (error) {
            const { status, message } = error as any;
            this.logger.error('Error creating basket:', error);
            ctx.status = status;
            ctx.body = { message };
          }
    }

    /**
     * Remove one bucket
     * @param ctx 
     * @param next 
     */
    async onRemovePanier(ctx: Context, next: Next){
      try {
          const userId = ctx.params.userId?.toString();
          this.logger.info(`Remove basket for user ${userId}`);
          const {status, message, ...rest } = await this.interactor.deletePanier(userId);

          ctx.status = status;
          ctx.body = {message, ...rest };
          this.logger.info('Basket removed successfully', { status, message });
        } catch (error) {
          const { status, message } = error as any;
          this.logger.error('Error removing basket:', error);
          ctx.status = status;
          ctx.body = { message };
        }
    }

    /**
     * Remove one article from bucket
     * @param ctx 
     * @param next 
     */
    async onRemoveArticleFromPanier(ctx: Context, next: Next){
      try {
          const userId = ctx.params.userId?.toString();
          const articleId = ctx.params.articleId?.toString();
          const removeArticle =(ctx.query.removeArticle === 'true');
          this.logger.info(`Remove article ${articleId} from basket ${userId} with param removeArticle=${removeArticle}`);
          const {status, message, ...rest } = await this.interactor.removeArticleFromPanier(userId, articleId, removeArticle);

          ctx.status = status;
          ctx.body = {message, ...rest };
          this.logger.info('Article removed successfully from basket', { status, message });
        } catch (error) {
          const { status, message } = error as any;
          this.logger.error('Error removing article from basket:', error);
          ctx.status = status;
          ctx.body = { message };
        }
    }
}