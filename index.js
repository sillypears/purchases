// Build a koa web server on port 3002
// Usage: node index.js

'use strict';
const env = process.env.NODE_ENV || 'dev';
const Koa = require('koa');
const app = new Koa();
const responseTime = require('koa-response-time');
app.use(responseTime());
require('dotenv').config({ path: `./.env.${env}` })

const body = require('koa-bodyparser');
// const body = require("koa-better-body");
const render = require('koa-ejs');
const serve = require('koa-static');
const Logger = require('koa-logger');
const favicon = require('koa-favicon');
const path = require('path');

const appName = process.env.APPNAME;
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    // debug: true
})


app.use(favicon(__dirname + '/public/favicon.ico'));

const rootRouter = require('./routes/root')
const apiRouter = require('./routes/api');

app.use(body());


app.use(Logger())
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods())
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())
    .use(serve('./public'))

app.listen(process.env.PORT, process.env.HOSTNAME, () => console.log(`running on ${process.env.HOSTNAME}:${process.env.PORT}`))
