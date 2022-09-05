import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import cardRouter from "./routers/cardsRouter.js"

dotenv.config();

let app = express();
app.use(cors(), json());

app.use(cardRouter)

app.listen(process.env.PORT, () =>
  console.log(chalk.bold.blue(`Server is running on port ${process.env.PORT}`))
);
