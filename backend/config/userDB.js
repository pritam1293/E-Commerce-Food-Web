require('dotenv').config();
const mysql = require('mysql2');

const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = connectionPool.promise();

connectionPool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log("");
        console.log('MySQL Database connected successfully.');
        console.log("");
        connection.release();
    }
});

module.exports = promisePool;
