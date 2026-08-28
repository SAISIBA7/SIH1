import { smartCropAuth } from '../lib/smartcrop-auth.ts';

// Mock localStorage in Node.js environment
const store = new Map();
global.window = {};
global.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

async function runVerification() {
  console.log('======================================================================');
  console.log('SMART CROP MULTI-ROLE AUTHENTICATION & DATABASE VERIFICATION TEST');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // ---------------------------------------------------------
  // 1. DEMO ACCOUNTS VERIFICATION
  // ---------------------------------------------------------
  console.log('--- 1. Testing Default Pre-Seeded Accounts ---');

  // 1a. Demo Farmer Login
  const farmerDemoSession = await smartCropAuth.loginWithMobile('9876543210', 'Password123!');
  assert(farmerDemoSession.role === 'farmer', 'Demo Farmer logs in with Mobile and gets role "farmer"');
  assert(smartCropAuth.getDashboardRoute(farmerDemoSession.role) === '/dashboard', 'Farmer dashboard route is /dashboard');

  // 1b. Demo Admin Login
  const adminDemoSession = await smartCropAuth.loginWithEmail('admin@agri.gov.in', 'Password123!');
  assert(adminDemoSession.role === 'administrator', 'Demo Admin logs in with Email and gets role "administrator"');
  assert(smartCropAuth.getDashboardRoute(adminDemoSession.role) === '/admin/dashboard', 'Admin dashboard route is /admin/dashboard');

  // 1c. Demo Bank Login
  const bankDemoSession = await smartCropAuth.loginWithEmail('bank@sbi.co.in', 'Password123!');
  assert(bankDemoSession.role === 'bank', 'Demo Bank logs in with Email and gets role "bank"');
  assert(smartCropAuth.getDashboardRoute(bankDemoSession.role) === '/bank/dashboard', 'Bank dashboard route is /bank/dashboard');


  // ---------------------------------------------------------
  // 2. NEW FARMER REGISTRATION & RE-LOGIN
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing New Farmer Registration & Re-Login ---');
  const newFarmer = await smartCropAuth.registerFarmer({
    fullName: 'Subhash Mohanty',
    mobileNumber: '9812345670',
    email: 'subhash.farmer@gmail.com',
    password: 'Subhash@Password123',
    state: 'Odisha',
    district: 'Mayurbhanj',
    village: 'Baripada',
    landArea: '5.0',
    currentCrop: 'Rice / Paddy',
    preferredLanguage: 'Odia',
  });

  assert(newFarmer.fullName === 'Subhash Mohanty', 'Farmer registration creates user with correct name');
  assert(newFarmer.role === 'farmer', 'Farmer registration assigns "farmer" role');
  assert(newFarmer.accountStatus === 'active', 'Farmer account status is "active"');

  // Sign out
  await smartCropAuth.signOut();
  assert((await smartCropAuth.getCurrentSession()) === null, 'Farmer signs out and session is cleared');

  // Re-login with Mobile
  const farmerReLoginMobile = await smartCropAuth.loginWithMobile('9812345670', 'Subhash@Password123');
  assert(farmerReLoginMobile.fullName === 'Subhash Mohanty', 'Farmer logs back in with Mobile number');
  assert(farmerReLoginMobile.role === 'farmer', 'Farmer role preserved on re-login');

  // Re-login with Email
  const farmerReLoginEmail = await smartCropAuth.loginWithEmail('subhash.farmer@gmail.com', 'Subhash@Password123');
  assert(farmerReLoginEmail.fullName === 'Subhash Mohanty', 'Farmer logs back in with Email');


  // ---------------------------------------------------------
  // 3. NEW ADMINISTRATOR REGISTRATION & RE-LOGIN
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing New Administrator Registration & Re-Login ---');
  const newAdmin = await smartCropAuth.registerAdmin({
    fullName: 'Dr. Sourav Patra',
    mobileNumber: '9812345671',
    officialEmail: 'dr.patra@agri.gov.in',
    password: 'AdminSecure@123',
    organization: 'Directorate of Agriculture, Odisha',
    designation: 'State Agriculture Officer',
    state: 'Odisha',
    district: 'Bhubaneswar',
    administratorId: 'AGRI-OD-9901',
  });

  assert(newAdmin.fullName === 'Dr. Sourav Patra', 'Admin registration creates user with correct name');
  assert(newAdmin.role === 'administrator', 'Admin registration assigns "administrator" role');
  assert(newAdmin.accountStatus === 'pending', 'Admin account status requires verification');

  await smartCropAuth.signOut();

  // Re-login with Official Email
  const adminReLogin = await smartCropAuth.loginWithEmail('dr.patra@agri.gov.in', 'AdminSecure@123');
  assert(adminReLogin.role === 'administrator', 'Admin logs back in with Official Email');
  assert(smartCropAuth.getDashboardRoute(adminReLogin.role) === '/admin/dashboard', 'Admin route resolves to /admin/dashboard');

  // Re-login with Phone Number
  const adminReLoginPhone = await smartCropAuth.loginWithMobile('9812345671', 'AdminSecure@123');
  assert(adminReLoginPhone.role === 'administrator', 'Admin logs back in with Mobile Number');


  // ---------------------------------------------------------
  // 4. NEW BANK / INSURANCE REGISTRATION & RE-LOGIN
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing New Bank / Insurance Registration & Re-Login ---');
  const newBank = await smartCropAuth.registerBank({
    fullName: 'Priya Sharma',
    mobileNumber: '9812345672',
    officialEmail: 'priya.sharma@hdfcbank.com',
    password: 'BankSecure@Password123',
    organizationName: 'HDFC Bank Agri Division',
    organizationType: 'Bank',
    employeeId: 'HDFC-AG-4412',
    branch: 'Cuttack Main Branch',
    state: 'Odisha',
    district: 'Cuttack',
  });

  assert(newBank.fullName === 'Priya Sharma', 'Bank registration creates user with correct name');
  assert(newBank.role === 'bank', 'Bank registration assigns "bank" role');

  await smartCropAuth.signOut();

  // Re-login with Work Email
  const bankReLogin = await smartCropAuth.loginWithEmail('priya.sharma@hdfcbank.com', 'BankSecure@Password123');
  assert(bankReLogin.role === 'bank', 'Bank user logs back in with Email');
  assert(smartCropAuth.getDashboardRoute(bankReLogin.role) === '/bank/dashboard', 'Bank route resolves to /bank/dashboard');


  // ---------------------------------------------------------
  // 5. ERROR HANDLING & SECURITY CHECKS
  // ---------------------------------------------------------
  console.log('\n--- 5. Testing Error Handling & Security ---');

  // Duplicate mobile check
  try {
    await smartCropAuth.registerFarmer({
      fullName: 'Duplicate Tester',
      mobileNumber: '9812345670', // already registered above
      password: 'SomePassword123',
      state: 'Odisha',
      district: 'Mayurbhanj',
    });
    assert(false, 'Duplicate mobile should throw error');
  } catch (err) {
    assert(err.message.includes('already exists'), 'Duplicate registration correctly blocked with clear error message');
  }

  // Invalid password check
  try {
    await smartCropAuth.loginWithMobile('9812345670', 'WrongPassword!');
    assert(false, 'Wrong password should fail');
  } catch (err) {
    assert(err.message.includes('Incorrect password') || err.message.includes('Invalid'), 'Incorrect password returns clean message');
  }

  // Password reset check
  const resetRes = await smartCropAuth.forgotPassword('9812345670');
  assert(resetRes.success === true, 'Forgot password dispatches instructions');

  console.log('\n======================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('======================================================================\n');
}

runVerification().catch(console.error);
