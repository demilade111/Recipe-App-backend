import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "recipedb",
  synchronize: true, // Disable synchronize in production
  logging: process.env.NODE_ENV === "development", // Enable logging in development
  entities: [
    process.env.NODE_ENV === "development"
      ? "src/entity/**/*.ts"
      : "dist/entity/**/*.js",
  ],

  migrations: [], // Define migrations if needed
  subscribers: [], // Define subscribers if needed
};

export const createDatabaseConnection = async () => {
  return await createConnection(dbConfig);
};
