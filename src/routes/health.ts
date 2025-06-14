import { Elysia } from "elysia";
import { pool } from "../lib/db";

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get("/", () => ({ status: "ok" }))
  .get("/db", async () => {
    const { rows } = await pool.query('SELECT NOW() as time');
    return { db_time: rows[0].time };
  });