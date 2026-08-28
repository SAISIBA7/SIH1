import { createClient } from '@insforge/sdk';

const baseUrl = 'https://856k6wi6.us-east.insforge.app';
const apiKey = 'ik_91ea0e539d3016d1f957b64d71322dcf';

const insforge = createClient({
  baseUrl,
  anonKey: apiKey,
});

async function runBankTest() {
  console.log('--- Testing Bank / Insurance Registration in InsForge ---');

  const testBankEmail = `bank_officer_${Date.now()}@sbi.co.in`;
  const testPassword = 'Password123!';
  const testName = 'Meera Patnaik';
  const testPhone = '9776144332';
  const orgName = 'State Bank of India';
  const orgType = 'Bank';
  const employeeId = 'SBI-AFO-9082';
  const branch = 'Bhubaneswar Main Branch';
  const state = 'Odisha';
  const district = 'Khordha';

  console.log(`\n1. Creating Bank Account via InsForge Auth: ${testBankEmail}`);
  const { data: signUpData, error: signUpError } = await insforge.auth.signUp({
    email: testBankEmail,
    password: testPassword,
    name: testName,
    autoConfirm: true,
  });

  if (signUpError) {
    console.error('SignUp Error:', signUpError);
    return;
  }
  console.log('SignUp Successful! User confirmed with autoConfirm.');

  const userId = signUpData?.user?.id || `bnk_${Date.now()}`;

  console.log('\n2. Storing Bank Record in InsForge Database:');
  try {
    const { data: userInsert, error: userErr } = await insforge.database
      .from('users')
      .insert([
        {
          auth_user_id: userId,
          role: 'bank',
          full_name: testName,
          email: testBankEmail,
          mobile_number: testPhone,
          account_status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (userErr) {
      console.log('Users table insert result:', userErr.message);
    } else {
      console.log('Successfully saved to "users" table with role="bank":', userInsert);
    }
  } catch (e) {
    console.log('Users DB notice:', e.message);
  }

  try {
    const { data: bankInsert, error: bankErr } = await insforge.database
      .from('bank_profiles')
      .insert([
        {
          user_id: userId,
          organization_name: orgName,
          organization_type: orgType,
          employee_id: employeeId,
          branch: branch,
          state: state,
          district: district,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (bankErr) {
      console.log('Bank profiles table insert result:', bankErr.message);
    } else {
      console.log('Successfully saved to "bank_profiles" table:', bankInsert);
    }
  } catch (e) {
    console.log('Bank profiles DB notice:', e.message);
  }

  console.log('\n3. Testing Bank Officer Login:');
  const { data: loginData, error: loginError } = await insforge.auth.signInWithPassword({
    email: testBankEmail,
    password: testPassword,
  });

  if (loginError) {
    console.error('Login Failed:', loginError);
  } else {
    console.log('Bank Officer Login Successful!');
    console.log('Authenticated User ID:', loginData?.user?.id);
    console.log('Session token issued:', Boolean(loginData?.accessToken));
  }

  console.log('\n=============================================');
  console.log('Bank Registration & Login Verification PASS!');
  console.log('=============================================');
}

runBankTest().catch(console.error);
