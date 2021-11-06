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
        return vendor
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
        return makers
    },
    getMakerByName: async (name) => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.makers WHERE name = '${name}';`)
        if (conn) conn.release()
        return makers
    },
    getMakerByName: async (name) => {
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
    getPurchase: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id, c.display_name as category, p.detail, p.entity, p.entity_display as sculpt, m.display_name as maker, m.archivist_name as archivist, v.display_name as vendor, p.price,p.adjustments, s.display_name as saleType, p.received, p.purchaseDate, p.isSold as isSold, p.willSell as willSell, p.image FROM keyboard.purchases p LEFT JOIN keyboard.categories c ON c.id = p.category LEFT JOIN keyboard.makers m ON m.id = p.maker JOIN keyboard.vendors v ON v.id = p.vendor LEFT JOIN keyboard.sale_types s ON s.id = p.saleType WHERE p.id = ${id}`)
        if (conn) conn.release()
        return purchase[0]
    },
    getNextPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM keyboard.purchases p WHERE p.id > ${id} ORDER BY p.purchaseDate ASC LIMIT 1`)
        if (conn) conn.release()
        return purchase[0]
    },
    getPrevPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM keyboard.purchases p WHERE p.id < ${id} ORDER BY p.purchaseDate DESC LIMIT 1`)
        if (conn) conn.release()
        return purchase[0]
    },
    getLatestSet: async () => {
        conn = await db.getConnection();
        let maxSet = await conn.query(`SELECT MAX(orderSet) as latest FROM ${process.env.DB_SCHEMA}.purchases;`);
        if (conn) conn.release()
        return maxSet[0].latest+1
    },
    insertPurchase: async (category, detail, archivist, sculpt , maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet, image) => {
        conn = await db.getConnection();
        console.log(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, entity_display, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(archivist)}, ${conn.escape(sculpt)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, FROM_UNIXTIME(${new Date(purchaseDate).getTime() / 1000}+86400), FROM_UNIXTIME(${new Date(expectedDate).getTime() / 1000}+86400), ${orderSet});`)
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, entity_display, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(archivist)}, ${conn.escape(sculpt)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, FROM_UNIXTIME(${new Date(purchaseDate).getTime() / 1000}+86400), FROM_UNIXTIME(${new Date(expectedDate).getTime() / 1000}+86400), ${orderSet});`)
        if (conn) conn.release()
        return purchaseId
    },
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
        let vendorId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.vendors (name, display_name, link) VALUES (${conn.escape(name)}, ${conn.escape(display_name)}, '${website}');`)
        if (conn) conn.release()
        console.log(vendorId)
        return vendorId
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
            sql = `SELECT m.*,coalesce(SUM(p.price), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker WHERE m.name = ${makerId} GROUP BY m.id ORDER BY p.purchaseDate DESC`
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
            sql = `SELECT p.*,m.archivist_name as archivist, m.instagram as instagram FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE m.name = ${id} ORDER BY p.purchaseDate DESC`
        }
        conn = await db.getConnection();
        let purchases = await conn.query(sql)
        if (conn) conn.release()
        console.log(sql)
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
        console.log(sql)
        return purchases
    },
    toggleReceivedStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT received FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedReceived = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET received = ${r[0].received ==  0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].received ==  0 ? 1 : 0

    },
    toggleSellStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT willSell FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedSell = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET willSell = ${r[0].willSell ==  0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].willSell ==  0 ? 1 : 0

    },
    toggleSoldStatus: async (id) => {
        conn = await db.getConnection();
        let r = await conn.query(`SELECT isSold FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id}`)
        let updatedSold = await conn.query(`UPDATE ${process.env.DB_SCHEMA}.purchases SET isSold = ${r[0].isSold ==  0 ? 1 : 0} WHERE id = ${id}`)
        if (conn) conn.release()
        return r[0].isSold ==  0 ? 1 : 0

    },
    getArtisansByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT p.entity as name, count(p.entity) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category WHERE c.name = 'artisan' GROUP BY p.entity ORDER BY count(p.entity) DESC	`)
        if (conn) conn.release()
        return data
    },
    getMakerByCount: async () => {
        conn = await db.getConnection();
        let data = await conn.query(`SELECT m.display_name as name, count(m.display_name) as y FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.categories c ON c.id = p.category LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE c.name = 'artisan' GROUP BY m.display_name ORDER BY count(m.display_name) DESC`)
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
}
