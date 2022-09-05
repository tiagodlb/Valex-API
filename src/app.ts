import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import cardRouter from "./routers/cardsRouter.js";
import rechargeRouter from "./routers/rechargeRouter.js";
import purchaseRouter from "./routers/purchaseRouter.js";

dotenv.config();

let app = express();
app.use(cors(), json());

app.use(cardRouter);
app.use(rechargeRouter);
app.use(purchaseRouter);

app.listen(process.env.PORT, () =>
  console.log(chalk.bold.blue(`Server is running on port ${process.env.PORT}`))
);
