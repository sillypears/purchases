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
        let purchase = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases ap WHERE ap.id = ${id}`)
        if (conn) conn.release()
        return purchase[0]
    },
    getNextPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.id > ${id} ORDER BY p.purchaseDate ASC LIMIT 1`)
        if (conn) conn.release()
        return purchase[0]
    },
    getPrevPurchaseId: async (id) => {
        conn = await db.getConnection();
        let purchase = await conn.query(`SELECT p.id FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.id < ${id} ORDER BY p.purchaseDate DESC LIMIT 1`)
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
    getPurchasesByTag: async (tag) => {
        conn = await db.getConnection()
        let purchases = await conn.query(`SELECT p.* FROM ${process.env.DB_SCHEMA}.tags t LEFT JOIN ${process.env.DB_SCHEMA}.all_purchases p ON t.purchaseid = p.id WHERE tagname = '${tag}' ORDER BY p.id DESC`)
        if (conn) conn.release()
        return purchases
    },
    insertPurchase: async (category, detail, archivist, sculpt, ka_id, maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet, image, tags, ig_post, mainColors) => {
        let newTags = tags.split(',')
        let newColors = mainColors.split(',')
        conn = await db.getConnection();
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, entity_display, ka_id, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet, ig_post) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(archivist)}, ${conn.escape(sculpt)}, ${conn.escape(ka_id)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, FROM_UNIXTIME(${new Date(purchaseDate).getTime() / 1000}+86400), FROM_UNIXTIME(${new Date(expectedDate).getTime() / 1000}+86400), ${orderSet}, ${conn.escape(ig_post)});`)
        console.log(purchaseId)
        newTags.forEach(tag => {
            let tagId = conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.tags (tagname, purchaseId) VALUES ('${tag}', ${purchaseId.insertId})`)
        })
        newColors.forEach(color => {
            let colorId = conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.main_colors (color, purchase_id) VALUES ('${color}', ${purchaseId.insertId})`)
        })
        if (conn) conn.release()
        return purchaseId
    },
    insertPurchaseImage: async (category, detail, set, maker, vendor, price, adjustments, saletype, received, purchaseDate, expectedDate, orderSet) => {
        let imgData = Buffer.from(image.buffer, 'binary')
        conn = await db.getConnection();
        let purchaseId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.purchases (category, detail, entity, maker, vendor, price, adjustments, saleType, received, purchaseDate, receivedDate, orderSet, image) VALUES (${category}, ${conn.escape(detail)}, ${conn.escape(set)}, ${maker}, ${vendor}, ${price}, ${adjustments}, ${saletype}, ${received}, '${purchaseDate}', '${expectedDate}', ${orderSet};`)
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
            sql = `SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases ap WHERE ap.maker_id = ${id} ORDER BY ap.purchaseDate DESC`
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
    getTagsByPurchaseId: async (id) => {
        conn = await db.getConnection();
        let tags = await conn.query(`SELECT tagname FROM ${process.env.DB_SCHEMA}.tags WHERE purchaseid = ${id};`)
        if (conn) conn.release()
        return tags
    },
    getMainColorsByPurchaseId: async (id) => {
        conn = await db.getConnection();
        let mainColors = await conn.query(`SELECT mc.color FROM ${process.env.DB_SCHEMA}.main_colors mc WHERE mc.purchase_id = ${id};`)
        if (conn) conn.release()
        return mainColors
    },
    updatePurchaseById: async (id, data, tags, colors) => {
        let update = false
        let updateId = {}
        let tagnames = []
        let colornames = []
        let newTags = data.tags.split(',')
        const newColors = data.mainColors.split(',')
        updateId['insertId'] = -1
        conn = await db.getConnection()
        const purchdata = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id};`)
        const purch = purchdata[0]
        let sql = `UPDATE ${process.env.DB_SCHEMA}.purchases SET\n`
        if (purch.category !== parseInt(data.category)) { update = true; sql += `category=${data.category},\n` }
        if (purch.detail !== data.detail) { update = true; sql+= `detail=${conn.escape(data.detail)},\n` }
        if (purch.entity !== data.archivist) { update = true; sql+=`entity=${conn.escape(data.archivist)},\n` }
        if (purch.entity_display !== data.set) { update = true; sql+=`entity_display=${conn.escape(data.set)},\n` }
        if (purch.ka_id !== data.ka_id) { update = true; sql+=`ka_id=${conn.escape(data.ka_id)},\n` }
        if (purch.maker !== parseInt(data.maker)) { update = true; sql+=`maker=${data.maker},\n` }
        if (purch.vendor !== parseInt(data.vendor)) { update = true; sql+=`vendor=${data.vendor},\n` }
        if (purch.price !== parseInt(data.price)) { update = true; sql+=`price=${data.price},\n` }
        if (purch.series_num !== parseInt(data.series_num)) { update = true; sql+=`series_num=${data.series_num},\n` }
        if (purch.series_total !== parseInt(data.series_total)) { update = true; sql+=`series_total=${data.series_total},\n` }
        if (purch.adjustments !== parseInt(data.adjustments)) { update = true; sql+=`adjustments=${data.adjustments},\n` }
        if (purch.saleType !== parseInt(data.saletype)) { update = true; sql+=`saleType=${data.saletype},\n` }
        if (new Date(purch.purchaseDate).toISOString().substring(0, 10) !== data.purchaseDate) { update = true; sql+=`purchaseDate=${conn.escape(data.purchaseDate)},\n` }
        if (new Date(purch.receivedDate).toISOString().substring(0, 10) !== data.expectedDate) { update = true; sql+=`receivedDate=${conn.escape(data.expectedDate)},\n` }
        if (new Date(purch.soldDate).toISOString().substring(0, 10) !== data.soldDate) { update = true; sql+=`soldDate=${conn.escape(data.soldDate)},\n` }
        if (purch.salePrice !== parseInt(data.salePrice)) { update = true; sql+=`salePrice=${data.salePrice},\n` }
        if (purch.orderSet !== parseInt(data.orderSet)) { update = true; sql+=`orderSet=${data.orderSet},\n` }
        if (purch.image != data.image) { update = true; sql+=`image='${data.image}',\n` }
        if (purch.notes != data.notes) { update = true; sql+=`notes=${conn.escape(data.notes)},\n` }
        if (purch.ig_post != data.ig_post) { update = true; sql+=`ig_post='${data.ig_post}'\n` }
        const test = sql.charAt(sql.length - 2)
        if (test == ",") { 
            sql = sql.slice(0,-2)
        }
        sql += `\nWHERE id=${id}`
        if (update) { console.log(sql)}
        if (update) { updateId = await conn.query(sql) }

        for (let i = 0; i < tags.length; i++) (
            tagnames.push(tags[i].tagname)
        ) 
        newTags.forEach(tag => {
            if (!tagnames.includes(tag)) {
                let tagId = conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.tags (tagname, purchaseId) VALUES ('${tag}', ${id})`)
            }
        })

        for(let i=0;i<colors.length;i++) {

            colornames.push(colors[i].color)
        }
        newColors.forEach(color => {
            if (!colornames.includes(color)) {
                console.log(`did not find ${color.color} in ${colornames} `)
                let colorId = conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.main_colors (color, purchase_id) VALUES ('${color}', ${id})`)
            }
        })
        // Object.keys(newTags).forEach(function(tag) {
        //     if (!tagnames.includes(newTags[tag])) {
        //         const tagName = newTags[tag]
        //         let tagId = await conn.query(`INSERT INTO ${process.env.DB_SCHEMA}.tags (tagname, purchaseId) VALUES (${tagName}, ${id})`)
        //     }
        // })
        if (conn) conn.release()
        return updateId
    },
    deletePurchaseById: async (id) => {
        conn = await db.getConnection()
        const delId = await conn.query(`DELETE FROM ${process.env.DB_SCHEMA}.purchases WHERE id = ${id} `)
        // const delId = 1
        if (conn) conn.release()
        return delId
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
        let data = await conn.query(`SELECT MAX(price) as max_price, MIN(price) as min_price, AVG(price) as avg_price FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 AND price > 0 AND sale_type != 'charity'`)
        if (conn) conn.release()
        return data
    },
    getSculptByName: async (name) => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT * FROM ${process.env.DB_SCHEMA}.all_purchases WHERE LOWER(sculpt) = '${name.toLowerCase()}' ORDER BY id;`)
        if (conn) conn.release()
        return data
    },
    getTopSculpts: async () => {
        conn = await db.getConnection()
        let data = await conn.query(`SELECT sculpt, count(sculpt) as total FROM ${process.env.DB_SCHEMA}.all_purchases GROUP BY sculpt ORDER BY total DESC LIMIT 5;`)
        if (conn) conn.release()
        return data
    },
    getTotalSculpts: async () => {
        conn = await db.getConnection()
        let sculptCount = await conn.query(`SELECT DISTINCT(sculpt) as sculpt, COUNT(sculpt) as count FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 AND received = 1 GROUP BY sculpt ORDER BY count DESC;`)
        let sculptCountNotArrived = await conn.query(`SELECT DISTINCT(sculpt) as sculpt, COUNT(sculpt) as count FROM all_purchases WHERE isSold = 0  GROUP BY sculpt ORDER BY count DESC;`)
        // let sculptData = await conn.query(`SELECT DISTINCT(p.sculpt) as name FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.isSold = 0 ORDER BY p.sculpt DESC`)
        // let sculpts = []
        // for (sculpt of sculptData) {
        //     sculpts.push(sculpt.name)
        // }
        if (conn) conn.release()

        return {'sculptCount': sculptCount, 'sculptsNotArrived': sculptCountNotArrived }
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
        let data = await conn.query(`SELECT maker_name, maker_id, count(maker_name) as total FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 AND received = 1 GROUP BY maker_name ORDER BY total DESC LIMIT 5;`)
        if (conn) conn.release()
        return data
    },
    getTotalMakers: async () => {
        conn = await db.getConnection()
        let makerCount = await conn.query(`SELECT DISTINCT(maker_name) as maker, COUNT(maker_name) as count FROM ${process.env.DB_SCHEMA}.all_purchases WHERE isSold = 0 and received = 1 GROUP BY maker_name ORDER BY count DESC; `)
        // let makerData = await conn.query(`SELECT DISTINCT(p.maker_name) as name FROM ${process.env.DB_SCHEMA}.all_purchases p WHERE p.isSold = 0 ORDER BY p.maker_name DESC`)
        // let makers = []
        // for (maker of makerData) {
        //     makers.push(maker.name)
        // }
        if (conn) conn.release()    

        return { makers: makerCount }
            // return { 'count': makerCount[0], 'sculpts': makers.sort() }
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
    },
    deleteTag: async (tagId, tag) => {
        conn = await db.getConnection()
        let delId = await conn.query(`DELETE FROM ${process.env.DB_SCHEMA}.tags t WHERE t.id = ${tagId} `)
        console.log(delId)
        if (conn) conn.release()
        return delId
    },
    getCategoryFromName: async (name) => {
        conn = await db.getConnection()
        let categoryId = await conn.query(`SELECT c.id FROM ${process.env.DB_SCHEMA}.categories c WHERE c.display_name = ${conn.escape(name)} OR c.name = ${conn.escape(name)}`)
        if (conn) conn.release()
        return categoryId
    },
    getMakerFromName: async (name) => {
        conn = await db.getConnection()
        let makerId = await conn.query(`SELECT m.id FROM ${process.env.DB_SCHEMA}.makers m WHERE m.display_name = ${conn.escape(name)} OR m.name = ${conn.escape(name)}`)
        if (conn) conn.release()
        return makerId
    },
    getVendorFromName: async (name) => {
        conn = await db.getConnection()
        let vendorId = await conn.query(`SELECT v.id FROM ${process.env.DB_SCHEMA}.vendors v WHERE v.display_name = ${conn.escape(name)} OR v.name = ${conn.escape(name)}`)
        if (conn) conn.release()
        return vendorId
    },
    getSaleTypeFromName: async (name) => {
        conn = await db.getConnection()
        let saleTypeId = await conn.query(`SELECT st.id FROM ${process.env.DB_SCHEMA}.sale_types st WHERE st.display_name = ${conn.escape(name)} OR st.name = ${conn.escape(name)}`)
        if (conn) conn.release()
        return saleTypeId
    },
    getMonthlyPurchaseData: async () => {
        conn = await db.getConnection()
        let monthlyPurch = await conn.query(`SELECT MONTH(p.purchaseDate) as month,COUNT(MONTH(p.purchaseDate)) as count FROM ${process.env.DB_SCHEMA}.purchases p GROUP BY MONTH(p.purchaseDate)`)
        if (conn) conn.release()
        return monthlyPurch
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