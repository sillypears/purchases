const Router = require('koa-router');
const fs = require('fs')
const config = require('../.config');
const env = process.env.NODE_ENV || 'development';
const db = require('../db');

var router = new Router({
    prefix: '/api'
});

// api
router.get('/', async (ctx, next) => {
    ctx.body = {
        'version': config[env].version
    }
});

// api/makers
router.get('/makers', async (ctx, next) => {
    try {
        conn = await db.getConnection();
        let makers = await conn.query('SELECT * FROM keyboard.makers;')
        return ctx.body = {
            'makers': makers
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
    } finally {
        if (conn) return conn.release();
    }
});

// api/maker
router.get('/maker', async (ctx, next) => {
    try {
        conn = await db.getConnection();
        let maker = await conn.query('SELECT * FROM keyboard.makers ORDER BY id DESC LIMIT 1;')
        ctx.body = {
            'maker': maker[0]
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    } finally {
        if (conn) return conn.release();
    }
});

// api/id/:id
router.get('/maker/id/:id', async (ctx, next) => {
    try {
        conn = await db.getConnection();
        let maker = await conn.query(`SELECT * FROM keyboard.makers m WHERE m.id = ${ctx.params.id}`)
        if (maker) {
            ctx.body = {
                'maker': maker[0]
            }
            ctx.status = 200
        } else {
            throw err;
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 422
    } finally {
        if (conn) return conn.release();
    }

});

// api/name/:name
router.get('/maker/name/:name', async (ctx, next) => {
    try {
        conn = await db.getConnection();
        let maker = await conn.query(`SELECT * FROM keyboard.makers m WHERE m.name = '${ctx.params.name}'`)
        if (maker) {
            ctx.body = {
                'maker': maker[0]
            }
            ctx.status = 200
        } else {
            throw err;
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 422
    } finally {
        if (conn) return conn.release();
    }

});

// api/maker
router.post('/maker', async (ctx, next) => {

    try {
        let name = ctx.request.body.name;
        let displayName = ctx.request.body.displayName;
        let instagram = ctx.request.body.instagram;
        conn = await db.getConnection();
        if ((name) && (displayName) && (instagram)) {
            let makerId = await conn.query(`INSERT INTO keyboard.makers (name, display_name, instagram) VALUES ('${name}', '${displayName}', '${instagram}');`)
            if (makerId) {
                ctx.body = {
                    'status': "OK",
                    'makerId': makerId.insertId
                }
                ctx.status = 200

            } else {
                throw err;
            }

        } else {
            ctx.body = {}
            ctx.status = 204
        }
    } catch (err) {
        if (err.code == "ER_DUP_ENTRY") {
            ctx.body = {
                'status': "Failure",
                'reason': "Duplicate Entry",
            }
            ctx.status = 209
        } else {
            ctx.body = { 'status': 'Failure', 'error': err }
            ctx.status = 422
        }
    } finally {
        if (conn) return conn.release()
    }
});

// api/vendors
router.get('/vendors', async (ctx, next) => {
    try {
        conn = await db.getConnection(0)
        let vendors = await conn.query('SELECT * FROM keyboard.vendors;')
        return ctx.body = {
            'vendors': vendors
        }
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    } finally {
        if (conn) return conn.release();
    }
});

// api/maker
router.post('/vendor', async (ctx, next) => {
    console.log(ctx.request.body)
    try {
        let name = ctx.request.body.name;
        let displayName = ctx.request.body.displayName;
        let link = ctx.request.body.site;
        conn = await db.getConnection();
        if ((name) && (displayName) && (link)) {
            let vendorId = await conn.query(`INSERT INTO keyboard.vendors (name, display_name, link) VALUES ('${name}', '${displayName}', '${link}');`)
            if (vendorId) {
                console.log(vendorId)
                ctx.body = {
                    'status': "OK",
                    'vendorId': vendorId.insertId
                }
                ctx.status = 200

            } else {
                throw err;
            }

        } else {
            ctx.body = {}
            ctx.status = 204
        }
    } catch (err) {
        if (err.code == "ER_DUP_ENTRY") {
            ctx.body = {
                'status': "Failure",
                'reason': "Duplicate Entry",
            }
            ctx.status = 209
        } else {
            ctx.body = { 'status': 'Failure', 'error': err }
            ctx.status = 422
        }
    } finally {
        if (conn) return conn.release()
    }
});

// api/categories
router.get('/categories', async (ctx, next) => {
    try {
        conn = await db.getConnection(0)
        let categories = await conn.query('SELECT * FROM keyboard.categories;')
        return ctx.body = {
            'categories': categories
        }
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    } finally {
        if (conn) return conn.release();
    }
});

// api/saletypes
router.get('/saletypes', async (ctx, next) => {
    try {
        conn = await db.getConnection(0)
        let saleTypes = await conn.query('SELECT * FROM keyboard.sale_types;')
        return ctx.body = {
            'saleTypes': saleTypes
        }
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    } finally {
        if (conn) return conn.release();
    }
});

// api/purchases
router.get('/purchases', async (ctx, next) => {
    try {
        conn = await db.getConnection(0)
        let purchases = await conn.query('SELECT * FROM keyboard.purchases;')
        ctx.body = {
            'purchases': purchases
        }
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    } finally {
        if (conn) return conn.release();
    }
});

// api/purchase
router.get('/purchase', async (ctx, next) => {
    try {
        conn = await db.getConnection(0);
        let purchase = await conn.query(`SELECT * FROM keyboard.purchases ORDER BY id DESC limit 1`);
        ctx.body = {
            'purchase': purchase
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    } finally {
        if (conn) return conn.release();
    }

});

// api/purchase/:id
router.get('/purchase/:id', async (ctx, next) => {
    try {
        conn = await db.getConnection(0);
        let purchase = await conn.query(`SELECT * FROM keyboard.purchases WHERE id = ${ctx.params.id}`);
        ctx.body = purchase[0]
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    } finally {
        if (conn) return conn.release();
    }
});

router.get('/orderset/:id', async (ctx, next) => {
    try {
        conn = await db.getConnection(0);
        let orders = await conn.query(`SELECT * FROM keyboard.purchases WHERE orderSet = ${ctx.params.id}`);
        let orderTotal = 0.00
        for (let order of orders) {
            
            orderTotal += order.price + order.adjustments
        }
        ctx.body = {
            orders: orders,
            total: orderTotal.toFixed(2)
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    } finally {
        if (conn) return conn.release();
    }
});
// api/purchase
router.post('/purchase', async (ctx, next) => {
    console.log(ctx.request.body)

    try {
        let category = ctx.request.body.category
        let detail = ctx.request.body.detail
        let set = ctx.request.body.set
        let maker = ctx.request.body.maker
        let vendor = ctx.request.body.vendor
        let price = ctx.request.body.price
        let adjustments = ctx.request.body.adjustments
        let saletype = ctx.request.body.saletype
        let purchaseDate = ctx.request.body.purchaseDate
        let expectedDate = ctx.request.body.expectedDate
        let orderSet = ctx.request.body.orderSet
        if (category) { }
        console.log(`INSERT INTO keyboard.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, '${detail}', '${set}', ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, 0, '${purchaseDate}', '${expectedDate}', ${orderSet});`)

        conn = await db.getConnection(0);
        let purchaseId = await conn.query(`INSERT INTO keyboard.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, '${detail}', '${set}', ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, 0, '${purchaseDate}', '${expectedDate}', ${orderSet});`)
        ctx.body = {
            'status': "OK",
            'purchaseId': purchaseId.insertId
        }
        ctx.status = 200
    } catch (err) {
        console.log(err)
        if (err.code == "ER_DUP_ENTRY") {
            ctx.body = {
                'status': "Failure",
                'reason': "Duplicate Entry",
            }
            ctx.status = 209
        } else {
            ctx.body = { 'status': 'Failure', 'error': err }
            ctx.status = 422
        }
    } finally {
        if (conn) return conn.release()
    }
});


module.exports = router;