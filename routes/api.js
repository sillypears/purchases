const env = process.env.NODE_ENV || "dev"
require('dotenv').config({ path: `../.env.${env}` })
const Router = require('koa-router');
const fs = require('fs')

const db = require('../db');
const models = require('../models/models');

var router = new Router({
    prefix: '/api'
});

// api
router.get('/', async (ctx, next) => {
    // #swagger.ignore = true
    ctx.body = {
        'version': process.env.VERSION
    }
});

// api/makers
router.get('/makers', async (ctx, next) => {
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"

    try {
        let makers = await models.getMakers();
        ctx.body = makers
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/makers
router.get('/makersprice', async (ctx, next) => {
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"

    try {
        let makers = await models.getMakerTotals(makers);
        console.log(makers)
        ctx.body = makers
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/maker
router.get('/maker', async (ctx, next) => {
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"
    /* #swagger.responses[200] = { 
        schema: { $ref: "#/definitions/Maker" },
        description: 'A Maker!' 
    } */
    try {
        let maker = await models.getMaker()
        ctx.body = maker[0]
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/id/:id
router.get('/maker/id/:id', async (ctx, next) => {
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"
    // #swagger.parameters['id'] = { description: 'Maker\'s ID' }
    /* #swagger.responses[200] = { 
        schema: { $ref: "#/definitions/Maker" },
        description: 'A Maker!' 
    } */
    try {
        let maker = await models.getMakerById(ctx.params.id);
        if (maker) {
            ctx.body = maker[0]
            ctx.status = 200
        } else {
            throw err;
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 422
    }

});

// api/name/:name
router.get('/maker/name/:name', async (ctx, next) => {
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"
    // #swagger.parameters['name'] = { description: 'Maker\'s short-name' }
    /* #swagger.responses[200] = { 
        schema: { $ref: "#/definitions/Maker" },
        description: 'A Maker!' 
    } */
    try {

        let maker = await models.getMakerByName(ctx.params.name);
        if (maker) {
            ctx.body = maker[0]
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
    // #swagger.tags = ["Makers"]
    // #swagger.description = "Maker endpoints"
    /* #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/MakerAdd" },
        description: 'A Maker!' 
    } */
    try {
        let name = ctx.request.body.name;
        let displayName = ctx.request.body.displayName;
        let archivist = ctx.request.body.archivist;
        let instagram = ctx.request.body.instagram;
        conn = await db.getConnection();
        if ((name) && (displayName) && (instagram)) {
            let makerId = await conn.query(`INSERT INTO keyboard.makers (name, display_name, instagram, archivist_name) VALUES ('${name}', ${conn.escape(displayName)}, '${instagram}', '${archivist}');`)
            if (makerId) {
                ctx.body = {
                    'status': "OK",
                    'makerId': makerId.insertId
                }
                ctx.status = 201

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
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    try {
        let vendors = await models.getVendors();
        ctx.body = vendors
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/makers
router.get('/vendorsprice', async (ctx, next) => {
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    try {
        let vendors = await models.getVendorTotals();
        ctx.body = vendors
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});
// api/vendor
router.get('/vendor', async (ctx, next) => {
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    try {
        let vendor = await models.getVendor();
        ctx.body = vendor
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/vendor/id/:id
router.get('/vendor/id/:id', async (ctx, next) => {
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    // #swagger.parameters['id'] = { description: 'Vendor\'s ID' }

    try {
        let vendor = await models.getVendorById(ctx.params.id);
        return ctx.body = vendor

    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    }
});

// api/vendor/name/:name
router.get('/vendor/name/:name', async (ctx, next) => {
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    // #swagger.parameters['name'] = { description: 'Vendor\'s short-name' }

    try {
        let vendor = await models.getVendorByName(ctx.params.name);
        return ctx.body = vendor

    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    }
});

router.post('/vendor', async (ctx, next) => {
    // #swagger.tags = ["Vendors"]
    // #swagger.description = "Vendor endpoints"
    console.log(ctx.request.body)
    try {
        let name = ctx.request.body.name;
        let displayName = ctx.request.body.displayName;
        let link = ctx.request.body.site;
        conn = await db.getConnection();
        if ((name) && (displayName)) {
            let vendorId = await conn.query(`INSERT INTO keyboard.vendors (name, display_name, link) VALUES ('${name}', ${conn.escape(displayName)}, '${link}');`)
            if (vendorId) {
                console.log(vendorId)
                ctx.body = {
                    'status': "OK",
                    'vendorId': vendorId.insertId
                }
                ctx.status = 201

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
    // #swagger.tags = ["Categories"]
    // #swagger.description = "Category endpoints"
    try {
        let categories = await models.getCategories();
        console.log(categories)
        ctx.body = categories
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/saletypes
router.get('/saletypes', async (ctx, next) => {
    // #swagger.tags = ["Sales"]
    // #swagger.description = "Sale endpoints"
    try {
        let saleTypes = await models.getSaleTypes();
        ctx.body = saleTypes
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/purchases
router.get('/purchases', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    try {

        let purchases = await models.getPurchases()
        ctx.body = purchases
        ctx.status = 200
    } catch (err) {
        console.log(err)
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    }
});

// api/purchase
router.get('/purchase', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
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
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    // #swagger.parameters['id'] = { description: 'Purchase ID' }

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

// api/orderset/:id
router.get('/orderset/:id', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    // #swagger.parameters['id'] = { description: 'OrderSet ID' }

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
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
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
        // let purchaseId = await models.insertPurchase(category, detail, set, maker, vendor, price, adjustments, saletype, 0, purchaseDate, expectedDate, orderSet);
        console.log(`INSERT INTO keyboard.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, '${detail}', '${set}', ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, 0, '${purchaseDate}', '${expectedDate}', ${orderSet});`)
        // ctx.body = {
        // 'status': "OK",
        // 'purchaseId': purchaseId.insertId
        // }
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

// api/mass-purchase
router.post('/mass-purchase', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    try {
        purchases = ctx.request.body
        for (i in purchases) {
            let purchase = purchases[i]
            let category = await models.getCategoryIdByDisplayName(purchase.category)
            console.log(category)
            let detail = purchase.detail
            let entity = purchase.entity
            let maker = await models.getMakerIdByDisplayName(purchase.maker)
            let vendor = await models.getVendorIdByDisplayName(purchase.vendor)
            let price = purchase.price
            let adjustments = purchase.adjustments
            let saletype = await models.getSaleTypeIdByName(purchase.saleType)
            let purchaseDate = purchase.purchaseDate
            let receivedDate = purchase.receivedDate
            let orderSet = purchase.orderSet
            let purchaseId = await models.insertPurchase(category, detail, entity, maker, vendor, price, adjustments, saletype, 0, purchaseDate, receivedDate, orderSet);
            // console.log(`INSERT INTO keyboard.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, '${detail}', '${entity}', ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, 0, '${purchaseDate}', '${receivedDate}', ${orderSet});`)
            ctx.body = {
                'status': "OK",
                'purchaseId': purchaseId.insertId
            }
        }
        ctx.status = 201
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
        // if (conn) return conn.release()
    }
});

// api/receiveToggle/:id
router.get('/receiveToggle/:id', async (ctx, next) => {

    try {

        let received = await models.toggleReceivedStatus(ctx.params.id)

        ctx.body = {
            status: 'OK',
            purchaseId: ctx.params.id,
            message: received
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    }
});

// api/update/:field
router.post('/update/:field', async (ctx, next) => {
    try {
        let field = ctx.params.field
        let detail = ctx.request.body.detail
        let id = ctx.request.body.id
        let updateId = await models.updateField(field, detail, id)
        ctx.body = {
            status: 'OK',
            updateId: updateId
        }
        ctx.status = 200
    } catch (e) {
        console.log(e)
        ctx.body = {
            status: 'Failure',
            error: e
        }
        ctx.status = 422

    }
})

// api/graph/artisansByCount
router.get('/graph/artisansByCount', async (ctx, next) => {
    try {
        let artisansByCountData = await models.getArtisansByCount()
        headers = []
        for (let x in artisansByCountData) {
            if (!headers.includes(artisansByCountData[x].entity)) {
                headers.push(artisansByCountData[x].entity)
            }
        }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: artisansByCountData,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/makerByCount
router.get('/graph/makerByCount', async (ctx, next) => {
    try {
        let makerByCountData = await models.getMakerByCount()
        headers = []
        for (let x in makerByCountData) {
            if (!headers.includes(makerByCountData[x].display_name)) {
                headers.push(makerByCountData[x].display_name)
            }
        }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: makerByCountData,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});


// api/graph/artisansByPrice
router.get('/graph/artisansByPrice', async (ctx, next) => {
    try {
        let artisansByPriceData = await models.getArtisansByPrice()
        headers = []
        for (let x in artisansByPriceData) {
            if (!headers.includes(artisansByPriceData[x].entity)) {
                headers.push(artisansByPriceData[x].entity)
            }
        }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: artisansByPriceData,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/makerByPrice
router.get('/graph/makerByPrice', async (ctx, next) => {
    try {
        let makerByPriceData = await models.getMakerByPrice()
        headers = []
        for (let x in makerByPriceData) {
            if (!headers.includes(makerByPriceData[x].display_name)) {
                headers.push(makerByPriceData[x].display_name)
            }
        }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: makerByPriceData,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});


module.exports = router;