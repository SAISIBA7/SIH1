import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

const dbConfig = {
  host: process.env.DB_HOST || 'sih-mysql.cley86o8g8vx.eu-north-1.rds.amazonaws.com',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'admin',
  // No hardcoded fallback — a missing DB_PASSWORD must fail loudly with an auth
  // error rather than silently trying a stale credential.
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'sih',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Singleton connection pool across serverless / dev hot-reloads
export const pool: mysql.Pool =
  global.mysqlPool ||
  mysql.createPool(dbConfig);

if (process.env.NODE_ENV !== 'production') {
  global.mysqlPool = pool;
}

/**
 * Helper to execute parameterized SQL queries against AWS RDS MySQL.
 */
export async function query<T = any>(sql: string, values?: any[]): Promise<T> {
  const [rows] = await pool.query(sql, values);
  return rows as T;
}

/**
 * Health check helper for the database connection.
 */
export async function checkDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await pool.query('SELECT 1 as connected');
    return {
      success: true,
      message: 'Successfully connected to AWS RDS MySQL database (sih).',
    };
  } catch (error: any) {
    console.error('AWS RDS MySQL connection error:', error.message);
    return {
      success: false,
      message: `Database connection failed: ${error.message}`,
    };
  }
}
