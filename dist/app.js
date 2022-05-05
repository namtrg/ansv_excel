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
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const export_1 = require("./controller/export");
const import_1 = require("./controller/import");
const app = express();
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/** API path that will upload the files */
app.post("/upload", import_1.default);
app.get("/download", (req, res) => {
    const file = req.query.file;
    const exportFolder = path.join(__dirname, "export");
    const filePath = path.join(exportFolder, file);
    if (!fs.existsSync(filePath)) {
        res.status(404).json({
            error_code: 1,
            err_desc: "Không tìm thấy file",
            error_detail: "",
        });
        return;
    }
    res.download(filePath);
});
const PORT = process.env.PORT || 3000;
// import { AppDataSource } from "./data-source";
const promise_1 = require("mysql2/promise");
// create the connection to database
const initApp = (() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = (0, promise_1.createPool)({
        host: "10.1.3.10",
        port: 3306,
        user: "root",
        password: "Tasc@1235",
        database: "ansv_management_test",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // rowsAsArray: true,
    });
    if (!connection) {
        console.log("Connection failed. Restart after 5s");
        setTimeout(function () {
            console.log("Restarting...");
            process.on("exit", function () {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit",
                });
            });
            process.exit();
        }, 5000);
        return;
    }
    app.post("/export", (req, res) => {
        (0, export_1.default)(req, res, connection);
    });
    app.listen(PORT, function () {
        console.log("Server running in port " + PORT);
    });
    // })
    //   .catch((error) => console.log(error));
}));
exports.default = initApp;
