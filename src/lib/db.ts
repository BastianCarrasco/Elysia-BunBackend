import { Pool } from 'pg';
import { createConfig } from './config';
import Elysia from 'elysia';

const config = createConfig(new Elysia());

export const pool = new Pool({
  connectionString: config.DB_URL,
  ssl: config.ENVIRONMENT === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('🟢 PostgreSQL connected'))
  .catch(err => console.error('🔴 PostgreSQL connection error', err));