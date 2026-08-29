import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  }
}

loadEnv();

const dbConfig = {
  host: process.env.DB_HOST || 'sih-mysql.cley86o8g8vx.eu-north-1.rds.amazonaws.com',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'kFjzqqPYEQb2awh',
  database: process.env.DB_NAME || 'sih',
  ssl: { rejectUnauthorized: false },
  connectTimeout: 10000,
};

async function ensureFarmerColumns() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to AWS RDS');

    const [columns] = await connection.query('DESCRIBE farmers;');
    const colNames = columns.map(c => c.Field);
    console.log('Current farmers columns:', colNames);

    if (!colNames.includes('password_hash')) {
      console.log('Adding password_hash column to farmers table...');
      await connection.query('ALTER TABLE farmers ADD COLUMN password_hash VARCHAR(255) NULL AFTER phone;');
      console.log('✅ Added password_hash');
    }

    if (!colNames.includes('email')) {
      console.log('Adding email column to farmers table...');
      await connection.query('ALTER TABLE farmers ADD COLUMN email VARCHAR(255) NULL AFTER phone;');
      console.log('✅ Added email');
    }

    const [updated] = await connection.query('DESCRIBE farmers;');
    console.table(updated);

  } catch (err) {
    console.error('❌ Migration note/error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

ensureFarmerColumns();
