import crypto from 'crypto';
import assert from 'assert';

console.log('--- Testing Web App Authentication & Validation Logic ---');

// 1. Test Disposable Email Detection
const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'fakemailgenerator.com',
  'temp-mail.org',
  'yopmail.com',
  'dispostable.com',
  'throwawaymail.com'
];

function isDisposableEmail(email) {
  const domain = email.toLowerCase().split('@')[1];
  return DISPOSABLE_DOMAINS.includes(domain);
}

assert.strictEqual(isDisposableEmail('test@mailinator.com'), true, 'Should detect mailinator.com as disposable');
assert.strictEqual(isDisposableEmail('user@tempmail.com'), true, 'Should detect tempmail.com as disposable');
assert.strictEqual(isDisposableEmail('ahmed@gmail.com'), false, 'Should allow valid gmail.com');
assert.strictEqual(isDisposableEmail('fatima@outlook.com'), false, 'Should allow valid outlook.com');
console.log('✔ Test 1: Disposable email validation passed.');

// 2. Test PBKDF2 Password Hashing
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

const salt1 = crypto.randomBytes(16).toString('hex');
const hash1 = hashPassword('SecretPassword123!', salt1);
const hash2 = hashPassword('SecretPassword123!', salt1);
const hashWrong = hashPassword('WrongPassword!', salt1);

assert.strictEqual(hash1, hash2, 'Identical passwords and salts must produce identical hashes');
assert.notStrictEqual(hash1, hashWrong, 'Different passwords must produce different hashes');
assert.strictEqual(typeof hash1, 'string');
assert.strictEqual(hash1.length, 128, 'SHA-512 hex output should be 128 characters');
console.log('✔ Test 2: PBKDF2 salt hashing passed.');

// 3. Test In-Memory / File Persistent User Store Flow
const mockUsers = [];

function registerUser({ email, password, phone }) {
  if (email && isDisposableEmail(email)) {
    return { status: 400, error: 'Disposable and fake email domains are not allowed.' };
  }
  const existing = mockUsers.find(u => (email && u.email === email) || (phone && u.phone === phone));
  if (existing) {
    return { status: 409, error: 'An account with this email or phone number already exists.' };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user = {
    id: `user-${Date.now()}`,
    email,
    phone,
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date().toISOString()
  };
  mockUsers.push(user);
  return { status: 201, user: { id: user.id, email: user.email, phone: user.phone } };
}

function loginUser({ identifier, password }) {
  const user = mockUsers.find(u => u.email === identifier || u.phone === identifier);
  if (!user) {
    return { status: 401, error: 'Invalid email or password.' };
  }
  const attemptHash = hashPassword(password, user.passwordSalt);
  if (attemptHash !== user.passwordHash) {
    return { status: 401, error: 'Invalid email or password.' };
  }
  return {
    status: 200,
    token: `token_${user.id}`,
    user: { id: user.id, email: user.email, phone: user.phone }
  };
}

// Test Registration
const regFake = registerUser({ email: 'fake@trashmail.com', password: 'password123' });
assert.strictEqual(regFake.status, 400, 'Should reject disposable email with 400');

const regValid = registerUser({ email: 'usman.iqbal@gmail.com', password: 'MySecurePassword99!' });
assert.strictEqual(regValid.status, 201, 'Should register valid user with 201');
assert.strictEqual(regValid.user.passwordHash, undefined, 'Must not leak password hash in response');

const regDup = registerUser({ email: 'usman.iqbal@gmail.com', password: 'DifferentPassword123' });
assert.strictEqual(regDup.status, 409, 'Should reject duplicate email with 409 Conflict');
console.log('✔ Test 3: User registration and duplicate prevention passed.');

// Test Login
const loginWrongPass = loginUser({ identifier: 'usman.iqbal@gmail.com', password: 'IncorrectPassword' });
assert.strictEqual(loginWrongPass.status, 401, 'Should reject invalid password with 401');

const loginUnknownUser = loginUser({ identifier: 'unknown@gmail.com', password: 'SomePassword' });
assert.strictEqual(loginUnknownUser.status, 401, 'Should reject unknown user with 401');

const loginSuccess = loginUser({ identifier: 'usman.iqbal@gmail.com', password: 'MySecurePassword99!' });
assert.strictEqual(loginSuccess.status, 200, 'Should succeed login with correct credentials');
assert.strictEqual(typeof loginSuccess.token, 'string');
assert.strictEqual(loginSuccess.user.email, 'usman.iqbal@gmail.com');
assert.strictEqual(loginSuccess.user.passwordHash, undefined, 'Must never leak passwordHash');
console.log('✔ Test 4: Credential verification and token issuance passed.');

console.log('\n========================================');
console.log('ALL WEB-APP AUTHENTICATION TESTS PASSED!');
console.log('========================================');
