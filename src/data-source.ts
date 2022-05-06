import "reflect-metadata";
import { DataSource } from "typeorm";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
console.log({ DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS });


export const AppDataSource = new DataSource({
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
