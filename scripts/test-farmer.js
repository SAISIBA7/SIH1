const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  try {
    // Simple find to check what columns exist
    const farmer = await p.farmer.findUnique({ where: { id: 'shubham' } });
    console.log('Farmer result:', JSON.stringify(farmer, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await p.$disconnect();
  }
}

main();
