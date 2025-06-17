import Router from 'koa-router'
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';

const router = new Router({
    prefix: '/api/swagger'
});

const spec = yamljs.load('./openapi.yaml');

router.get('/', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

export default router
