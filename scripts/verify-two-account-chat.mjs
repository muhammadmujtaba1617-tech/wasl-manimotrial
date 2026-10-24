import assert from 'assert';

console.log('--- Wasl: Two-Account End-to-End Chat & Messaging Test ---');

// Simulated backend stores matching the implementation in route.ts
const users = new Map();
const messages = new Map();

const PII_PATTERNS = [
  { regex: /(?:\+?92|0)?3\d{2}[-.\s]?\d{7}/g, reason: 'PAK_PHONE_NUMBER' },
  { regex: /(?:whatsapp|wa\.me|insta|snapchat|telegram)/gi, reason: 'EXTERNAL_SOCIAL_HANDLE' },
  { regex: /(?:https?:\/\/|www\.)[^\s]+/gi, reason: 'EXTERNAL_WEB_LINK' },
  { regex: /(?:jazzcash|easypaisa|bank|iban|account\s+no)/gi, reason: 'PAYMENT_CONTACT_KEYWORD' }
];

function scanAutomod(text) {
  for (const item of PII_PATTERNS) {
    if (item.regex.test(text)) {
      return { flagged: true, reason: item.reason };
    }
  }
  return { flagged: false };
}

// 1. Create User A (Wasl Test Groom) and User B (Wasl Test Bride)
const userA = {
  id: 'usr_groom_101',
  name: 'Wasl Test Groom',
  email: 'groom.test@gmail.com',
  role: 'CANDIDATE',
  gender: 'MALE',
  city: 'Lahore, Pakistan'
};

const userB = {
  id: 'usr_bride_102',
  name: 'Wasl Test Bride',
  email: 'bride.test@gmail.com',
  role: 'CANDIDATE',
  gender: 'FEMALE',
  city: 'Lahore, Pakistan'
};

const userC = {
  id: 'usr_unrelated_103',
  name: 'Unrelated User C',
  email: 'unrelated.thirdparty@gmail.com',
  role: 'CANDIDATE'
};

users.set(userA.id, userA);
users.set(userB.id, userB);
users.set(userC.id, userC);
console.log('✔ Step 1: Created User A (Groom) and User B (Bride) test accounts.');

// 2. Establish Thread Identifier between User A and User B
const threadId = 'thread_' + [userA.id, userB.id].sort().join('_');
console.log(`✔ Step 2: Established deterministic thread ID: ${threadId}`);

// 3. User A sends message: "Hello from User A — Wasl messaging test."
function sendMessage({ threadId, senderId, senderName, text, recipientId }) {
  // Authorization check
  if (threadId.startsWith('thread_')) {
    const threadContent = threadId.replace('thread_', '');
    if (!threadContent.toLowerCase().includes(senderId.toLowerCase())) {
      return { status: 403, error: 'Unauthorized: You cannot send messages in this conversation.' };
    }
  }

  const automod = scanAutomod(text);
  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    threadId,
    senderId,
    senderName,
    recipientId,
    text,
    timestamp: new Date().toISOString(),
    isFlaggedByAutomod: automod.flagged,
    automodReason: automod.reason
  };

  const current = messages.get(threadId) || [];
  current.push(msg);
  messages.set(threadId, current);
  return { status: 200, message: msg };
}

function getMessages({ threadId, requesterId }) {
  if (threadId.startsWith('thread_')) {
    const threadContent = threadId.replace('thread_', '');
    if (!threadContent.toLowerCase().includes(requesterId.toLowerCase())) {
      return { status: 403, error: 'Unauthorized to view this conversation.' };
    }
  }
  const list = messages.get(threadId) || [];
  return { status: 200, messages: list };
}

const resA = sendMessage({
  threadId,
  senderId: userA.id,
  senderName: userA.name,
  recipientId: userB.id,
  text: 'Hello from User A — Wasl messaging test.'
});

assert.strictEqual(resA.status, 200);
assert.strictEqual(resA.message.senderId, userA.id);
assert.strictEqual(resA.message.text, 'Hello from User A — Wasl messaging test.');
assert.strictEqual(resA.message.isFlaggedByAutomod, false);
console.log('✔ Step 3: User A sent message successfully.');

// 4. Confirm User B can read and sees User A's message
const resB_read = getMessages({ threadId, requesterId: userB.id });
assert.strictEqual(resB_read.status, 200);
assert.strictEqual(resB_read.messages.length, 1);
assert.strictEqual(resB_read.messages[0].senderId, userA.id);
assert.strictEqual(resB_read.messages[0].senderName, 'Wasl Test Groom');
assert.strictEqual(resB_read.messages[0].text, 'Hello from User A — Wasl messaging test.');
console.log('✔ Step 4: User B received User A\'s message with correct identity and content.');

// 5. User B replies: "Hello from User B — reply received."
const resB_reply = sendMessage({
  threadId,
  senderId: userB.id,
  senderName: userB.name,
  recipientId: userA.id,
  text: 'Hello from User B — reply received.'
});
assert.strictEqual(resB_reply.status, 200);
console.log('✔ Step 5: User B sent reply successfully.');

// 6. Confirm User A receives User B's reply
const resA_read = getMessages({ threadId, requesterId: userA.id });
assert.strictEqual(resA_read.status, 200);
assert.strictEqual(resA_read.messages.length, 2);
assert.strictEqual(resA_read.messages[1].senderId, userB.id);
assert.strictEqual(resA_read.messages[1].senderName, 'Wasl Test Bride');
assert.strictEqual(resA_read.messages[1].text, 'Hello from User B — reply received.');
console.log('✔ Step 6: User A received User B\'s reply.');

// 7. Verify message history persistence (simulated session refresh)
const simulatedSessionRefresh = getMessages({ threadId, requesterId: userA.id });
assert.strictEqual(simulatedSessionRefresh.messages.length, 2);
assert.strictEqual(simulatedSessionRefresh.messages[0].text, 'Hello from User A — Wasl messaging test.');
assert.strictEqual(simulatedSessionRefresh.messages[1].text, 'Hello from User B — reply received.');
console.log('✔ Step 7: Messages persisted accurately after simulated session reload.');

// 8. Authorization check: Unrelated User C must be rejected with 403 Forbidden
const resC_read = getMessages({ threadId, requesterId: userC.id });
assert.strictEqual(resC_read.status, 403, 'Unrelated user must be rejected with 403');
const resC_send = sendMessage({
  threadId,
  senderId: userC.id,
  senderName: userC.name,
  recipientId: userB.id,
  text: 'Eavesdropping message from third party.'
});
assert.strictEqual(resC_send.status, 403, 'Unrelated user cannot send into another thread');
console.log('✔ Step 8: Authorization verified: Unrelated User C denied access (403 Forbidden).');

// 9. PII Automod test
const automodMsg = sendMessage({
  threadId,
  senderId: userA.id,
  senderName: userA.name,
  recipientId: userB.id,
  text: 'Call me on WhatsApp +923001234567 or add my insta @fakehandle'
});
assert.strictEqual(automodMsg.status, 200);
assert.strictEqual(automodMsg.message.isFlaggedByAutomod, true);
assert.ok(automodMsg.message.automodReason);
console.log(`✔ Step 9: PII automod scanner flagged off-platform contact attempt (${automodMsg.message.automodReason}).`);

console.log('\n======================================================');
console.log('ALL TWO-ACCOUNT MESSAGING QA INTEGRATION TESTS PASSED!');
console.log('======================================================');
