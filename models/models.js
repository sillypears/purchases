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
    getCategories: async () => {
        conn = await db.getConnection();
        let categories = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.categories ORDER BY display_name ASC;`)
        if (conn) conn.release()
        return categories
    },
    getSaleTypes: async () => {
        conn = await db.getConnection();
        let saleTypes = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.sale_types;`)
        if (conn) conn.release()
        return saleTypes
    },
    getPurchases: async () => {
        conn = await db.getConnection();
        let purchases = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases ORDER BY purchaseDate DESC`)
        if (conn) conn.release()
        return purchases
    },
    getLatestSet: async () => {
        conn = await db.getConnection();
        let maxSet = await conn.query(`SELECT MAX(orderSet) as latest FROM ${process.env.DB_SCHEMA}.purchases;`);
        if (conn) conn.release()
        return maxSet.latest
    },
    insertPurchase: async (category, detail, set, maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet) => {
        conn = await db.getConnection();
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(set)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, '${purchaseDate}', '${expectedDate}', ${orderSet});`)
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
    getMakerTotals: async () => {
        conn = await db.getConnection();
        let makers = await conn.query(`SELECT m.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker GROUP BY m.id ORDER BY m.name ASC`)
        if (conn) conn.release()
        return makers
    },
    getMakerTotal: async (source, makerId) => {
        let sql = ``
        if (source == "id") {
            sql = `SELECT m.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker WHERE m.id = ${makerId} GROUP BY m.id`
        }
        if (source == "name") {
            sql = `SELECT m.*,coalesce(SUM(p.price + p.adjustments), 0) as total FROM ${process.env.DB_SCHEMA}.makers m LEFT JOIN ${process.env.DB_SCHEMA}.purchases p ON m.id = p.maker WHERE m.name = ${makerId} GROUP BY m.id `
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
            sql = `SELECT p.*,(p.price + p.adjustments) as total FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE m.id = ${id}`
        }
        if (source == "name") {
            sql = `SELECT p.*,(p.price + p.adjustments) FROM ${process.env.DB_SCHEMA}.purchases p LEFT JOIN ${process.env.DB_SCHEMA}.makers m ON m.id = p.maker WHERE m.name = ${id} `
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
    }
}