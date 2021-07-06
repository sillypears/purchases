// Build a koa web server on port 3002
// Usage: node index.js

'use strict';

const Koa = require('koa');
const app = new Koa();
const responseTime = require('koa-response-time');
app.use(responseTime());
const config = require('./.config');

const body = require('koa-bodyparser');
// const body = require("koa-better-body");
const render = require('koa-ejs');
const serve = require('koa-static');
const Logger = require('koa-logger');
const favicon = require('koa-favicon');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const appName = config[env].appName;

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


app.listen(config[env].port, () => console.log(`running on ${config[env].port}`))