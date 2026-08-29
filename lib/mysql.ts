import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local in the project root
config({ path: path.resolve(process.cwd(), '.env.local') });

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // SSL configuration can be added here if required by RDS
});

export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
}
