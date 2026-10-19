const BASE_URL = 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runFullE2ETest() {
  console.log('====================================================');
  console.log('🧪 WASL / RISHTAOS LIVE END-TO-END VERIFICATION TEST');
  console.log('====================================================\n');

  // 1. Health check
  console.log('👉 [1/8] Testing Backend API Health Endpoint...');
  const health = await request('/health');
  if (!health.ok || health.data.status !== 'ok') {
    throw new Error(`Health check failed: ${JSON.stringify(health)}`);
  }
  console.log(`   ✅ API Online (Engine Version: ${health.data.engineVersion})\n`);

  // 2. Auth OTP Request & Verify
  console.log('👉 [2/8] Testing Phone OTP Authentication & JWT Issuance...');
  const phone = '+923001234567';
  const otpReq = await request('/api/v1/auth/phone/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  });
  if (!otpReq.ok) throw new Error(`OTP Request failed: ${JSON.stringify(otpReq)}`);
  console.log(`   ✅ OTP dispatched to ${phone}: ${otpReq.data.message || 'Success'}`);

  const otpVerify = await request('/api/v1/auth/phone/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code: '123456', role: 'CANDIDATE' })
  });
  if (!otpVerify.ok || !otpVerify.data.token) {
    throw new Error(`OTP Verification failed: ${JSON.stringify(otpVerify)}`);
  }
  const token = otpVerify.data.token;
  const candidateUserId = otpVerify.data.user.id;
  const authHeaders = { authorization: `Bearer ${token}` };
  console.log(`   ✅ JWT Issued for User ID: ${candidateUserId}\n`);

  // 3. Profile Setup & Photo Blur Rule
  console.log('👉 [3/8] Setting Up Profile, Demographics, Preferences & Photo Privacy Blur...');
  const baseRes = await request('/api/v1/candidates/me/base', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      displayName: 'Hamza Tariq',
      gender: 'MALE',
      dateOfBirth: '1996-05-15',
      heightCm: 182,
      maritalStatus: 'NEVER_MARRIED',
      childrenCount: 0,
      currentCity: 'Lahore',
      currentCountry: 'Pakistan',
      originCity: 'Lahore'
    })
  });
  if (!baseRes.ok) throw new Error(`Base profile creation failed: ${JSON.stringify(baseRes)}`);
  console.log(`   ✅ Candidate Demographics: ${baseRes.data.candidate.base.displayName} (${baseRes.data.candidate.base.currentCity})`);

  const profileRes = await request('/api/v1/candidates/me/profile', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      educationLevel: "Master's",
      degreeTitle: 'MS Computer Science',
      institutionName: 'LUMS',
      occupationTitle: 'Software Architect',
      monthlyIncomeBracket: 'TIER_4',
      religiousPractice: 'MODERATE',
      sect: 'SUNNI_HANAFI',
      familyStructureCurrent: 'NUCLEAR',
      familyStructurePreference: 'NUCLEAR',
      relocationFlexibility: 'GLOBAL_FLEXIBLE',
      hobbiesInterests: ['Reading', 'Tech', 'Travel']
    })
  });
  if (!profileRes.ok) throw new Error(`Profile creation failed: ${JSON.stringify(profileRes)}`);

  const prefRes = await request('/api/v1/preferences/me/preferences', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      minAge: 22,
      maxAge: 30,
      minHeightCm: 155,
      maxHeightCm: 175,
      allowedMaritalStatuses: ['NEVER_MARRIED'],
      allowedSects: ['SUNNI_HANAFI'],
      allowedCities: ['Lahore', 'Islamabad'],
      dealBreakers: ['SMOKING']
    })
  });
  if (!prefRes.ok) throw new Error(`Preferences setup failed: ${JSON.stringify(prefRes)}`);

  const photoRes = await request('/api/v1/candidates/me/photos', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      storagePath: 's3://wasl-secure-photos/hamza_1.webp',
      blurRule: 'BLUR_UNTIL_MUTUAL_MATCH',
      isPrimary: true
    })
  });
  if (!photoRes.ok) throw new Error(`Photo upload failed: ${JSON.stringify(photoRes)}`);
  console.log(`   ✅ Photo Privacy Blur rule active: ${photoRes.data.photos[0].blurRule}\n`);

  // 4. KYC Submission & NADRA Verisys Check
  console.log('👉 [4/8] Testing KYC Document Submission & NADRA Identity Verification...');
  const nadraRes = await request('/api/v1/integrations/nadra/verify', {
    method: 'POST',
    body: JSON.stringify({
      cnicNumber: '35202-1234567-1',
      fullName: 'Hamza Tariq',
      fatherOrHusbandName: 'Tariq Mehmood',
      gender: 'MALE'
    })
  });
  if (!nadraRes.ok || !nadraRes.data.verified) {
    throw new Error(`NADRA verification failed: ${JSON.stringify(nadraRes)}`);
  }
  console.log(`   ✅ NADRA Verisys Matched (Score: ${nadraRes.data.matchScore}%, CNIC: ${nadraRes.data.cnicNormalized})`);

  const kycSubmit = await request('/api/v1/verification/submit-kyc', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      documentType: 'DEGREE_SCAN',
      encryptedFilePath: 's3://wasl-kyc-vault/hamza_degree.pdf',
      metadata: { institution: 'LUMS', degree: 'MS CS' }
    })
  });
  if (!kycSubmit.ok) throw new Error(`KYC Submit failed: ${JSON.stringify(kycSubmit)}`);

  // Get moderator token for review
  const modVerify = await request('/api/v1/auth/phone/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone: '+923009999999', code: '123456', role: 'MODERATOR' })
  });
  const modHeaders = { authorization: `Bearer ${modVerify.data.token}` };

  const kycApprove = await request(`/api/v1/verification/admin/review/${kycSubmit.data.document.id}`, {
    method: 'POST',
    headers: modHeaders,
    body: JSON.stringify({
      decision: 'APPROVE',
      notes: 'HEC verified transcript'
    })
  });
  if (!kycApprove.ok) throw new Error(`KYC Admin Approval failed: ${JSON.stringify(kycApprove)}`);
  console.log(`   ✅ Discrete Badge [EDUCATION] issued to Candidate.\n`);

  // 5. Deterministic Compatibility Discovery & AI Explanation
  console.log('👉 [5/8] Running Deterministic 100-Point Compatibility Matching Engine...');
  const discoveryRes = await request('/api/v1/discovery/recommendations', {
    headers: authHeaders
  });
  if (!discoveryRes.ok || !discoveryRes.data.recommendations || discoveryRes.data.recommendations.length === 0) {
    throw new Error(`Discovery failed: ${JSON.stringify(discoveryRes)}`);
  }
  const topMatch = discoveryRes.data.recommendations[0];
  console.log(`   ✅ Top Match Found: ${topMatch.displayName} (${topMatch.age} yrs, ${topMatch.currentCity})`);
  console.log(`      • Total 6D Compatibility Score: ${topMatch.compatibility.overallScore}/100`);
  console.log(`      • AI Summary: "${topMatch.explanation.summary}"\n`);

  // 6. Family Mode & Guardian Oversight
  console.log('👉 [6/8] Testing Family Mode: Guardian Invite, Scoped Permissions & Revocation...');
  const guardianInvite = await request('/api/v1/family/invite', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      invitedName: 'Tariq Mehmood (Father)',
      relationship: 'FATHER',
      invitedPhone: '+923219876543',
      permissions: ['view_profile', 'suggest_matches', 'chaperone_chat']
    })
  });
  if (!guardianInvite.ok) throw new Error(`Guardian invite failed: ${JSON.stringify(guardianInvite)}`);
  const guardianId = guardianInvite.data.guardianId;
  console.log(`   ✅ Guardian SMS Invite dispatched to +923219876543 (Guardian ID: ${guardianId})`);

  const updatePermRes = await request(`/api/v1/family/permissions/${guardianId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      permissionName: 'chaperone_chat',
      isGranted: false
    })
  });
  if (!updatePermRes.ok) {
    throw new Error(`Permission update failed: ${JSON.stringify(updatePermRes)}`);
  }
  console.log(`   ✅ Candidate Scoped Permissions updated immediately: chaperone_chat revoked.\n`);

  // 7. Proposal 8-Stage Funnel & Supervised Chat PII Moderation
  console.log('👉 [7/8] Testing 8-Stage Proposal Progression & Anti-Leak Chat Moderation...');
  const propRes = await request('/api/v1/proposals/express-interest', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      targetCandidateId: topMatch.candidateId
    })
  });
  if (!propRes.ok) throw new Error(`Proposal express-interest failed: ${JSON.stringify(propRes)}`);
  const proposalId = propRes.data.proposal.id;
  console.log(`   ✅ Proposal initiated: Stage [${propRes.data.proposal.currentStatus}]`);

  // Advance stages to SUPERVISED_CHAT
  await request(`/api/v1/proposals/${proposalId}/transition`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ targetStatus: 'INTERESTED' })
  });
  await request(`/api/v1/proposals/${proposalId}/transition`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ targetStatus: 'FAMILY_INTERESTED' })
  });
  await request(`/api/v1/proposals/${proposalId}/transition`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ targetStatus: 'INTRODUCTION_REQUESTED' })
  });
  const chatStage = await request(`/api/v1/proposals/${proposalId}/transition`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ targetStatus: 'SUPERVISED_CHAT' })
  });
  console.log(`   ✅ Proposal safely advanced to: [${chatStage.data.proposal.currentStatus}]`);
  const threadId = chatStage.data.thread ? chatStage.data.thread.id : `thread_${proposalId}`;

  // Test Valid Message in Chat
  const validMsg = await request(`/api/v1/messaging/threads/${threadId}/messages`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      messageText: 'Assalam-o-Alaikum. We look forward to the upcoming family meeting.'
    })
  });
  if (!validMsg.ok) throw new Error(`Valid message failed: ${JSON.stringify(validMsg)}`);
  console.log(`   ✅ Respectful supervised message sent successfully.`);

  // Test Intercepting Premature Phone Number Leak
  const leakMsg = await request(`/api/v1/messaging/threads/${threadId}/messages`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      messageText: 'Call me on WhatsApp directly at 03009998877.'
    })
  });
  if (leakMsg.ok && leakMsg.data.message.isFlaggedByAutomod) {
    console.log(`   🛡️ Contact Leak Intercepted by Auto-Moderation!`);
    console.log(`      Automod Reason: [${leakMsg.data.message.automodFlagReason}] (Flagged for Admin Review)`);
  } else {
    throw new Error(`Failed to intercept contact leak! Response: ${JSON.stringify(leakMsg)}`);
  }
  console.log('');

  // 8. Payment Gateway Initiation & Webhook Callback
  console.log('👉 [8/8] Testing JazzCash & EasyPaisa Payment Gateways...');
  const payInit = await request('/api/v1/payments/initiate', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      candidateId: candidateUserId,
      amount: 2500,
      currency: 'PKR',
      purpose: 'PROPOSAL_CREDITS',
      gateway: 'jazzcash',
      customerPhone: phone
    })
  });
  if (!payInit.ok || payInit.data.status !== 'PENDING') {
    throw new Error(`Payment initiation failed: ${JSON.stringify(payInit)}`);
  }
  console.log(`   ✅ JazzCash Checkout Initiated (Ref: ${payInit.data.transactionRef})`);

  const webhookRes = await request('/api/v1/payments/webhook/jazzcash', {
    method: 'POST',
    body: JSON.stringify({
      pp_ResponseCode: '000',
      pp_TxnRefNo: payInit.data.transactionRef,
      pp_Amount: '250000',
      pp_RetreivalReferenceNo: 'JC_RET_9921'
    })
  });
  if (!webhookRes.ok || webhookRes.data.status !== 'PAID') {
    throw new Error(`Payment webhook failed: ${JSON.stringify(webhookRes)}`);
  }
  console.log(`   ✅ Webhook processed successfully: Transaction status updated to [PAID].\n`);

  console.log('====================================================');
  console.log('🎉 ALL 8 E2E SUB-SYSTEM TESTS PASSED 100% SUCCESSFULLY!');
  console.log('====================================================');
}

runFullE2ETest().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
