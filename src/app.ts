import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from "fs";
import * as morgan from "morgan";
const nocache = require('nocache')

import exportController from "./controller/export";
import importController from "./controller/import";

const app = express();
app.use(bodyParser.json());

let connection: any;

app.set("etag", false);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
  )
);

/** API path that will upload the files */
app.post("/upload", nocache(), importController);

app.post("/export", nocache(), (req, res) => {
  exportController(req, res, connection);
});

app.get("/download", nocache(), (req, res) => {
  const file = req.query.file;
  const exportFolder = path.join(__dirname, "export");
  const filePath = path.join(exportFolder, file as string);
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

import { createPool } from "mysql2/promise";

// create the connection to database

connection = createPool({
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

export default app;
