import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';
import {
  UserRole,
  GenderType,
  MaritalStatusType,
  ReligiousPracticeLevel,
  SectType,
  FamilyStructureType,
  RelocationFlexibilityType,
  FinancialBracketType,
  PhotoBlurRule,
  BadgeType,
  BadgeStatusType
} from '@wasl/shared-types';

describe('Phase 2: Auth, Verification & Profiles Endpoints', () => {
  let app: any;
  let candidateToken: string;
  let moderatorToken: string;
  let candidateUserId: string;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('handles Phone OTP request & verification with JWT token issuance', async () => {
    // 1. Request OTP
    const reqOtpRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/request-otp',
      payload: { phone: '+923001234567' }
    });
    assert.strictEqual(reqOtpRes.statusCode, 200);
    const reqOtpBody = JSON.parse(reqOtpRes.payload);
    assert.strictEqual(reqOtpBody.success, true);

    // 2. Verify OTP as Candidate
    const verifyRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923001234567', code: '123456', role: UserRole.CANDIDATE }
    });
    assert.strictEqual(verifyRes.statusCode, 200);
    const verifyBody = JSON.parse(verifyRes.payload);
    assert.ok(verifyBody.token);
    candidateToken = verifyBody.token;
    candidateUserId = verifyBody.user.id;

    // 3. Obtain Moderator Token
    const modVerifyRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923009999999', code: '123456', role: UserRole.MODERATOR }
    });
    assert.strictEqual(modVerifyRes.statusCode, 200);
    moderatorToken = JSON.parse(modVerifyRes.payload).token;
  });

  it('handles Email OTP request & verification with disposable email blocking', async () => {
    // 1. Valid Email OTP request
    const emailReq = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/email/request-otp',
      payload: { email: 'diaspora.user@london.ac.uk' }
    });
    assert.strictEqual(emailReq.statusCode, 200);
    const emailBody = JSON.parse(emailReq.payload);
    assert.strictEqual(emailBody.success, true);

    // 2. Reject Disposable Email
    const disposableReq = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/email/request-otp',
      payload: { email: 'spammer@temp-mail.org' }
    });
    assert.strictEqual(disposableReq.statusCode, 400);

    // 3. Verify Email OTP
    const emailVerify = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/email/verify-otp',
      payload: { email: 'diaspora.user@london.ac.uk', code: '123456', role: UserRole.CANDIDATE }
    });
    assert.strictEqual(emailVerify.statusCode, 200);
    const verifyBody = JSON.parse(emailVerify.payload);
    assert.ok(verifyBody.token);
    assert.strictEqual(verifyBody.user.email, 'diaspora.user@london.ac.uk');
  });

  it('allows candidate to create base details, profile and upload photo with blur rule', async () => {
    // 1. Base Details
    const baseRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/base',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        displayName: 'Ahmed Khan',
        gender: GenderType.MALE,
        dateOfBirth: '1995-04-12',
        heightCm: 180,
        maritalStatus: MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Lahore',
        currentCountry: 'Pakistan',
        originCity: 'Gujranwala'
      }
    });
    assert.strictEqual(baseRes.statusCode, 200);
    const baseBody = JSON.parse(baseRes.payload);
    assert.strictEqual(baseBody.candidate.base.displayName, 'Ahmed Khan');

    // 2. Structured Profile
    const profileRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/profile',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        educationLevel: "Master's",
        degreeTitle: 'MS Computer Science',
        institutionName: 'LUMS',
        occupationTitle: 'Staff Engineer',
        monthlyIncomeBracket: FinancialBracketType.TIER_4,
        religiousPractice: ReligiousPracticeLevel.MODERATE,
        sect: SectType.SUNNI_HANAFI,
        familyStructureCurrent: FamilyStructureType.NUCLEAR,
        familyStructurePreference: FamilyStructureType.NUCLEAR,
        relocationFlexibility: RelocationFlexibilityType.GLOBAL_FLEXIBLE,
        hobbiesInterests: ['Reading', 'Cricket', 'Travel']
      }
    });
    assert.strictEqual(profileRes.statusCode, 200);

    // 3. Add Photo with Blur Rule
    const photoRes = await app.inject({
      method: 'POST',
      url: '/api/v1/candidates/me/photos',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        storagePath: 's3://wasl-secure-photos/ahmed_1.webp',
        blurRule: PhotoBlurRule.BLUR_UNTIL_MUTUAL_MATCH,
        isPrimary: true
      }
    });
    assert.strictEqual(photoRes.statusCode, 200);
    const photoBody = JSON.parse(photoRes.payload);
    assert.strictEqual(photoBody.photos.length, 1);
    assert.strictEqual(photoBody.photos[0].blurRule, PhotoBlurRule.BLUR_UNTIL_MUTUAL_MATCH);
  });

  it('allows candidate to update preferences and deal-breakers', async () => {
    const prefRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/preferences/me/preferences',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        minAge: 22,
        maxAge: 30,
        minHeightCm: 155,
        maxHeightCm: 175,
        allowedMaritalStatuses: [MaritalStatusType.NEVER_MARRIED],
        allowedSects: [SectType.SUNNI_HANAFI],
        allowedCities: ['Lahore', 'Islamabad'],
        dealBreakers: ['SMOKING', 'DIFFERENT_SECT']
      }
    });
    assert.strictEqual(prefRes.statusCode, 200);
    const prefBody = JSON.parse(prefRes.payload);
    assert.strictEqual(prefBody.preferences.minAge, 22);
    assert.deepStrictEqual(prefBody.preferences.dealBreakers, ['SMOKING', 'DIFFERENT_SECT']);
  });

  it('completes the KYC submission and admin review workflow for discrete badges', async () => {
    // 1. Candidate submits degree document for verification
    const submitRes = await app.inject({
      method: 'POST',
      url: '/api/v1/verification/submit-kyc',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        documentType: 'DEGREE_SCAN',
        encryptedFilePath: 's3://wasl-kyc-encrypted/ahmed_degree.pdf',
        metadata: { institution: 'LUMS', year: 2020 }
      }
    });
    assert.strictEqual(submitRes.statusCode, 200);
    const docId = JSON.parse(submitRes.payload).document.id;

    // 2. Moderator checks admin queue
    const queueRes = await app.inject({
      method: 'GET',
      url: '/api/v1/verification/admin/queue',
      headers: { authorization: `Bearer ${moderatorToken}` }
    });
    assert.strictEqual(queueRes.statusCode, 200);
    const queueBody = JSON.parse(queueRes.payload);
    assert.ok(queueBody.queue.some((d: any) => d.id === docId));

    // 3. Moderator approves document
    const reviewRes = await app.inject({
      method: 'POST',
      url: `/api/v1/verification/admin/review/${docId}`,
      headers: { authorization: `Bearer ${moderatorToken}` },
      payload: {
        decision: 'APPROVE',
        notes: 'HEC verified transcript'
      }
    });
    assert.strictEqual(reviewRes.statusCode, 200);

    // 4. Candidate badges reflect verified education badge
    const badgeRes = await app.inject({
      method: 'GET',
      url: `/api/v1/verification/candidates/${candidateUserId}/badges`
    });
    assert.strictEqual(badgeRes.statusCode, 200);
    const badgeBody = JSON.parse(badgeRes.payload);
    const eduBadge = badgeBody.badges.find((b: any) => b.badgeType === BadgeType.EDUCATION);
    assert.ok(eduBadge, 'Education badge should exist');
    assert.strictEqual(eduBadge.status, BadgeStatusType.VERIFIED);
  });
});
