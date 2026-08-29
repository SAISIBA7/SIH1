const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Check all columns that actually exist in the farmers table
async function main() {
  try {
    const cols = await p.$queryRawUnsafe(
      "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'sih' AND TABLE_NAME = 'farmers' ORDER BY ORDINAL_POSITION"
    );
    console.log('Actual farmers columns:', JSON.stringify(cols, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await p.$disconnect();
  }
}

main();
