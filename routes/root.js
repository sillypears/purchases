const router = require('koa-router')();
const config = require('../.config');
const env = process.env.NODE_ENV || "development"
const axios = require('axios');
const db = require('../db');

router.get('/', async (ctx, next) => {
    let purchases = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/purchases`);
    console.log(purchases.data.purchases)
    return ctx.render('index', {
        title: "Purchases",
        purchases: purchases.data.purchases
    });
});


router.get('/maker', async (ctx, next) => {
    return ctx.render('maker', {
        title: "Add Maker",
        ticker: ""
    });
});

router.post('/maker', async (ctx, next) => {
    let res = await axios.post(`http://${config[env].hostname}:${config[env].port}/api/maker`, ctx.request.body)
    if (res.status === 200) {
        return ctx.render('maker', {
            title: "Add Maker",
            ticker: res.data
        });
    } else {
        return ctx.render('maker', {
            title: "Add Maker",
            ticker: {
                'status': res.status,
                'message': "error",
                'error': "Duplicate Entry"
            }
        });
    }
});

router.get('/add-purchase', async(ctx, next) => {
    let m = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/makers`);
    let v = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/vendors`);
    let c = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/categories`);
    let s = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/saletypes`);
    let maxSet = -1;
    try {
        conn = await db.getConnection();
        let max = await conn.query('SELECT MAX(order_set) as latest FROM keyboard.purchases;');
        maxSet = (max[0].latest > 0) ? max[0].latest : 0;
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) conn.release();
    }
    return ctx.render('add-purchase', {
        title: "Add Purchase",
        ticker: "",
        makers: m.data.makers,
        vendors: v.data.vendors,
        categories: c.data.categories,
        saleTypes: s.data.saleTypes,
        maxSet: maxSet
    });
}); 



router.post('/add-purchase', async(ctx, next) => {
    console.log(`a ${ctx.request.body}`)
    let insertId 
    let res = await axios.post(`http://${config[env].hostname}:${config[env].port}/api/purchase`, ctx.request.body)
    if (res.status === 200) {
        insertId = res.data.insertId
    } 
    let m = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/makers`);
    let v = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/vendors`);
    let c = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/categories`);
    let s = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/saletypes`);
    let maxSet = -1;

    return ctx.render('add-purchase', {
        title: "Add Purchase",
        ticker: insertId,
        makers: m.data.makers,
        vendors: v.data.vendors,
        categories: c.data.categories,
        saleTypes: s.data.saleTypes,
        maxSet: maxSet
    });
}); 

router.get('/purchase/:id', async(ctx, next) => {
    let purchase = await axios.get(`http://${config[env].hostname}:${config[env].port}/api/purchase/${ctx.params.id}`);
    return ctx.render('purchase', {
        title: `Purchase #${ctx.params.id}`,
        ticker: "",
        purchase: purchase.data
    });
}); 

router.get('/add-maker', async(ctx, next) => {

    return ctx.render('add-maker', {
        title: "Add Maker!",
        ticker: ""
    });
}); 



router.post('/add-maker', async(ctx, next) => {
    let insertId = -1
    let res = await axios.post(`http://${config[env].hostname}:${config[env].port}/api/maker`, ctx.request.body)
    if (res.status === 200) {
        console.log(res)
        ticker = { makerId: res.data.makerId }
    } else {
        ticker = { error: res.data.reason }
    }
    console.log(insertId)
    return ctx.render('add-maker', {
        title: "Add Maker!",
        ticker: ticker
    });
}); 

router.get('/add-vendor', async(ctx, next) => {

    return ctx.render('add-vendor', {
        title: "Add Vendor!",
        ticker: ""
    });
}); 

router.post('/add-vendor', async(ctx, next) => {
    let ticker
    let res = await axios.post(`http://${config[env].hostname}:${config[env].port}/api/vendor`, ctx.request.body)
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