const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const exportController = require("./controller/export");
const importController = require("./controller/import");

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/** API path that will upload the files */
app.post("/upload", importController);

app.post("/export", exportController);

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

module.exports = app;
