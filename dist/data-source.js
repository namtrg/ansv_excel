"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
console.log({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    port: +DB_PORT || 3306,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: [],
    subscribers: [],
});
