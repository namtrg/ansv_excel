"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = exports.pool = void 0;
const promise_1 = require("mysql2/promise");
const path = require("path");
const dotenv_1 = require("dotenv");
console.log("Env file:", path.resolve(__dirname, "../../.env"));
(0, dotenv_1.config)({
    path: path.resolve(__dirname, "../../.env"),
});
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
console.log({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS });
const pool = (0, promise_1.createPool)({
    host: DB_HOST,
    port: +DB_PORT || 3306,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // rowsAsArray: true,
});
exports.pool = pool;
const checkConnection = (callback) => {
    pool
        .getConnection()
        .then((conection) => {
        conection.release();
        callback();
    })
        .catch((err) => {
        console.log("Connection to database failed. Restart after 5s");
        setTimeout(function () {
            console.log("Restarting...");
            process.exit();
        }, 5000);
    });
};
exports.checkConnection = checkConnection;
