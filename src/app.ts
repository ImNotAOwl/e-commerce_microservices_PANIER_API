import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import healthCheck from './routes/healthCheckRouter';
import cors from '@koa/cors'
import panier from './routes/panierRouter';
import swagger from './routes/swaggerRouter'
import './rabbitMq';
import { Logger } from './infrastructure/logging/LoggerHandler';

const logger = Logger.getInstance();
const app = new Koa();

app.use(bodyParser());
app.use(cors(
    {
        origin: "*", // Autorise toutes les origines (peut être remplacé par ton frontend "http://127.0.0.1:5173")
        allowMethods: ["GET", "POST", "DELETE", "OPTIONS"], // Autorise les méthodes nécessaires
        allowHeaders: ["Authorization", "Content-Type"], // Autorise les headers nécessaires
        credentials: true, // Permet d'envoyer les cookies ou tokens (si besoin)
   }
));

let port = process.env.BUCKET_PORT ?? 3000;

app.use(healthCheck.routes());
app.use(panier.routes());
app.use(swagger.routes());

app.listen(port, ()=>{
    logger.info(`Server listening on port : ${port}`);
});
