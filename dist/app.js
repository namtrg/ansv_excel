"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const nocache = require("nocache");
const export_1 = require("./controller/export");
const import_1 = require("./controller/import");
const app = express();
app.use(bodyParser.json());
app.set("etag", false);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
/** API path that will upload the files */
app.post("/upload", nocache(), import_1.default);
app.post("/export", nocache(), (req, res) => {
    (0, export_1.default)(req, res);
});
app.get("/download", nocache(), (req, res) => {
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
exports.default = app;
