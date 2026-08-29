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

async function verifyFarmer(phone) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to AWS RDS\n');

    console.log('=== Stored Farmer in RDS ===');
    const [farmers] = await connection.query(
      'SELECT id, name, phone, email, password_hash, district, village, land_area, state, created_at FROM farmers WHERE phone = ?;',
      [phone]
    );
    console.table(farmers);

    if (farmers.length > 0) {
      const farmerId = farmers[0].id;
      console.log('\n=== Stored Farm in RDS ===');
      const [farms] = await connection.query(
        'SELECT id, farmer_id, name, latitude, longitude, area, soil_type, village, district FROM farms WHERE farmer_id = ?;',
        [farmerId]
      );
      console.table(farms);

      console.log('\n=== Stored Crop in RDS ===');
      const [crops] = await connection.query(
        'SELECT id, farmer_id, name, stage, sowing_date FROM crops WHERE farmer_id = ?;',
        [farmerId]
      );
      console.table(crops);
    }

  } catch (err) {
    console.error('❌ Verification Error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

const targetPhone = process.argv[2] || '9876541234';
verifyFarmer(targetPhone);
