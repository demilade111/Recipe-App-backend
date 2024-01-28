import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import { Recipe } from "../entity/Recipe";
import { Users } from "../entity/User";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Disable synchronize in production
  logging: process.env.NODE_ENV === "development", // Enable logging in development
  entities: [Users, Recipe],

  migrations: [], // Define migrations if needed
  subscribers: [], // Define subscribers if needed
};

export const createDatabaseConnection = async () => {
  return await createConnection(dbConfig);
};
