import pg from "pg";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const { Pool } = pg;

const buildConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const developmentConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
};

const databaseConfig =
  process.env.NODE_ENV === "dev" ? developmentConfig : buildConfig;

console.log(chalk.bold.blue("Database connected"));

export const connection = new Pool(databaseConfig);
