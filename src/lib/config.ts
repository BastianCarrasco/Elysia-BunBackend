import { Elysia } from "elysia";

interface Config {
  PORT: number;
  ENVIRONMENT: string;
  DB_URL: string;
  APP: Elysia;
}

export const createConfig = (app: Elysia): Config => ({
  PORT: parseInt(process.env.PORT || "3000"),
  ENVIRONMENT: process.env.ENVIRONMENT || "development",
  DB_URL: process.env.DATABASE_URL,
  APP: app,
});