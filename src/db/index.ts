import { createPool, Pool } from "mysql2/promise";
import * as path from "path";
import { config } from "dotenv";

console.log("Env file:", path.resolve(__dirname, "../../.env"));

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

let errorFailCount = 0;

setInterval(async () => {
  await pool.getConnection().then(async(connection) => {
    await connection.query("SELECT 1");
    errorFailCount = 0;
    connection.destroy();
  }).catch((err) => {
    if(errorFailCount < 10) {
      errorFailCount++;
      console.log("Error:", err);
      return;
    }
    console.log("Connection to database failed. Restart after 5s");
    setTimeout(function () {
      console.log("Restarting...");
      process.exit();
    })
  });
})

const checkConnection = (callback: Function) => {
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

export { pool, checkConnection };
