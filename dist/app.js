"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const export_1 = require("./controller/export");
const import_1 = require("./controller/import");
const app = express();
app.use(bodyParser.json());
let connection;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
function nocache(req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
}
/** API path that will upload the files */
app.post("/upload", nocache, import_1.default);
app.post("/export", nocache, (req, res) => {
    (0, export_1.default)(req, res, connection);
});
app.get("/download", nocache, (req, res) => {
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
const promise_1 = require("mysql2/promise");
// create the connection to database
connection = (0, promise_1.createPool)({
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
}
exports.default = app;
