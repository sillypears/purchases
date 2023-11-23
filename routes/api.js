const env = process.env.NODE_ENV || "dev"
require('dotenv').config({ path: `../.env.${env}` })
const Router = require('koa-router');
const fs = require('fs')
const util = require('util')
const { spawn } = require('child_process')
const exec = util.promisify(require('child_process').exec);

const events = require('events');
const myEmitter = new events.EventEmitter();

const db = require('../db');
const models = require('../models/models');
const { version } = require('os');

var router = new Router({
    prefix: '/api'
});

/**
* @openapi
* components:
*   schemas:
*     ErrorMsg:
*       type: object
*       properties:
*         status:
*           type: string
*         error:
*           type: object
*
*     Maker:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*         instagram:
*           type: string
*         archivist_name:
*           type: string
*         archivist_id:
*           type: string
*         shipping_city:
*           type: string
*         shipping_state:
*           type: string
*         shipping_country:
*           type: string
*     MakerMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/Maker"
*
*     MakerPrice:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*         instagram:
*           type: string
*         archivist_name:
*           type: string
*         archivist_id:
*           type: string
*         shipping_city:
*           type: string
*         shipping_state:
*           type: string
*         shipping_country:
*           type: string
*         total:
*           type: integer
*     MakerPriceMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/MakerPrice"
*
*     MakerTotalPrice:
*       type: object
*       properties:
*         id:
*           type: integer
*         total:
*           type: integer
*
*     SculptCount:
*       type: object
*       properties:
*         sculpt:
*           type: string
*         count:
*           type: integer
*     SculptCountMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/SculptCount"
*
*     Vendor:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*         link:
*           type: string
*     VendorMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/Vendor"
*
*     Purchase:
*       type: object
*       properties:
*         id:
*           type: integer
*         category_id:
*           type: integer
*         category_name:
*           type: string
*         detail:
*           type: string
*         entity:
*           type: string
*         sculpt:
*           type: string
*         sculpt_id:
*           type: integer
*         sculpt_style:
*           type: integer
*         ka_id:
*           type: string
*         maker_name:
*           type: string
*         maker_id:
*           type: integer
*         instagram:
*           type: string
*         archivist:
*           type: string
*         vendor_name:
*           type: string
*         vendor_id:
*           type: integer
*         link:
*           type: string
*         price:
*           type: integer
*         adjustments:
*           type: integer
*         total:
*           type: integer
*         series_num:
*           type: integer
*         series_total:
*           type: integer
*         sale_id:
*           type: integer
*         sale_type:
*           type: string
*         soldDate:
*           type: string
*         salePrice:
*           type: integer
*         isSold:
*           type: integer
*         willSell:
*           type: integer
*         received:
*           type: integer
*         purchaseDate:
*           type: string
*         receivedDate:
*           type: string
*         orderSet:
*           type: integer
*         notes:
*           type: string
*         image:
*           type: string
*         ig_post:
*           type: integer
*         retail_price:
*           type: integer
*         includeInCount:
*           type: boolean
*         mainColors:
*           type: string
*         tags:
*           type: string
*         stem:
*           type: string
*         keycap_size:
*           type: integer
*         maker_city:
*           type: string
*         maker_state:
*           type: string
*         maker_country:
*           type: string
*     PurchaseMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/Purchase"
*
*     VendorPrice:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*         link:
*           type: string
*         total:
*           type: integer
*     VendorPriceMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/VendorPrice"
*
*     Category:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*     CategoryMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/Category"
*
*     SaleType:
*       type: object
*       properties:
*         id:
*           type: integer
*         name:
*           type: string
*         display_name:
*           type: string
*     SaleTypeMap:
*       type: array
*       items:
*         $ref: "#/components/schemas/SaleType"
*/

 /**
 * @openapi
 * tags:
 *   - name: Base
 *     description: All base API related things
 *   - name: Maker
 *     description: All maker related things
 *   - name: Purchase
 *     description: All purchase related things
 *   - name: Vendor
 *     description: All vendors related things
 *   - name: Graph
 *     description: All vendors related things
 */

// api
/** 
 * @openapi
 * /:
 *   get:
 *     description: Get API version
 *     operationId: getBaseApi
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Returns the current API version
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
*/
router.get('/', async (ctx, next) => {
    ctx.body = {
        'version': process.env.VERSION
    }
});

// api/makers
/**
 * @openapi
 * /makers:
 *   get:
 *     description: Get API version
 *     operationId: getAllMakers
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns Maker objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MakerMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/makers', async (ctx, next) => {
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
/**
 * @openapi
 * /makers/have:
 *   get:
 *     description: Get all Makers that I have
 *     operationId: getAllMakersThatIHave
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns array of Makers that I have
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 type: string 
 *       500:
 *         description: Returns error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/makers/have', async (ctx, next) => {
    try {
        let makers = await models.getMakersThatIHave();
        let haveMakers = []
        makers.forEach((e) => {
            haveMakers.indexOf(e.maker_name) === -1 ? haveMakers.push(e.maker_name) : ""
        })
        ctx.body = haveMakers
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/makersprice
/**
 * @openapi
 * /makersprice:
 *   get:
 *     description: Get PriceTotal for Makers
 *     operationId: getAllMakersPrice
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns MakerPrice objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MakerPriceMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/makersprice', async (ctx, next) => {
    try {
        let makers = await models.getMakerTotals();
        ctx.body = makers
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/maker
/**
 * @openapi
 * /maker:
 *   get:
 *     description: Get the latest Maker 
 *     operationId: getLatestMaker
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns Maker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maker'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/maker', async (ctx, next) => {
    try {
        let maker = await models.getMaker()
        ctx.body = maker[0]
        ctx.status = 200
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 500
    }
});

// api/maker/id/:id
/**
 * @openapi
 * /maker/id/{id}:
 *   get:
 *     description: Get Maker object by ID
 *     operationId: getMakerById
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns Maker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maker'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: id
 *       in: path
 *       example: 1
 *       description: ID of maker to get
 *       required: true
 *       schema:
 *         type: integer
 *
*/
router.get('/maker/id/:id', async (ctx, next) => {
    try {
        let maker = await models.getMakerById(ctx.params.id);
        if (maker) {
            ctx.body = maker
            ctx.status = 200
        } else {
            throw err;
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 422
    }

});

// api/maker/name/:name
/**
 * @openapi
 * /maker/name/{name}:
 *   get:
 *     description: Get Maker  object by Name
 *     operationId: getMakerByName
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns Maker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maker'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: name
 *       in: path
 *       example: 8o8keys
 *       description: ID of maker to get
 *       required: true
 *       schema:
 *         type: string
 *
*/
router.get('/maker/name/:name', async (ctx, next) => {
    try {
        let maker = await models.getMakerByName(ctx.params.name);
        if (maker) {
            ctx.body = maker
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

// api/maker/sculpts/name/:name
/**
 * @openapi
 * /maker/sculpts/name/{name}:
 *   get:
 *     description: Get Maker sculpts object by Name
 *     operationId: getMakerSculptsByName
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns Maker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maker'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: name
 *       in: path
 *       example: 8o8keys
 *       description: ID of maker to get
 *       required: true
 *       schema:
 *         type: string
 *
*/
router.get('/maker/sculpts/name/:name', async (ctx, next) => {
    try {

        let maker = await models.getMakerSculptsByName(ctx.params.name);
        if (maker) {
            ctx.body = maker
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

// api/maker/sculpt/count/:id
/**
 * @openapi
 * /maker/sculpt/count/{id}:
 *   get:
 *     description: Get sculpt counts by maker id
 *     operationId: getSculptCountsByMakerId
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns SculptCount objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SculptCountMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: id
 *       in: path
 *       example: 1
 *       description: ID of maker to get
 *       required: true
 *       schema:
 *         type: integer
 *
*/
router.get('/maker/sculpt/count/:id', async (ctx, next) => {
    try {
        let sculptCount = await models.getSculptCountByMaker(ctx.params.id);
        if (sculptCount) {
            ctx.body = sculptCount
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

// api/maker/name-money/:name
/**
 * @openapi
 * /maker/name-money/{name}:
 *   get:
 *     description: Get total for Maker by Name
 *     operationId: getTotalForMakerByName
 *     tags: [Maker]
 *     responses:
 *       200:
 *         description: Returns object with total
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MakerTotalPrice'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: name
 *       in: path
 *       example: 8o8keys
 *       description: Name of maker to get
 *       required: true
 *       schema:
 *         type: string
 *
*/
router.get('/maker/name-money/:name', async (ctx, next) => {
    try {

        let maker = await models.getMakerMoneyByName(ctx.params.name);
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
/**
 * @openapi
 * /maker:
 *   post:
 *     description: Create new Maker
 *     operationId: createNewMaker
 *     tags: [Maker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Maker'
 *     responses:
 *       204:
 *         description: Created
 *       209:
 *         description: Duplicate Entry
 *       422:
 *         description: Returns error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.post('/maker', async (ctx, next) => {
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
            ctx.body = 'Created'
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
/**
 * @openapi
 * /vendors:
 *   get:
 *     description: Get all vendors
 *     operationId: getAllVendors
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Returns Vendor objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorMap'
 *       500:
 *         description: Returns error
 *
*/
router.get('/vendors', async (ctx, next) => {
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

// api/vednorsprice
/**
 * @openapi
 * /vendorsprice:
 *   get:
 *     description: Get PriceTotal for Vendors
 *     operationId: getAllVendorPrice
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Returns VendorPrice objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorPriceMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/vendorsprice', async (ctx, next) => {
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
/**
* @openapi
* /vendor:
*   get:
*     description: Get latest vendor
*     operationId: getLatestVendor
*     tags: [Vendor]
*     responses:
*       200:
*         description: Returns Vendor object
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Vendor'
*       500:
*         description: Returns error
*
*/
router.get('/vendor', async (ctx, next) => {
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
/**
 * @openapi
 * /vendor/id/{id}:
 *   get:
 *     description: Get Vendor object by ID
 *     operationId: getVendorById
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Returns Vendor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: id
 *       in: path
 *       example: 1
 *       description: ID of vendor to get
 *       required: true
 *       schema:
 *         type: integer
 *
*/
router.get('/vendor/id/:id', async (ctx, next) => {
    try {
        let vendor = await models.getVendorById(ctx.params.id);
        return ctx.body = vendor

    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    }
});

// api/vendor/name/:name
/**
 * @openapi
 * /vendor/name/{name}:
 *   get:
 *     description: Get Vendor object by Name
 *     operationId: getVendorByName
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Returns Vendor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: name
 *       in: path
 *       example: 8o8keys
 *       description: ID of vendor to get
 *       required: true
 *       schema:
 *         type: string
 *
*/
router.get('/vendor/name/:name', async (ctx, next) => {
    try {
        let vendor = await models.getVendorByName(ctx.params.name);
        return ctx.body = vendor

    } catch (err) {
        console.log(err)
        ctx.body = { 'status': 'Failure', 'error': err }
    }
});
// /api/vendor
/**
 * @openapi
 * /vendor:
 *   post:
 *     description: Create new Vendor
 *     operationId: createNewVendor
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       204:
 *         description: Created
 *       209:
 *         description: Duplicate Entry
 *       422:
 *         description: Returns error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.post('/vendor', async (ctx, next) => {
    console.log(ctx.request.body)
    try {
        let name = ctx.request.body.name;
        let displayName = ctx.request.body.displayName;
        let link = ctx.request.body.site;
        if ((name) && (displayName)) {
            let vendorId = await models.insertVendor(name, displayName, link)
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
    }
});

// api/categories
/**
 * @openapi
 * /categories:
 *   get:
 *     description: Get all categories
 *     operationId: getAllCategories
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Returns Categories objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryMap'
 *       500:
 *         description: Returns error
 *
*/
router.get('/categories', async (ctx, next) => {
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
/**
 * @openapi
 * /saletypes:
 *   get:
 *     description: Get all saletypes
 *     operationId: getAllSaleTypes
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Returns SaleType objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleTypeMap'
 *       500:
 *         description: Returns error
 *
*/
router.get('/saletypes', async (ctx, next) => {
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
/**
 * @openapi
 * /purchases:
 *   get:
 *     description: Get all Purchases
 *     operationId: getAllPurchases
 *     tags: [Purchase]
 *     responses:
 *       200:
 *         description: Returns Purchase objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseMap'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/purchases', async (ctx, next) => {
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
/**
 * @openapi
 * /purchase:
 *   get:
 *     description: Get latest Purchases
 *     operationId: getLatestPurchases
 *     tags: [Purchase]
 *     responses:
 *       200:
 *         description: Returns Purchase object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *
*/
router.get('/purchase', async (ctx, next) => {
    try {
        let maxId = await models.getLatestId()
        let purchase = await models.getPurchase(maxId)
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
    }

});
// api/purchase/:id
/**
 * @openapi
 * /purchase/{id}:
 *   get:
 *     description: Get Purchase object by ID
 *     operationId: getPurchaseById
 *     tags: [Purchase]
 *     responses:
 *       200:
 *         description: Returns Purchase object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       500:
 *         description: Returns error
  *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMsg'
 *   parameters:
 *     - name: id
 *       in: path
 *       example: 74
 *       description: ID of purchase to get
 *       required: true
 *       schema:
 *         type: integer
 *
*/
router.get('/purchase/:id', async (ctx, next) => {
    try {
        let purchase = await models.getPurchase(ctx.params.id);
        ctx.body = purchase
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    }
});

// api/maker/purchases/:id/:source?
router.get('/maker/purchases/:id/:source?', async (ctx, next) => {
    let source = ctx.params.source ? ctx.params.source : 'id'
    try {
        let maker = await models.getMakerPurchases(source, ctx.params.id);
        if (maker) {
            ctx.body = maker
            ctx.status = 200
        } else {
            throw err;
        }
    } catch (err) {
        ctx.body = { 'status': 'Failure', 'error': err }
        ctx.status = 422
    }

});

// api/purchase/:id/delete
router.post('/purchase/:id/delete', async (ctx, next) => {
    console.log(ctx.params)
    try {
        let purchase = await models.deletePurchaseById(ctx.params.id);
        ctx.body = purchase
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    }
});

router.get('/willSell', async (ctx, next) => {
    try {
        let sells = await models.getAllForSale()

        ctx.body = {
            status: "ok",
            forSale: sells
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

router.get('/willNotSell', async (ctx, next) => {
    try {
        let sells = await models.getAllNotForSale()

        ctx.body = {
            status: "ok",
            notForSale: sells
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


router.get('/orderset', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    // #swagger.parameters['id'] = { description: 'OrderSet ID' }

    try {
        let orderId = await models.getLatestSet()
        let orders = await models.getOrderSet(orderId)
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
    }
});
// api/orderset/:id
router.get('/orderset/:id', async (ctx, next) => {
    // #swagger.tags = ["Purchases"]
    // #swagger.description = "Purchase endpoints"
    // #swagger.parameters['id'] = { description: 'OrderSet ID' }

    try {
        let orders = await models.getOrderSet(ctx.params.id)
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
    }
});

// api/getTotalSculpts
router.get('/getTotalSculpts', async (ctx, next) => {
    try {
        let sculpts = await models.getTotalSculptsWithPicture()
        console.log(sculpts)
        ctx.body = {
            'status': 'OK',
            'data': sculpts
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
        ctx.status = 400
    }
})

// api/sculpt

// api/sculpt/<name>
router.get('/sculpt/:sculpt', async (ctx, next) => {
    try {
        let sculpts = await models.getSculptByName(ctx.params.sculpt)
        ctx.body = {
            'status': 'OK',
            'data': sculpts
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'FAILURE',
            'error': err
        }
    }

})

// api/graph/topSculpts
router.get('/getRaffleWinsForMaker/:makerId', async (ctx, next) => {
    try {
        let sculptTable = await models.getRaffleWinsForMaker(ctx.params.makerId)
        headers = ['Maker', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: sculptTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
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

// api/sellToggle/:id
router.get('/sellToggle/:id', async (ctx, next) => {

    try {

        let sell = await models.toggleSellStatus(ctx.params.id)

        ctx.body = {
            status: 'OK',
            purchaseId: ctx.params.id,
            message: sell
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

// api/soldToggle/:id
router.get('/soldToggle/:id', async (ctx, next) => {

    try {

        let sold = await models.toggleSoldStatus(ctx.params.id)

        ctx.body = {
            status: 'OK',
            purchaseId: ctx.params.id,
            message: sold
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

// api/search
router.get('/tag/search', async (ctx, next) => {
    try {
        let purchases = await models.getPurchasesByTag(ctx.request.body.searchTag)

        ctx.body = {
            status: 'OK',
            purchases: purchases,
            message: `Found ${purchases.length} purchases`
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

// api/search
router.post('/tag/search', async (ctx, next) => {
    try {
        let purchases = await models.getPurchasesByTag(ctx.request.body.searchTag)

        ctx.body = {
            status: 'OK',
            purchases: purchases,
            message: `Found ${purchases.length} purchases`
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
        let field = ctx.params.field.trim()
        let detail = ctx.request.body.detail.trim()
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
});

router.get('/whatIHave', async (ctx, next) => {
    let data = await models.getUniqueMakerAndSculpt()
    let temp = {}
    data.forEach((item) => {
        if (temp[item['maker']]) {
            temp[item['maker']].push(item['sculpt'])
        }
        else {
            temp[item['maker']] = [item['sculpt']]
        }
    })

    ctx.body = temp
    ctx.status = 200
})

router.get('/spreadsheetOutput', async (ctx, next) => {
    let data = await models.getPurchases()
    let output = ""
    data.forEach((item) => {
        let temp = `${item['category_name']},${item['detail']},${item['entity']},${item['maker_name']},${item['vendor_name']},${item['price']},${item['adjustments']},${item['sale_type']},,,${item['purchaseDate']},${item['orderSet']}`
        output += temp + "\n"
    })

    ctx.body = output
    ctx.status = 200

})
// api/picRefresh
router.get('/picRefresh', async (ctx, next) => {
    var dataToSend;
    // try {
    var py = spawn('/usr/local/bin/python3.9', ['/opt/keyboard-purchases/get_image_url.py'])
    // var py = spawn('ls')
    py.on('close', function (c) {
        dataToSend = c
        if (dataToSend !== 0) {
            ctx.body = { 'status': 'Fail' }
            ctx.status = 500
        }

    })
    ctx.body = { 'status': 'Oke', 'message': "Refreshed all nice like" }
    ctx.status = 200
});

// api/picRefreshStatus
router.get('/picRefreshStatus', async (ctx, next) => {
    var status;
    var statusMessage;
    const {
        err,
        stdout,
        stderr,
    } = await exec('ps -ef | grep get_image_url | grep -v grep| wc -l');
    if (stdout > 0) {
        ctx.body = {
            'message': true
        }
    } else {
        ctx.body = {
            'message': false
        }
        ctx.status = 200
    }

})

// api/graph/artisansByCount
router.get('/graph/artisansByCount', async (ctx, next) => {
    try {
        let artisansByCountData = await models.getArtisansByCount()
        headers = ['Sculpt', 'Count']
        // for (let x in artisansByCountData) {
        //     if (!headers.includes(artisansByCountData[x].entity)) {
        //         headers.push(artisansByCountData[x].entity)
        //     }
        // }
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
// api/graph/artisansIHaveCount
router.get('/graph/artisansIHaveCount', async (ctx, next) => {
    try {
        let artisansIHaveCount = await models.getPurchasesIStillHave()
        headers = ['Total Artisans']
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: artisansIHaveCount,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            status: 'Failure',
            error: err
        }
    }
});

// api/graph/haveArtisansByCount
router.get('/graph/haveArtisansByCount', async (ctx, next) => {
    try {
        let artisansByCountData = await models.getHaveArtisansByCount()
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
        headers = ['Sculpt', 'Count']
        // for (let x in makerByCountData) {
        //     if (!headers.includes(makerByCountData[x].display_name)) {
        //         headers.push(makerByCountData[x].display_name)
        //     }
        // }
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

// api/graph/makerHaveByCount
router.get('/graph/makerHaveByCount', async (ctx, next) => {
    try {
        let makerByCountData = await models.getMakerHaveByCount()
        headers = ['Sculpt', 'Count']
        // for (let x in makerByCountData) {
        //     if (!headers.includes(makerByCountData[x].display_name)) {
        //         headers.push(makerByCountData[x].display_name)
        //     }
        // }
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
        headers = ['Sculpt', 'Price']
        // for (let x in artisansByPriceData) {
        //     if (!headers.includes(artisansByPriceData[x].entity)) {
        //         headers.push(artisansByPriceData[x].entity)
        //     }
        // }
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
        headers = ['Sculpt', 'Price']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
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
// api/graph/avgPriceByMaker/:id
router.get('/graph/avgPriceByMaker/:id', async (ctx, next) => {
    try {
        let avgPriceByMaker = await models.getAvgPriceByMaker(id)
        headers = ['Price', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: avgPriceByMaker,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/getPricingTable
router.get('/graph/getPricingTable', async (ctx, next) => {
    try {
        let pricingTable = await models.getPricingTable()
        headers = ['MAX', 'MIN', 'AVG']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: pricingTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/getAvgYearlyPrice
router.get('/graph/getAvgYearlyPrice', async (ctx, next) => {
    try {
        let pricingTable = await models.getAvgPurchasePriceByYear()
        headers = ['avg_cost', 'year', 'purchase_count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: pricingTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/topSculpts
router.get('/graph/topSculpts', async (ctx, next) => {
    try {
        let sculptTable = await models.getTopSculpts()
        headers = ['Sculpt', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: sculptTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/totalSculpts
router.get('/graph/totalSculpts', async (ctx, next) => {
    try {
        let sculptTotal = await models.getTotalSculpts()
        headers = ['Sculpts', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: sculptTotal,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/topMakers
router.get('/graph/topMakers', async (ctx, next) => {
    try {
        let makerTable = await models.getTopMakers()
        headers = ['Maker', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: makerTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/totalMakers
router.get('/graph/totalMakers', async (ctx, next) => {
    try {
        let makerTotal = await models.getTotalMakers()
        headers = ['Makers', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: makerTotal,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

router.get('/graph/saleTypeWins', async (ctx, next) => {

    try {
        let sales = await models.getSaleTypeWins()
        headers = ['Sale Type', 'Count']
        ctx.body = {
            status: "ok",
            headers: headers,
            data: sales
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

router.get('/graph/monthlyPurchases', async (ctx, next) => {

    try {
        const purches = await models.getMonthlyPurchaseData()
        let purchases = []
        purches.forEach((purch, index) => {
            let temp = {}
            temp.name = toMonthName(purches[index].month)
            temp.y = purches[index].count
            purchases.push(temp)
        })
        headers = ['Month', 'Count']
        ctx.body = {
            status: "ok",
            data: {
                headers: headers,
                purchases: purchases
            }
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

router.get('/graph/monthlyPurchases/:id', async (ctx, next) => {

    try {
        const purches = await models.getMonthlyPurchaseDataByMaker(ctx.params.id)
        let purchases = []
        purches.forEach((purch, index) => {
            let temp = {}
            temp.name = toMonthName(purches[index].month)
            temp.y = purches[index].count
            purchases.push(temp)
        })
        headers = ['Month', 'Count']
        ctx.body = {
            status: "ok",
            data: {
                headers: headers,
                purchases: purchases
            }
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

router.get('/graph/getYearlyWinsByMaker/:maker_id', async (ctx, next) => {
    try {
        const montlyWins = await models.getWinCountByYearByMaker(ctx.params.maker_id)
        const makerName = await models.getMakerById(ctx.params.maker_id)
        let wins = []
        montlyWins.forEach((month, index) => {
            let temp = {}
            temp.name = month.year
            temp.y = month.count
            wins.push(temp)
        })
        const headers = ['Year', 'Count']
        ctx.body = {
            'status': 'OK',
            'data': {
                'maker': makerName,
                'headers': headers,
                'yearly': wins
            }
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

router.get('/graph/getAllMakerCountries', async (ctx, next) => {
    try {
        let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        const c = await models.getAllMakerCountries()
        countries = []
        countriesChart = []
        c.forEach((count, index) => {
            let temp = {}
            let temp2 = {}
            temp.country = count.country
            temp.display = temp.country.toUpperCase()
            temp.fullName = regionNames.of(temp.display)
            temp.count = count.count
            temp2.name = temp.fullName
            temp2.y = temp.count
            countries.push(temp)
            countriesChart.push(temp2)

        })
        const headers = ['Country', 'Count']
        ctx.body = {
            'status': 'OK',
            'data': {
                'countryData': countries,
                'headers': headers
            },
            'data2': countriesChart
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/topSculpts
router.get('/graph/allRaffleWinsByMaker', async (ctx, next) => {
    try {
        let sculptTable = await models.getAllRaffleWinsByMaker()
        headers = ['Maker', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: sculptTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/retailPurchasePricesByYears
router.get('/graph/retailPurchasePricesByYears', async (ctx, next) => {
    try {
        let priceTable = await models.getRetailPurchasePricesByYears()
        headers = ['Year', 'Price', 'Count']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: priceTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/avgPurchasePricesByYears
router.get('/graph/avgPurchasePricesByYears', async (ctx, next) => {
    try {
        let priceTable = await models.getAvgPurchasesByYears()
        headers = ['Year', 'Price']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: priceTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

// api/graph/avgPurchasePricesByYear/:year
router.get('/graph/avgPurchasePricesByYear/:year?', async (ctx, next) => {
    let year = (new Date()).getFullYear()
    if (ctx.params.year) year = ctx.params.year
    try {
        let priceTable = await models.getAvgPurchasesByYear(year)
        headers = ['Year', 'Price']
        // for (let x in makerByPriceData) {
        //     if (!headers.includes(makerByPriceData[x].display_name)) {
        //         headers.push(makerByPriceData[x].display_name)
        //     }
        // }
        ctx.body = {
            status: 'OK',
            headers: headers,
            data: priceTable,
        }
        ctx.status = 200
    } catch (err) {
        ctx.body = {
            'status': 'Failure',
            'error': err
        }
    }
});

function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'long',
    });
}

module.exports = router;