const config = require('./.config');
const mariadb = require('mariadb');

const env = process.env.NODE_ENV || 'development';

const pool = 
    mariadb.createPool({
        host: config[env].db.host,
        port: config[env].db.port,
        user: config[env].db.user,
        password: config[env].db.password,
        database: config[env].db.schema,
        connectionLimit: 5
    });


module.exports = {
    getConnection: async function () {
        return pool.getConnection();
    }
}