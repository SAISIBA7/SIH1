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
  password: process.env.DB_PASSWORD || 'Suguda123',
  database: process.env.DB_NAME || 'sih',
  ssl: { rejectUnauthorized: false },
};

const SAMPLE_FARMERS = [
  {
    id: 'farmer-001',
    name: 'Ramesh Mohanty',
    phone: '+91 94371 88291',
    district: 'Mayurbhanj',
    village: 'Baripada Rural',
    language: 'or',
    land_area: 4.8,
    loan_amount: 50000.00,
    loan_due_date: '2026-10-30',
  },
  {
    id: 'farmer-002',
    name: 'Santosh Jena',
    phone: '+91 98612 34567',
    district: 'Balasore',
    village: 'Soro',
    language: 'or',
    land_area: 3.2,
    loan_amount: 35000.00,
    loan_due_date: '2026-11-15',
  },
  {
    id: 'farmer-003',
    name: 'Priyanka Das',
    phone: '+91 91234 56780',
    district: 'Cuttack',
    village: 'Salipur',
    language: 'en',
    land_area: 5.5,
    loan_amount: 0.00,
    loan_due_date: null,
  },
  {
    id: 'farmer-004',
    name: 'Baidhar Marndi',
    phone: '+91 97780 12345',
    district: 'Mayurbhanj',
    village: 'Rairangpur',
    language: 'sat',
    land_area: 6.0,
    loan_amount: 60000.00,
    loan_due_date: '2026-12-20',
  }
];

const SAMPLE_CROPS = [
  {
    id: 'crop-paddy-01',
    farmer_id: 'farmer-001',
    name: 'Paddy (Swarna)',
    stage: 'Vegetative - Tillering',
    sowing_date: '2026-06-10',
  },
  {
    id: 'crop-mustard-02',
    farmer_id: 'farmer-001',
    name: 'Mustard (Pusa Bold)',
    stage: 'Flowering & Pod Formation',
    sowing_date: '2026-07-01',
  },
  {
    id: 'crop-wheat-03',
    farmer_id: 'farmer-002',
    name: 'Wheat (HD-2967)',
    stage: 'Grain Filling',
    sowing_date: '2026-05-20',
  },
  {
    id: 'crop-groundnut-04',
    farmer_id: 'farmer-003',
    name: 'Groundnut (TG-37A)',
    stage: 'Pod Development',
    sowing_date: '2026-06-25',
  },
  {
    id: 'crop-tomato-05',
    farmer_id: 'farmer-004',
    name: 'Tomato (Hybrid Arka Rakshak)',
    stage: 'Fruiting & Harvesting',
    sowing_date: '2026-04-15',
  }
];

const SAMPLE_BANK_APPS = [
  {
    id: 'app-kcc-001',
    farmer_id: 'farmer-001',
    farmer_name: 'Ramesh Mohanty',
    crop_name: 'Paddy (Swarna)',
    loan_type: 'Kisan Credit Card (KCC)',
    amount: 50000.00,
    status: 'Approved & Active'
  },
  {
    id: 'app-kcc-002',
    farmer_id: 'farmer-004',
    farmer_name: 'Baidhar Marndi',
    crop_name: 'Tomato (Hybrid Arka Rakshak)',
    loan_type: 'Tractor / Equipment Subsidy',
    amount: 60000.00,
    status: 'Document Verification'
  }
];

async function seedData() {
  console.log('🌱 Starting Database Seeding on AWS RDS MySQL...');
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database.\n');

    // Create tables if not exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        district VARCHAR(100),
        village VARCHAR(100),
        language VARCHAR(50) DEFAULT 'en',
        land_area DECIMAL(10,2) DEFAULT 0.00,
        loan_amount DECIMAL(12,2) DEFAULT 0.00,
        loan_due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id VARCHAR(64) PRIMARY KEY,
        farmer_id VARCHAR(64) NOT NULL,
        name VARCHAR(100) NOT NULL,
        stage VARCHAR(100) DEFAULT 'Sowing',
        sowing_date DATE,
        INDEX idx_farmer (farmer_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'farmer',
        profile_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bank_applications (
        id VARCHAR(64) PRIMARY KEY,
        farmer_id VARCHAR(64),
        farmer_name VARCHAR(255),
        crop_name VARCHAR(100),
        loan_type VARCHAR(100) DEFAULT 'Kisan Credit Card (KCC)',
        amount DECIMAL(12,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'Under Review',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 1. Seed Farmers (Using REPLACE INTO / ON DUPLICATE KEY UPDATE to match exact columns)
    console.log('1️⃣ Seeding `farmers` table...');
    for (const f of SAMPLE_FARMERS) {
      await connection.query(`
        INSERT INTO farmers (id, name, phone, district, village, language, land_area, loan_amount, loan_due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          phone = VALUES(phone),
          district = VALUES(district),
          village = VALUES(village),
          language = VALUES(language),
          land_area = VALUES(land_area),
          loan_amount = VALUES(loan_amount),
          loan_due_date = VALUES(loan_due_date)
      `, [f.id, f.name, f.phone, f.district, f.village, f.language, f.land_area, f.loan_amount, f.loan_due_date]);
    }

    // 2. Seed Crops
    console.log('2️⃣ Seeding `crops` table...');
    for (const c of SAMPLE_CROPS) {
      await connection.query(`
        INSERT INTO crops (id, farmer_id, name, stage, sowing_date)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          farmer_id = VALUES(farmer_id),
          name = VALUES(name),
          stage = VALUES(stage),
          sowing_date = VALUES(sowing_date)
      `, [c.id, c.farmer_id, c.name, c.stage, c.sowing_date]);
    }

    // 3. Seed Bank Applications
    console.log('3️⃣ Seeding `bank_applications` table...');
    for (const b of SAMPLE_BANK_APPS) {
      await connection.query(`
        INSERT INTO bank_applications (id, farmer_id, farmer_name, crop_name, loan_type, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          farmer_id = VALUES(farmer_id),
          farmer_name = VALUES(farmer_name),
          crop_name = VALUES(crop_name),
          loan_type = VALUES(loan_type),
          amount = VALUES(amount),
          status = VALUES(status)
      `, [b.id, b.farmer_id, b.farmer_name, b.crop_name, b.loan_type, b.amount, b.status]);
    }

    // Print results in console table format
    console.log('\n📊 SEEDED FARMERS IN DATABASE:');
    const [farmers] = await connection.query('SELECT id, name, phone, district, village, language, land_area, loan_amount, loan_due_date, created_at FROM farmers');
    console.table(farmers);

    console.log('\n🌾 SEEDED CROPS IN DATABASE:');
    const [crops] = await connection.query('SELECT id, farmer_id, name, stage, sowing_date FROM crops');
    console.table(crops);

    console.log('\n🏦 SEEDED BANK APPLICATIONS IN DATABASE:');
    const [bankApps] = await connection.query('SELECT * FROM bank_applications');
    console.table(bankApps);

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedData();
