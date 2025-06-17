import Router from 'koa-router'
import { PanierController } from '../features/panier/controller/PanierController';
import { PanierInteractor } from '../features/panier/interactor/PanierInteractor';
import { PanierRepository } from '../features/panier/repository/PanierRepository';
import { ApiResponse } from '../infrastructure/api-response/ApiResponse';
import { RedisHandler } from '../infrastructure/redis-cache/RedisHandler';
import { Logger } from '../infrastructure/logging/LoggerHandler';

const logger = Logger.getInstance();

const apiResponse = new ApiResponse();
const redisHandler = new RedisHandler(logger);
const repository = new PanierRepository(redisHandler,logger);
const interactor = new PanierInteractor(repository,apiResponse,logger);
const controller = new PanierController(interactor,logger);

const router = new Router({
    prefix: '/api/panier'
});

router
    .post('/',controller.onAddArticleToPanier.bind(controller))
    .get('/', controller.onGetPanier.bind(controller))
    .delete('/:userId/:articleId', controller.onRemoveArticleFromPanier.bind(controller))
    .delete('/:userId', controller.onRemovePanier.bind(controller));


export default router
