const env = process.env.NODE_ENV || "dev"
require('dotenv').config({ path: `../.env.${env}` })
const router = require('koa-router')();
const axios = require('axios');
const db = require('../db');
const models = require('../models/models');
const multer = require('@koa/multer')
const koaSwagger = require('koa2-swagger-ui');
const upload = multer()
const moment = require('moment')

router.get('/', async (ctx, next) => {
    let purchases = await models.getPurchases()
    let missingPurchases = await models.getPurchasesThatAreMissing()
    return ctx.render('index', {
        title: "Purchases",
        nav: "index",
        purchases: purchases,
        missingPurchases: missingPurchases,
        totals: purchases.length
    });
});

router.get('/missing', async (ctx, next) => {
    let purchases = await models.getPurchasesThatAreMissing()
    return ctx.render('index', {
        title: "Purchases",
        nav: "index",
        purchases: purchases,
        totals: purchases.length
    });
});

router.get('/makers', async (ctx, next) => {

    let makers = await models.getMakerTotals();
    return ctx.render('makers', {
        title: "Makers",
        nav: "makers",
        makers: makers,
        totals: makers.length
    });
});

router.get('/maker/:type/:id', async (ctx, next) => {
    let maker = await models.getMakerTotal(ctx.params.type, ctx.params.id)
    let purchases = await models.getMakerPurchases(ctx.params.type, ctx.params.id)

    return ctx.render('maker', {
        title: `Maker - ${maker.display_name} -$${maker.total}`,
        nav: "maker",
        maker: maker,
        purchases: purchases,
        totals: purchases.length
    });
});

router.get('/maker/id/:id/edit', async (ctx, next) => {
    let maker = await models.getMakerById(ctx.params.id)
    return ctx.render('edit-maker', {
        title: `Maker - ${maker.display_name} -$${maker.total}`,
        nav: "maker",
        maker: maker,
        ticker: ''
    });
});


router.get('/vendors', async (ctx, next) => {

    let vendors = await models.getVendorTotals();
    return ctx.render('vendors', {
        title: "Vendors",
        nav: "vendors",
        vendors: vendors,
        totals: vendors.length
    });
});

router.get('/vendor/:type/:id', async (ctx, next) => {
    let vendor = await models.getVendorTotal(ctx.params.type, ctx.params.id)
    let purchases = await models.getVendorPurchases(ctx.params.type, ctx.params.id)

    return ctx.render('vendor', {
        title: `Vendor - ${vendor.display_name} -$${vendor.total}`,
        nav: "vendor",
        vendor: vendor,
        purchases: purchases,
        totals: purchases.length
    });
});

router.get('/vendor/id/:id/edit', async (ctx, next) => {
    let vendor = await models.getVendorById(ctx.params.id)
    return ctx.render('edit-vendor', {
        title: `Vendor - ${vendor.display_name} -$${vendor.total}`,
        nav: "vendor",
        vendor: vendor,
        ticker: ''
    });
});

router.get('/add-purchase', async (ctx, next) => {
    let m = await models.getMakers();
    let v = await models.getVendors();
    let c = await models.getCategories();
    let s = await models.getSaleTypes();
    let maxSet = await models.getLatestSet();
    console.log(maxSet)
    return ctx.render('add-purchase', {
        title: "Add Purchase",
        nav: "add-purchase",
        totals: 0,
        ticker: "",
        makers: m,
        vendors: v,
        categories: c,
        saleTypes: s,
        maxSet: maxSet
    });
});


router.get('/purchase/:id', async (ctx, next) => {
    // let purchase = await axios.get(`http://${process.env.HOSTNAME}:${process.env.PORT}/api/purchase/${ctx.params.id}`);
    let purch = await models.getPurchase(ctx.params.id)
    let n = await models.getNextPurchaseId(ctx.params.id)
    let p = await models.getPrevPurchaseId(ctx.params.id)
    return ctx.render('purchase', {
        title: `Purchase #${ctx.params.id}`,
        nav: "purchase",
        ticker: "",
        totals: 0,
        purchase: purch,
        next: n || 0,
        prev: p || 0,
        moment: moment
    });
});

router.get('/purchase/:id/edit', async (ctx, next) => {
    const m = await models.getMakers();
    const v = await models.getVendors();
    const c = await models.getCategories();
    const s = await models.getSaleTypes();
    const maxSet = await models.getLatestSet();
    const purchase = await models.getPurchase(ctx.params.id)
    console.log(purchase.purchaseDate, purchase.soldDate)
    return ctx.render('edit-purchase', {
        title: "Edit Purchase",
        nav: "edit-purchase",
        totals: 0,
        ticker: "",
        makers: m,
        vendors: v,
        categories: c,
        saleTypes: s,
        purchase: purchase,
        maxSet: maxSet,
        moment: moment
    });
});

router.get('/add-maker', async (ctx, next) => {

    return ctx.render('add-maker', {
        title: "Add Maker!",
        nav: "add-maker",
        ticker: "",
        totals: 0

    });
});

router.get('/add-vendor', async (ctx, next) => {

    return ctx.render('add-vendor', {
        title: "Add Vendor!",
        nav: "add-vendor",
        ticker: "",
        totals: 0
    });
});

router.get('/graph/artisan-count', async (ctx, next) => {
    let artisanData = await models.getArtisansByCount()
    return ctx.render('artisan-count', {
        title: "Artisans By Count",
        nav: "artisan-count",
        ticker: "",
        totals: 0,
        data: artisanData

    })
})

router.get('/forsale', async (ctx, next) => {

    let sale = await models.getAllForSale();
    return ctx.render('forsale', {
        title: "Shit For Sale",
        nav: "forsale",
        sale: sale,
        totals: sale.length
    });
});

router.get('/notforsale', async (ctx, next) => {

    let sale = await models.getAllNotForSale();
    return ctx.render('notforsale', {
        title: "Shit Not For Sale",
        nav: "notforsale",
        sale: sale,
        totals: sale.length
    });
});

router.post('/add-purchase', upload.single('image'), async (ctx, next) => {
    let a = ctx.request.body
    if (a.adjustments < 0) { 
        a.adjustments = 0
    }
    console.log(`adjustments: ${a.adjustments} --`)
    let insertId = await models.insertPurchase(a.category, a.detail, a.archivist, a.set, a.maker, a.vendor, a.price, a.adjustments, a.saletype, 0, a.purchaseDate, a.expectedDate, a.orderSet, a.image);
    // let insertId = await models.insertPurchaseImage(a.category, a.detail, a.set, a.maker, a.vendor, a.price, a.adjustments, a.saletype, 0, a.purchaseDate, a.expectedDate, a.orderSet, ctx.file);

    console.log(insertId)
    let m = await models.getMakers();
    let v = await models.getVendors();
    let c = await models.getCategories();
    let s = await models.getSaleTypes();
    let maxSet = await models.getLatestSet();

    return ctx.render('add-purchase', {
        title: "Add Purchase",
        nav: "add-purchase",
        totals: 0,
        ticker: insertId,
        makers: m,
        vendors: v,
        categories: c,
        saleTypes: s,
        maxSet: maxSet
    });
});

router.post('/add-maker', async (ctx, next) => {
    let ticker;
    let makerId = await models.insertMaker(ctx.request.body.name, ctx.request.body.displayName, ctx.request.body.ka_name, ctx.request.body.ka_id, ctx.request.body.instagram)
    if (makerId.insertId > 0) {
        ticker = { makerId: makerId.insertId }
    } else {
        ticker = { error: "Unsuccessful adding maker" }
    }
    return ctx.render('add-maker', {
        title: "Add Maker!",
        nav: "add-maker",
        ticker: ticker,
        totals: 0
    });
});

router.post('/add-vendor', async (ctx, next) => {
    let ticker;
    let vendorId = await models.insertVendor(ctx.request.body.name, ctx.request.body.displayName, ctx.request.body.site)
    if (vendorId > 0) {
        ticker = { vendorId: vendorId }
    } else if (vendorId == 0) {
        ticker = { error: "Vendor exists!"}
    } else {
        ticker = { error: "Unsuccessful adding vendor" }
    }
    return ctx.render('add-vendor', {
        title: "Add Vendor!",
        nav: "add-vendor",
        ticker: ticker,
        totals: 0
    });
});

router.post('/purchase/:id/edit', async (ctx, next) => {
    let purch = await models.updatePurchaseById(ctx.params.id, ctx.request.body)
    if (purch) {
        ctx.status = 301
        ctx.redirect(`purchase/${ctx.params.id}`)    
    } 
    ctx.status = 209
    ctx.redirect(`/purchase/${ctx.params.id}`)

});

router.post('/maker/id/:id/edit', async (ctx, next) => {
    let purch = await models.updateMakerById(ctx.params.id, ctx.request.body)
    if (purch) {
        ctx.status = 301
        ctx.redirect(`/maker/id/${ctx.params.id}`)    
    } 
    ctx.status = 209
    ctx.redirect(`/maker/id/${ctx.params.id}`)

});

router.post('/vendor/id/:id/edit', async (ctx, next) => {
    let purch = await models.updateVendorById(ctx.params.id, ctx.request.body)

    if (purch) {
        ctx.status = 301
        ctx.redirect(`/vendor/id/${ctx.params.id}`)    
    } 
    ctx.status = 209
    ctx.redirect(`/vendor/id/${ctx.params.id}`)

});
module.exports = router;