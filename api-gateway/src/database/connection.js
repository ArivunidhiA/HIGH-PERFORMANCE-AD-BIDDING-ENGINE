import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'bidding_user',
    password: process.env.POSTGRES_PASSWORD || 'bidding_pass',
    database: process.env.POSTGRES_DB || 'bidding_db'
  },
  pool: {
    min: 2,
    max: 10
  }
});

export async function initDatabase() {
  try {
    await db.raw('SELECT 1');
    return db;
  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export default db;

