const env = process.env.NODE_ENV || "dev"
require('dotenv').config({path: `../.env.${env}`})
const mariadb = require('mariadb');

const pool = 
    mariadb.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_SCHEMA,
        connectionLimit: 3
    });


module.exports = {
    getConnection: async function () {
        return pool.getConnection();
    }
}