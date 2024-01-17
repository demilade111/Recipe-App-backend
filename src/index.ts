import express from "express";
import * as dotenv from "dotenv";
const app = express();
import { createDatabaseConnection } from "./config/db";
import userRouter from "./routes/userRouter";
import recipeRouter from "./routes/recipeRouter";
import { errorHandler } from "./middlewear/errorHandler";

require("dotenv").config();

async function startApp() {
  try {
    const connection = await createDatabaseConnection();
    console.log(`Connected to the database ${connection.options.database}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

startApp();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/home", (req, res) => {
  res.send("okay");
});
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
// After all other middleware and routes
app.use(errorHandler);

// const port = process.env.PORT;
// console.log("port: ", port);

app.listen(3001, () => {
  console.log(`Server is running`);
});
