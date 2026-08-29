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

async function describeTables() {
  console.log('🔍 Inspecting AWS RDS MySQL Database Schema...');
  console.log(`📍 Host:     ${dbConfig.host}:${dbConfig.port}`);
  console.log(`👤 User:     ${dbConfig.user}`);
  console.log(`📦 Database: ${dbConfig.database}\n`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection established!\n');

    const [tables] = await connection.query('SHOW TABLES;');
    console.log('📋 All Tables:');
    console.table(tables);

    const targetTables = ['farmers', 'farms', 'crops', 'users', 'farmer_profiles', 'notifications', 'risk_scores'];
    
    for (const table of targetTables) {
      try {
        console.log(`\n=== DESCRIBE ${table} ===`);
        const [schema] = await connection.query(`DESCRIBE \`${table}\`;`);
        console.table(schema);
      } catch (err) {
        console.log(`Table ${table} does not exist or error:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Connection/Query Error:', error.message || error.code || error);
    if (error.errors) console.error('Details:', error.errors);
  } finally {
    if (connection) await connection.end();
  }
}

describeTables();
