const env = process.env.NODE_ENV || "dev"
require('dotenv').config({ path: `../.env.${env}` })
const { async } = require('regenerator-runtime');
const fs = require('fs');
const db = require('../db');

module.exports = {
    getVendors: async () => {
        conn = await db.getConnection();
        let vendors = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors ORDER BY display_name ASC;`)
        if (conn) conn.release()
        return vendors
    },
    getVendor: async () => {
        conn = await db.getConnection();
        let vendor = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors ORDER BY id DESC LIMIT 1;`)
        if (conn) conn.release()
        return vendor
    },
    getVendorById: async (id) => {
        conn = await db.getConnection();
        let vendor = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors WHERE id = ${id};`)
        if (conn) conn.release()
        return vendor[0]
    },
    getVendorByName: async (name) => {
        conn = await db.getConnection();
        let vendor = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors WHERE name = '${name}';`)
        if (conn) conn.release()
        return vendor
    },
    getVendorIdByDisplayName: async (name) => {
        conn = await db.getConnection();
        let vendor = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors WHERE display_name = '${name}';`)
        if (conn) conn.release()
        return vendor[0].id
    },
    getMakers: async () => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers ORDER BY display_name ASC;`)
        if (conn) conn.release()
        return makers
    },
    getMaker: async () => {
        conn = await db.getConnection();
        let maker = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers ORDER BY id DESC LIMIT 1;`)
        if (conn) conn.release()
        return maker
    },
    getMakerById: async (id) => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers WHERE id = ${id};`)
        if (conn) conn.release()
        return makers[0]
    },
    getMakerByName: async (name) => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers WHERE name = '${name}';`)
        if (conn) conn.release()
        return makers
    },
    getMakerSculptsByName: async (name) => {
        conn = await db.getConnection();
        let maker = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE maker_name = '${name}';`)
        if (conn) conn.release()
        return maker
    },
    getMakerMoneyByName: async (name) => {
        conn = await db.getConnection();
        let maker = await conn.query(`SELECT m.id, SUM(p.price) FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON p.maker = m.id WHERE name = '${name}';`)
        if (conn) conn.release()
        return maker
    },
    getMakerIdByDisplayName: async (name) => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers WHERE display_name = '${name}';`)
        if (conn) conn.release()
        return makers[0].id
    },
    getCategories: async () => {
        conn = await db.getConnection();
        let categories = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.categories ORDER BY display_name ASC;`)
        if (conn) conn.release()
        return categories
    },
    getCategoryIdByDisplayName: async (name) => {
        conn = await db.getConnection();
        let categories = await conn.query(`SELECT id FROM ${process.env.DB_SCHEMA}.categories WHERE display_name = '${name}';`)
        if (conn) conn.release()
        return categories[0].id
    },
    getSaleTypes: async () => {
        conn = await db.getConnection();
        let saleTypes = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.sale_types;`)
        if (conn) conn.release()
        return saleTypes
    },
    getSaleTypeIdByName: async (name) => {
        conn = await db.getConnection();
        let saleTypes = await conn.query(`SELECT id FROM ${process.env.DB_SCHEMA}.sale_types WHERE name = '${name}';`)
        if (conn) conn.release()
        return saleTypes[0].id
    },
    getPurchases: async () => {
        conn = await db.getConnection();
        let purchases = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases ORDER BY purchaseDate DESC`)
        if (conn) conn.release()
        return purchases
    },
    getPurchasesThatAreMissing: async () => {
        conn = await db.getConnection();
        let purchases = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE received = 0 ORDER BY purchaseDate DESC`)
        if (conn) conn.release()
        return purchases
    },
    getPurchasesIStillHave: async () => {
        conn = await db.getConnection();
        let purchases = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE received = 1 AND isSold = 0 ORDER BY purchaseDate DESC`)
        if (conn) conn.release()
        return purchases
    },
    getPurchase: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT * FROM keyboard.all_purchases p WHERE p.id = ${id}`)
        if (conn) conn.release()
        return purchase[0]
    },
    getNextPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM keyboard.all_purchases p WHERE p.id > ${id} ORDER BY p.purchaseDate ASC LIMIT 1`)
        if (conn) conn.release()
        return purchase[0]
    },
    getPrevPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM keyboard.all_purchases p WHERE p.id < ${id} ORDER BY p.purchaseDate DESC LIMIT 1`)
        if (conn) conn.release()
        return purchase[0]
    },
    getLatestId: async () => {
        conn = await db.getConnection()
        let maxId = await conn.query(`SELECT MAX(id) as latest FROM ${process.env.DB_SCHEMA}.all_purchases`)
        if (conn) conn.release()
        return maxId[0].latest
    },
    getLatestSet: async () => {
        conn = await db.getConnection();
        let maxSet = await conn.query(`SELECT MAX(orderSet) as latest FROM ${process.env.DB_SCHEMA}.all_purchases;`);
        if (conn) conn.release()
        return maxSet[0].latest
    },
    getOrderSet: async (id) => {
        conn = await db.getConnection()
        let orderSet = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE orderSet = ${id}`)
        if (conn) conn.release()
        return orderSet
    },
    insertPurchase: async (category, detail, archivist, sculpt, ka_id, maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet, image) => {
        conn = await db.getConnection();
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, entity_display, ka_id, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(archivist)}, ${conn.escape(sculpt)}, ${conn.escape(ka_id)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, FROM_UNIXTIME(${new Date(purchaseDate).getTime() / 1000}+86400), FROM_UNIXTIME(${new Date(expectedDate).getTime() / 1000}+86400), ${orderSet});`)
        if (conn) conn.release()
        return purchaseId
    },
    // insertPurchase: async (id, body) => {
    //     // let purchaseId, category, detail, archivist, sculpt , maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet, image
    //     console.log(body)
    //     conn = await db.getConnection();
    //     let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, entity_display, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(archivist)}, ${conn.escape(sculpt)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, FROM_UNIXTIME(${new Date(purchaseDate).getTime() / 1000}+86400), FROM_UNIXTIME(${new Date(expectedDate).getTime() / 1000}+86400), ${orderSet});`)
    //     if (conn) conn.release()
    //     return purchaseId
    // },
    insertPurchaseImage: async (category, detail, set, maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet, image) => {
        let imgData = Buffer.from(image.buffer, 'binary')
        conn = await db.getConnection();
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet, image) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(set)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, '${purchaseDate}', '${expectedDate}', ${orderSet}, ${image.buffer});`)
        if (conn) conn.release();
        return purchaseId
    },
    insertMaker: async (name, display_name, ka_name, ka_id, ig) => {
        conn = await db.getConnection();
        let makerId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.makers (name, display_name, instagram, archivist_name, archivist_id) VALUES ('${name}', ${conn.escape(display_name)}, '${ig}', '${ka_name}', '${ka_id}');`)
        if (conn) conn.release()
        console.log(makerId)
        return makerId

    },
    insertVendor: async (name, display_name, website) => {
        conn = await db.getConnection();
        let vendorId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.vendors (name, display_name, link) VALUES (${conn.escape(name)}, ${conn.escape(display_name)}, '${website}') ON DUPLICATE KEY UPDATE name=${conn.escape(name)}, display_name=${conn.escape(display_name)};`)
        if (conn) conn.release()
        return vendorId.insertId
    },
    updateField: async (field, detail, id) => {
        conn = await db.getConnection();
        let updateId = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases set ${field}='${detail}' WHERE id=${id}`);
        if (conn) conn.release();
        return updateId
    },
    getMakerTotals: async () => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT m.*,coalesce(SUM(p.price), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker GROUP BY m.id ORDER BY m.name ASC`)
        if (conn) conn.release()
        return makers
    },
    getMakerTotal: async (source, makerId) => {
        let sql = ``
        if (source == "id") {
            sql = `SELECT m.*,coalesce(SUM(p.price), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker WHERE m.id = ${makerId} GROUP BY m.id ORDER BY p.purchaseDate DESC`
        }
        if (source == "name") {
            sql = `SELECT m.*,coalesce(SUM(p.price), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p  ON m.id = p.maker WHERE m.name = '${makerId}' GROUP BY m.id ORDER BY p.purchaseDate DESC`
        }
        conn = await db.getConnection();
        let maker = await conn.query(sql)
        if (conn) conn.release()
        return maker[0]
    },
    getVendorTotals: async () => {
        conn = await db.getConnection();
        let vendors = await conn.query(`SELECT v.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.vendors v LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON v.id = p.vendor GROUP BY v.id ORDER BY v.name ASC`)
        if (conn) conn.release()
        return vendors
    },
    getVendorTotal: async (source, vendorId) => {
        let sql = ``
        if (source == "id") {
            sql = `SELECT v.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.vendors v LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON v.id = p.vendor WHERE v.id = ${vendorId} GROUP BY v.id`
        }
        if (source == "name") {
            sql = `SELECT v.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.vendors v LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON v.id = p.vendor WHERE v.name = ${vendorId} GROUP BY v.id `
        }
        conn = await db.getConnection();
        let maker = await conn.query(sql)
        if (conn) conn.release()
        return maker[0]
    },
    getMakerPurchases: async (source, id) => {
        let sql = ``

        if (source == "id") {
            sql = `SELECT p.*,m.archivist_name as archivist, m.instagram as instagram FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE m.id = ${id} ORDER BY p.purchaseDate DESC`
        }
        if (source == "name") {
            sql = `SELECT p.*,m.archivist_name as archivist, m.instagram as instagram FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE m.name = '${id}' ORDER BY p.purchaseDate DESC`
        }
        conn = await db.getConnection();
        let purchases = await conn.query(sql)
        if (conn) conn.release()
        return purchases
    },
    getVendorPurchases: async (source, id) => {
        let sql = ``

        if (source == "id") {
            sql = `SELECT p.*,(p.price + p.adjustments) as total FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.vendors v ON v.id = p.vendor WHERE v.id = ${id}`
        }
        if (source == "name") {
            sql = `SELECT p.*,(p.price + p.adjustments) FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.vendors m ON v.id = p.vendor WHERE v.name = ${id} `
        }
        conn = await db.getConnection();
        let purchases = await conn.query(sql)
        if (conn) conn.release()
        return purchases
    },
    updatePurchaseById: async (id, data) => {
        let update = false
        let updateId = {}
        updateId['insertId'] = -1
        conn = await db.getConnection()
        const purchdata = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id};`)
        const purch = purchdata[0]
        if (purch.category !== data.category) { update = true }
        if (purch.detail !== data.detail) { update = true }
        if (purch.entity !== data.archivist) { update = true }
        if (purch.entity_display !== data.set) { update = true }
        if (purch.ka_id !== data.set) { update = true }
        if (purch.maker !== data.maker) { update = true }
        if (purch.vendor !== data.vendor) { update = true }
        if (purch.price !== data.price) { update = true }
        if (purch.adjustments !== data.adjustments) { update = true }
        if (purch.saleType !== data.saletype) { update = true }
        if (purch.purchaseDate !== data.purchaseDate) { update = true }
        if (purch.expectedDate !== data.expectedDate) { update = true }
        if (purch.soldDate !== data.soldDate) { update = true }
        if (purch.salePrice !== data.salePrice) { update = true }
        if (purch.orderSet !== data.orderSet) { update = true }
        if (purch.image !== data.image) { update = true }
        if (purch.notes !== data.notes) { update = true }
        if (update) {
            updateId = await conn.query(`
             UPDATE ${process.env.DB_SCHEMA}.purchases SET 
             category=${data.category},
             detail='${data.detail}',
             entity='${data.archivist}',
             entity_display='${data.set}',
             ka_id='${data.ka_id}',
             maker=${data.maker},
             vendor=${data.vendor},
             price=${data.price},
             adjustments=${data.adjustments},
             saleType=${data.saletype},
             purchaseDate='${data.purchaseDate}',
             receivedDate='${data.expectedDate}',
             soldDate='${data.soldDate}',
             salePrice=${data.salePrice},
             orderSet=${data.orderSet},
             image='${data.image}',
             notes='${data.notes}'
             WHERE id=${id}`)
        }
        if (conn) conn.release()
        return updateId
    },
    updateMakerById: async (id, data) => {
        let update = false
        let updateId = {}
        updateId['insertId'] = -1
        conn = await db.getConnection()
        const makerdata = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers WHERE id = ${id};`)
        const maker = makerdata[0]
        if (maker.name !== data.name) { update = true }
        if (maker.display_name !== data.displayName) { update = true }
        if (maker.instagram !== data.instagram) { update = true }
        if (maker.archivist_name !== data.ka_name) { update = true }
        if (maker.archivist_id !== data.ka_id) { update = true }
        if (update) {
            updateId = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.makers SET name='${data.name}', display_name='${data.displayName}', archivist_name='${data.ka_name}', archivist_id='${data.ka_id}', instagram='${data.instagram}' WHERE id=${id}`)
        }
        if (conn) conn.release()
        return updateId
    },
    updateVendorById: async (id, data) => {
        let update = false
        let updateId = {}
        updateId['insertId'] = -1
        conn = await db.getConnection()
        const vendordata = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.vendors WHERE id = ${id};`)
        const vendor = vendordata[0]
        if (vendor.name !== data.name) { update = true }
        if (vendor.display_name !== data.displayName) { update = true }
        if (vendor.link !== data.site) { update = true }
        if (update) {
            updateId = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.vendors SET name='${data.name}', display_name='${data.displayName}', link='${data.site}' WHERE id=${id}`)
        }
        if (conn) conn.release()
        return updateId
    },
    toggleReceivedStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT received FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedReceived = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET received = ${r[0].received == 0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].received == 0 ? 1 : 0

    },
    toggleSellStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT willSell FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedSell = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET willSell = ${r[0].willSell == 0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].willSell == 0 ? 1 : 0

    },
    toggleSoldStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT isSold FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedSold = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET isSold = ${r[0].isSold == 0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].isSold == 0 ? 1 : 0

    },
    getArtisansByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT p.entity as name, count(p.entity) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category WHERE c.name = 'artisan' GROUP BY p.entity ORDER BY count(p.entity) DESC	`)
        if (conn) conn.release()
        return data
    },
    getHaveArtisansByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT p.entity as name, count(p.entity) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category WHERE c.name = 'artisan' AND p.isSold = 0 GROUP BY p.entity ORDER BY count(p.entity) DESC	`)
        if (conn) conn.release()
        return data
    },
    getMakerByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT m.display_name as name, count(m.display_name) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE c.name = 'artisan' GROUP BY m.display_name ORDER BY count(m.display_name) DESC`)
        if (conn) conn.release()
        return data
    },
    getMakerHaveByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT m.display_name as name, count(m.display_name) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE c.name = 'artisan' AND p.isSold = 0 GROUP BY m.display_name ORDER BY count(m.display_name) DESC`)
        if (conn) conn.release()
        return data
    },
    getArtisansByPrice: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT p.entity as name, sum(p.price) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category WHERE c.name = 'artisan' GROUP BY p.entity ORDER BY total DESC`)
        if (conn) conn.release()
        return data
    },
    getMakerByPrice: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT m.display_name as name, sum(p.price+p.adjustments) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE c.name = 'artisan' GROUP BY m.display_name ORDER BY count(m.display_name) DESC`)
        if (conn) conn.release()
        return data
    },
    getPricingTable: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT MAX(price) as max_price, MIN(price) as min_price, AVG(price) as avg_price FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 AND price > 0;`)
        if (conn) conn.release()
        return data
    },
    getTopSculpts: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT sculpt, count(sculpt) as total FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 GROUP BY sculpt ORDER BY total DESC LIMIT 5;`)
        if (conn) conn.release()
        return data
    },
    getTotalSculpts: async () => {
        conn = await db.getConnection()
        let sculptCount = await conn.query(`SELECT COUNT(DISTINCT(sculpt)) as count FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 ORDER BY count DESC;`)
        let sculptData = await conn.query(`SELECT DISTINCT(p.sculpt) as name FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.isSold = 0 ORDER BY p.sculpt DESC`)
        let sculpts = []
        for (sculpt of sculptData) {
            sculpts.push(sculpt.name)
        }
        if (conn) conn.release()

        return { 'count': sculptCount[0], 'sculpts': sculpts.sort() }
    },
    getTotalSculptsWithPicture: async () => {
        conn = await db.getConnection()
        let sculptCount = await conn.query(`SELECT COUNT(DISTINCT(sculpt)) as count FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 ORDER BY count DESC;`)
        let sculptData = await conn.query(`SELECT DISTINCT(p.sculpt) as name FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.isSold = 0 ORDER BY p.sculpt DESC`)
        let sculpts = {}
        for (sculpt of sculptData) {
            sculpts[sculpt.name] = {
                'name': sculpt.name,
                'img': ""
            }
        }
        if (conn) conn.release()

        return { 'count': sculptCount[0], 'sculpts': sculpts }
    },
    getTopMakers: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT maker_name, count(maker_name) as total FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 GROUP BY maker_name ORDER BY total DESC LIMIT 5;`)
        if (conn) conn.release()
        return data
    },
    getTotalMakers: async () => {
        conn = await db.getConnection()
        let makerCount = await conn.query(`SELECT COUNT(DISTINCT(maker_name)) as count FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0  ORDER BY count DESC; `)
        let makerData = await conn.query(`SELECT DISTINCT(p.maker_name) as name FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.isSold = 0 ORDER BY p.maker_name DESC`)
        let makers = []
        for (maker of makerData) {
            makers.push(maker.name)
        }
        if (conn) conn.release()

        return { 'count': makerCount[0], 'sculpts': makers.sort() }
    },
    getAllForSale: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE willSell = 1 AND isSold = 0 ORDER BY id DESC;`)
        if (conn) conn.release()
        return data
    },
    getAllNotForSale: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE willSell = 0 AND isSold = 0 ORDER BY id DESC;`)
        if (conn) conn.release()
        return data
    },
    getSaleTypeWins: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT p.sale_type as name, count(p.sale_type) as y FROM ${process.env.DB_SCHEMA}.all_purchases p GROUP BY p.sale_type ORDER BY y DESC`)
        if (conn) conn.release()
        return data
    }
}

// Pricing table
// SELECT MAX(price) as max_price, MIN(price) as min_price, AVG(price) as avg_price FROM keyboard.all_purchases WHERE isSold = 0 AND price > 0;

// Top 5 sculpts
// SELECT sculpt, count(sculpt) as total FROM keyboard.all_purchases WHERE isSold = 0 GROUP BY sculpt ORDER BY total DESC LIMIT 5;

// Top 5 makers
// SELECT maker_name, count(maker_name) as total FROM keyboard.all_purchases WHERE isSold = 0 GROUP BY maker_name ORDER BY total DESC LIMIT 5;

// Total Sculpts
// SELECT sculpt, COUNT(sculpt) as count FROM keyboard.all_purchases WHERE isSold = 0 GROUP BY sculpt;

// Total Makers
// SELECT maker_name, COUNT(maker_name) as count FROM keyboard.all_purchases WHERE isSold = 0 GROUP BY maker_name;

// Total Sculpt Per Maker

// Sale wins by type

// SELECT p.name, count(p.name) FROM keyboard.all_purchases p GROUP BY p.name
// SELECT p.name, count(p.name) FROM keyboard.all_purchases p WHERE isSold = 0 GROUP BY p.name