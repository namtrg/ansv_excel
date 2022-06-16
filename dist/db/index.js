"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
let errorFailCount = 0;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.getConnection().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.query("SELECT 1");
        errorFailCount = 0;
        connection.destroy();
    })).catch((err) => {
        if (errorFailCount < 10) {
            errorFailCount++;
            console.log("Error:", err);
            return;
        }
        console.log("Connection to database failed. Restart after 5s");
        setTimeout(function () {
            console.log("Restarting...");
            process.exit();
        });
    });
}), 60000);
const checkConnection = (callback) => {
    pool
        .getConnection()
        .then((connection) => {
        connection.destroy();
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
