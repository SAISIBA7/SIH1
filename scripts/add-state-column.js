const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  try {
    await p.$executeRawUnsafe(
      "ALTER TABLE `sih`.`farmers` ADD COLUMN `state` VARCHAR(100) NOT NULL DEFAULT ''"
    );
    console.log('✅ Column `state` added successfully.');
  } catch (e) {
    if (e.message && e.message.includes('Duplicate column name')) {
      console.log('ℹ️  Column `state` already exists — no change needed.');
    } else {
      console.error('❌ Error:', e.message);
    }
  } finally {
    await p.$disconnect();
  }
}

main();
