import { signJwt, verifyJwt } from '../lib/auth-jwt.js';

// Test 1: Verify token signing and verification
const token = signJwt({
  id: 'usr_test_1',
  name: 'Test Farmer',
  role: 'farmer',
  email: 'farmer@test.com'
});

const verified = verifyJwt(token);
if (!verified.valid || verified.payload?.role !== 'farmer') {
  console.error('JWT verification failed!');
  process.exit(1);
}

// Test 2: Verify tampered token fails
const tamperedToken = token.slice(0, -4) + 'abcd';
const tamperedCheck = verifyJwt(tamperedToken);
if (tamperedCheck.valid) {
  console.error('Tampered token check failed to reject!');
  process.exit(1);
}

console.log('JWT signature & validation tests passed successfully!');
