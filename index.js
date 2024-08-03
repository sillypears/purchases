// Build a koa web server on port 3002
// Usage: node index.js

'use strict';
const env = process.env.NODE_ENV || 'dev';
const Koa = require('koa');
const app = new Koa();
const responseTime = require('koa-response-time');
app.use(responseTime());
require('dotenv').config({ path: `./.env.${env}` })
const Router = require('koa-router');
const body = require('koa-bodyparser');
// const body = require("koa-better-body");
const render = require('koa-ejs');
const serve = require('koa-static');
const Logger = require('koa-logger');
const favicon = require('koa-favicon');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const js = require('koa-json')
const { koaSwagger } = require('koa2-swagger-ui');
const appName = process.env.APPNAME;

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    // debug: true
})


app.use(favicon(__dirname + '/public/favicon.ico'));


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Keyboard Purchases',
            version: '1.0.1',
            contact: {
                name: "yes"
            },
            description: "Stuff!",
            license: {
                name: "The Unlicense",
                url: "https://unlicense.org/"
              },
        },
        servers: [
            {
                url: `https://${process.env.HOSTNAME}/api`,
                description: "main"
            }
        ]
    },
    apis: ['./routes/api.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

const router = new Router()
router.get("/api/api-docs.json", async function (ctx) {
    ctx.set("Content-Type", "application/json");
    ctx.body = openapiSpecification;
});

const rootRouter = require('./routes/root')
const apiRouter = require('./routes/api');
app.use(js())
app.use(body());
app.use(Logger())
    .use(router.routes())
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods())
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())
    .use(serve('./public'))
app.use(koaSwagger({
    title: 'lol hi', // page title
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    routePrefix: '/api/api-docs',
    swaggerOptions: {
        // url: 'https://raw.githubusercontent.com/sillypears/purchases/swagger/api-docs.json', 
        url: `https://${process.env.HOSTNAME}/api/api-docs.json`,
        docExpansion: 'none',
    },
    hideTopbar: true,
}),
);

app.listen(process.env.PORT, process.env.HOSTNAME, () => console.log(`running on ${process.env.HOSTNAME}:${process.env.PORT}`))

module.exports = {
    info: options.definition.info,
    host: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
    basePath: '/api',
    openapiSpecification
}
