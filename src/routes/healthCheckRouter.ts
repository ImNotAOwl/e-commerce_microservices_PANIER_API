import Router from 'koa-router'

const router = new Router({
    prefix: '/api/health'
});

//Is the api ready ? 
router.get('/ready', (ctx, next) =>{
    ctx.status = 200;
    ctx.body = "READY";
})

//Is the api Alive ?
router.get('/live', (ctx, next) =>{
    ctx.status = 200;
    ctx.body = "LIVE";
})

//Default health check
router.get('/', (ctx, next) =>{
    ctx.status = 200;
    ctx.body = "This is fine";
})


export default router
