import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cse340_db',
  port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
