import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from "fs";
import * as morgan from "morgan";
const nocache = require("nocache");

import exportController from "./controller/export";
import importController from "./controller/import";

const app = express();
app.use(bodyParser.json());

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
  exportController(req, res);
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

export default app;
