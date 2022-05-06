import { createPool, Pool } from "mysql2/promise";
import * as path from "path";
import { config } from "dotenv";

config({
  path: path.resolve(__dirname, "../../.env"),
});
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
console.log({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS });

const pool: Pool = createPool({
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

const checkConnection = (callback: Function) => {
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
        process.on("exit", function () {
          require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
          });
        });
        process.exit();
      }, 5000);
    });
};

export { pool, checkConnection };
