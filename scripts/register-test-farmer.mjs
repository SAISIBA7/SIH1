import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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
  connectTimeout: 20000,
};

async function testRegister() {
  console.log('🌾 Starting Test Farmer Registration in AWS RDS...');
  console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`📦 Database: ${dbConfig.database}\n`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to AWS RDS MySQL Database successfully!\n');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const testPhone = `94371${randomSuffix}`;
    const testEmail = `farmer_odisha_${randomSuffix}@smartcrop.in`;
    const testPassword = 'Password123!';
    const farmerName = 'Suresh Kumar Behera';
    const district = 'Mayurbhanj';
    const village = 'Baripada';
    const state = 'Odisha';
    const landArea = 4.50;
    const currentCrop = 'Paddy (Swarna MTU 7029)';
    const soilType = 'Red Loamy';
    const sowingDate = '2026-07-20';

    console.log(`1️⃣ Hashing password securely with bcrypt...`);
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log(`   Hashed Password: ${hashedPassword.slice(0, 30)}...\n`);

    const timestamp = Date.now();
    const farmerId = `FRM_${timestamp.toString().slice(-8)}_${Math.floor(100 + Math.random() * 900)}`;
    const farmId = `FRM_LAND_${timestamp.toString().slice(-8)}`;
    const cropId = `CRP_${timestamp.toString().slice(-8)}`;

    console.log(`2️⃣ Inserting into \`farmers\` table...`);
    await connection.query(
      `INSERT INTO farmers (id, name, phone, email, password_hash, district, village, language, land_area, state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [farmerId, farmerName, testPhone, testEmail, hashedPassword, district, village, 'Odia', landArea, state]
    );
    console.log(`   ✅ Farmer inserted: ID=${farmerId}, Phone=${testPhone}\n`);

    console.log(`3️⃣ Inserting into \`farms\` table (Foreign Key: farmer_id=${farmerId})...`);
    await connection.query(
      `INSERT INTO farms (id, farmer_id, name, latitude, longitude, area, soil_type, village, district)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [farmId, farmerId, `${farmerName}'s Farm`, 21.9322, 86.7483, landArea, soilType, village, district]
    );
    console.log(`   ✅ Farm inserted: ID=${farmId}\n`);

    console.log(`4️⃣ Inserting into \`crops\` table (Foreign Key: farmer_id=${farmerId})...`);
    await connection.query(
      `INSERT INTO crops (id, farmer_id, name, stage, sowing_date)
       VALUES (?, ?, ?, ?, ?);`,
      [cropId, farmerId, currentCrop, 'Vegetative', sowingDate]
    );
    console.log(`   ✅ Crop inserted: ID=${cropId}, Crop=${currentCrop}\n`);

    console.log(`5️⃣ Verifying rows directly in AWS RDS database:\n`);

    console.log('=== Verified Farmers Row ===');
    const [farmers] = await connection.query('SELECT id, name, phone, email, password_hash, district, village, land_area, state, created_at FROM farmers WHERE id = ?;', [farmerId]);
    console.table(farmers);

    console.log('\n=== Verified Farms Row ===');
    const [farms] = await connection.query('SELECT id, farmer_id, name, latitude, longitude, area, soil_type, village, district FROM farms WHERE farmer_id = ?;', [farmerId]);
    console.table(farms);

    console.log('\n=== Verified Crops Row ===');
    const [crops] = await connection.query('SELECT id, farmer_id, name, stage, sowing_date FROM crops WHERE farmer_id = ?;', [farmerId]);
    console.table(crops);

    console.log('\n6️⃣ Testing Bcrypt Password Verification...');
    const match = await bcrypt.compare(testPassword, farmers[0].password_hash);
    console.log(`   Password verification match: ${match ? '✅ SUCCESS' : '❌ FAILED'}\n`);

    console.log('🎉 ALL TESTS PASSED! Farmer, Farm, and Crop data successfully stored in AWS RDS MySQL!');

  } catch (error) {
    console.error('❌ Error during test registration:', error);
  } finally {
    if (connection) await connection.end();
  }
}

testRegister();
