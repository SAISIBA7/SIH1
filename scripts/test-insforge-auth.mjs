import { createClient } from '@insforge/sdk';

const baseUrl = 'https://856k6wi6.us-east.insforge.app';
const apiKey = 'ik_91ea0e539d3016d1f957b64d71322dcf';

const insforge = createClient({
  baseUrl,
  anonKey: apiKey,
});

async function runTest() {
  console.log('--- 1. Testing InsForge Connection ---');
  console.log('Base URL:', baseUrl);

  const testEmail = `farmer_${Date.now()}@smartcrop.in`;
  const testPassword = 'Password123!';
  const testName = 'Ramesh Test Farmer';
  const testPhone = '9876543210';

  console.log('\n--- 2. Testing InsForge Auth: SignUp ---');
  console.log(`Signing up user: ${testEmail}`);
  const { data: signUpData, error: signUpError } = await insforge.auth.signUp({
    email: testEmail,
    password: testPassword,
    name: testName,
    autoConfirm: true,
  });

  if (signUpError) {
    console.error('SignUp Error:', signUpError);
  } else {
    console.log('SignUp Success! User ID:', signUpData?.user?.id);
    console.log('User Details:', signUpData?.user?.email, signUpData?.user?.profile);
  }

  const userId = signUpData?.user?.id || `test_usr_${Date.now()}`;

  console.log('\n--- 3. Testing InsForge Database Storage ---');
  // Check if users table exists and insert user record
  try {
    const { data: userInsert, error: userErr } = await insforge.database
      .from('users')
      .insert([
        {
          auth_user_id: userId,
          role: 'farmer',
          full_name: testName,
          email: testEmail,
          mobile_number: testPhone,
          account_status: 'active',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (userErr) {
      console.log('Note on "users" table insert:', userErr.message);
    } else {
      console.log('Successfully inserted into "users" table:', userInsert);
    }
  } catch (e) {
    console.log('DB Users table check:', e.message);
  }

  // Check farmer_profiles table
  try {
    const { data: profileInsert, error: profErr } = await insforge.database
      .from('farmer_profiles')
      .insert([
        {
          user_id: userId,
          state: 'Odisha',
          district: 'Mayurbhanj',
          village: 'Baripada',
          land_area: '3.5',
          preferred_language: 'Odia',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (profErr) {
      console.log('Note on "farmer_profiles" table insert:', profErr.message);
    } else {
      console.log('Successfully inserted into "farmer_profiles" table:', profileInsert);
    }
  } catch (e) {
    console.log('DB Profile table check:', e.message);
  }

  console.log('\n--- 4. Testing InsForge Auth: SignIn with Password ---');
  const { data: signInData, error: signInError } = await insforge.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.error('SignIn Error:', signInError);
  } else {
    console.log('SignIn Success!');
    console.log('Authenticated User ID:', signInData?.user?.id);
    console.log('Access Token:', signInData?.accessToken ? 'Token received (valid session)' : 'No token');
  }

  console.log('\n--- 5. Testing InsForge Auth: Get Current User ---');
  const { data: currentUserData, error: currErr } = await insforge.auth.getCurrentUser();
  if (currErr) {
    console.error('GetCurrentUser Error:', currErr);
  } else {
    console.log('Current User verified in session:', currentUserData?.user?.email);
  }

  console.log('\n========================================');
  console.log('InsForge Auth and Database test completed!');
  console.log('========================================');
}

runTest().catch(console.error);
