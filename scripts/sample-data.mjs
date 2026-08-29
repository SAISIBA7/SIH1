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

async function inspectSampleData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection established!\n');

    console.log('=== Sample Farmers ===');
    const [farmers] = await connection.query('SELECT * FROM farmers LIMIT 3;');
    console.table(farmers);

    console.log('\n=== Sample Farms ===');
    const [farms] = await connection.query('SELECT * FROM farms LIMIT 3;');
    console.table(farms);

    console.log('\n=== Sample Crops ===');
    const [crops] = await connection.query('SELECT * FROM crops LIMIT 3;');
    console.table(crops);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

inspectSampleData();
