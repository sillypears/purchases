const env = process.env.NODE_ENV || "dev"
require('dotenv').config({ path: `../.env.${env}` })
const router = require('koa-router')();
const axios = require('axios');
const db = require('../db');
const models = require('../models/models');
const multer = require('@koa/multer')
const koaSwagger = require('koa2-swagger-ui');
const upload = multer()

router.get('/', async (ctx, next) => {
    let purchases = await models.getPurchases()
    return ctx.render('index', {
        title: "Purchases",
        purchases: purchases
    });
});

// router.get('/swagger', koaSwagger({
//         routePrefix: '/swagger', // host at /swagger instead of default /docs
//         swaggerOptions: {
//             url: `http://localhost:${process.env.PORT}/swagger_output.json`, // example path to json
//         },
//     })
// );

router.get('/makers', async (ctx, next) => {

    let makers = await models.getMakerTotals();
    return ctx.render('makers', {
        title: "Makers",
        makers: makers
    });
});

router.get('/maker/:type/:id', async (ctx, next) => {
    let maker = await models.getMakerTotal(ctx.params.type, ctx.params.id)
    let purchases = await models.getMakerPurchases(ctx.params.type, ctx.params.id)

    return ctx.render('maker', {
        title: `Maker - ${maker.display_name} -$${maker.total}`,
        maker: maker,
        purchases: purchases
    });
});

// router.get('/maker/name/:name', async (ctx, next) => {
//     let maker = await models.getMakerTotal("name", ctx.params.name)
//     return ctx.render('maker', {
//         title: `Maker - ${maker.display_name}`,
//         maker: maker
//     });

// });

router.get('/vendors', async (ctx, next) => {

    let vendors = await models.getVendorTotals();
    return ctx.render('vendors', {
        title: "Vendors",
        vendors: vendors
    });
});

router.get('/vendor/:type/:id', async (ctx, next) => {
    let vendor = await models.getVendorTotal(ctx.params.type, ctx.params.id)
    let purchases = await models.getVendorPurchases(ctx.params.type, ctx.params.id)

    return ctx.render('vendor', {
        title: `Vendor - ${vendor.display_name} -$${vendor.total}`,
        vendor: vendor,
        purchases: purchases
    });
});


router.get('/add-purchase', async (ctx, next) => {
    let m = await models.getMakers();
    let v = await models.getVendors();
    let c = await models.getCategories();
    let s = await models.getSaleTypes();
    let maxSet = await models.getLatestSet();
    return ctx.render('add-purchase', {
        title: "Add Purchase",
        ticker: "",
        makers: m,
        vendors: v,
        categories: c,
        saleTypes: s,
        maxSet: maxSet
    });
});

router.post('/add-purchase', upload.single('image'), async (ctx, next) => {
    let a = ctx.request.body
    let insertId = await models.insertPurchase(a.category, a.detail, a.set, a.maker, a.vendor, a.price, a.adjustments, a.saletype, 0, a.purchaseDate, a.expectedDate, a.orderSet);
    // let insertId = await models.insertPurchaseImage(a.category, a.detail, a.set, a.maker, a.vendor, a.price, a.adjustments, a.saletype, 0, a.purchaseDate, a.expectedDate, a.orderSet, ctx.file);

    console.log(insertId)
    let m = await models.getMakers();
    let v = await models.getVendors();
    let c = await models.getCategories();
    let s = await models.getSaleTypes();
    let maxSet = await models.getLatestSet();

    return ctx.render('add-purchase', {
        title: "Add Purchase",
        ticker: insertId,
        makers: m,
        vendors: v,
        categories: c,
        saleTypes: s,
        maxSet: maxSet
    });
});

router.get('/purchase/:id', async (ctx, next) => {
    let purchase = await axios.get(`http://${process.env.HOSTNAME}:${process.env.PORT}/api/purchase/${ctx.params.id}`);
    return ctx.render('purchase', {
        title: `Purchase #${ctx.params.id}`,
        ticker: "",
        purchase: purchase.data
    });
});

router.get('/add-maker', async (ctx, next) => {

    return ctx.render('add-maker', {
        title: "Add Maker!",
        ticker: ""
    });
});

router.post('/add-maker', async (ctx, next) => {
    let insertId = -1
    let res = await axios.post(`http://${process.env.HOSTNAME}:${process.env.PORT}/api/maker`, ctx.request.body)
    if (res.status === 200) {
        ticker = { makerId: res.data.makerId }
    } else {
        ticker = { error: res.data.reason }
    }
    return ctx.render('add-maker', {
        title: "Add Maker!",
        ticker: ticker
    });
});

router.get('/add-vendor', async (ctx, next) => {

    return ctx.render('add-vendor', {
        title: "Add Vendor!",
        ticker: ""
    });
});

router.post('/add-vendor', async (ctx, next) => {
    let ticker
    let res = await axios.post(`http://${process.env.HOSTNAME}:${process.env.PORT}/api/vendor`, ctx.request.body)
    if (res.status === 200) {
        console.log(res)
        ticker = { vendorId: res.data.vendorId }
    } else {
        ticker = { error: res.data.reason }
    }
    console.log(ticker)
    return ctx.render('add-vendor', {
        title: "Add Vendor!",
        ticker: ticker
    });
});
module.exports = router;