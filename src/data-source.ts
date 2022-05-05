import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123456",
  database: "ansv_management_test",
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: [],
  subscribers: [],
});
