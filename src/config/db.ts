import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import { Users } from "../entity/User";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "dez",
  password: "123456789",
  database: "recipedb",
  synchronize: true, // Disable synchronize in production
  logging: process.env.NODE_ENV === "development", // Enable logging in development
  entities: [Users],
  migrations: [], // Define migrations if needed
  subscribers: [], // Define subscribers if needed
};

export const createDatabaseConnection = async () => {
  return await createConnection(dbConfig);
};
