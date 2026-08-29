import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Parse .env.local or .env
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

async function inspectDatabase() {
  console.log('🔍 Smart Crop AWS RDS Database Inspector');
  console.log('-----------------------------------------');
  console.log(`📍 Host:     ${dbConfig.host}:${dbConfig.port}`);
  console.log(`👤 User:     ${dbConfig.user}`);
  console.log(`📦 Database: ${dbConfig.database}\n`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to AWS RDS MySQL successfully!\n');

    // 1. List all tables
    const [tables] = await connection.query('SHOW TABLES;');
    console.log('📋 Tables in Database:');
    console.table(tables);

    // 2. Query Farmers / Farmer Profiles
    console.log('\n🌾 Stored Farmers Data:');
    try {
      const [farmers] = await connection.query('SELECT id, name, phone, district, village, land_area, kyc_status FROM farmer_profiles LIMIT 10;');
      if (farmers.length > 0) {
        console.table(farmers);
      } else {
        const [oldFarmers] = await connection.query('SELECT * FROM farmers LIMIT 10;');
        if (oldFarmers.length > 0) console.table(oldFarmers);
        else console.log('   (Table is currently empty)');
      }
    } catch (e) {
      console.log('   Note:', e.message);
    }

    // 3. Query Crops Data
    console.log('\n🌱 Stored Crops Data:');
    try {
      const [crops] = await connection.query('SELECT id, farmer_id, name, stage, sowing_date FROM crops LIMIT 10;');
      if (crops.length > 0) {
        console.table(crops);
      } else {
        console.log('   (Table is currently empty)');
      }
    } catch (e) {
      console.log('   Note:', e.message);
    }

    // 4. Query Loan & Insurance Applications
    console.log('\n💳 Stored Loan / Bank Applications:');
    try {
      const [apps] = await connection.query('SELECT id, farmer_name, loan_type, amount, status FROM bank_applications LIMIT 10;');
      if (apps.length > 0) {
        console.table(apps);
      } else {
        console.log('   (Table is currently empty)');
      }
    } catch (e) {
      console.log('   Note:', e.message);
    }

    console.log('\n✅ Database inspection complete!\n');

  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

inspectDatabase();
