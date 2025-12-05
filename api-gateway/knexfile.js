import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER || 'bidding_user',
      password: process.env.POSTGRES_PASSWORD || 'bidding_pass',
      database: process.env.POSTGRES_DB || 'bidding_db'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations'
    }
  }
};

