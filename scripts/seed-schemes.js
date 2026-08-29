const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if schemes exist
  const count = await prisma.scheme.count();
  if (count > 0) {
    console.log('Schemes already exist in DB. Count:', count);
    return;
  }

  console.log('Seeding schemes into DB...');
  
  await prisma.scheme.createMany({
    data: [
      {
        id: 'scheme-1',
        name: 'Pradhan Mantri Fasal Bima Yojana (Real DB Data)',
        state: 'Odisha',
        eligibility: 'All farmers in Odisha growing Paddy.',
        documents: JSON.stringify(['Aadhaar', 'Land Record']),
        application_url: 'https://pmfby.gov.in',
      },
      {
        id: 'scheme-2',
        name: 'State Crop Cover Scheme (Real DB Data)',
        state: 'Odisha',
        eligibility: 'Marginal farmers with less than 2 acres.',
        documents: JSON.stringify(['Aadhaar', 'Bank Passbook']),
        application_url: 'https://odisha.gov.in',
      }
    ]
  });

  console.log('Successfully seeded schemes!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
