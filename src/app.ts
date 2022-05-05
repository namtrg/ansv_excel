import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from "fs";

import exportController from "./controller/export";
import importController from "./controller/import";

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

app.get("/download", (req, res) => {
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

const PORT = process.env.PORT || 3000;
// import { AppDataSource } from "./data-source";

import { createPool } from "mysql2/promise";

// create the connection to database

const initApp = (async () => {
  const connection = createPool({
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
    exportController(req, res, connection);
  });

  app.listen(PORT, function () {
    console.log("Server running in port " + PORT);
  });
  // })
  //   .catch((error) => console.log(error));
});

export default initApp;
