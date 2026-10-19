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
  FinancialBracketType
} from '@wasl/shared-types';

describe('Phase 3: Candidate Discovery & Explainable Compatibility Endpoints', () => {
  let app: any;
  let candidateToken: string;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();

    // 1. Authenticate candidate
    const verifyRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923005555555', code: '123456', role: UserRole.CANDIDATE }
    });
    candidateToken = JSON.parse(verifyRes.payload).token;

    // 2. Setup candidate profile
    await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/base',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        displayName: 'Usman Ali',
        gender: GenderType.MALE,
        dateOfBirth: '1995-06-15',
        heightCm: 178,
        maritalStatus: MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Lahore',
        currentCountry: 'Pakistan'
      }
    });

    await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/profile',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        educationLevel: "Master's",
        degreeTitle: 'MBA',
        institutionName: 'LUMS',
        occupationTitle: 'Product Manager',
        monthlyIncomeBracket: FinancialBracketType.TIER_4,
        religiousPractice: ReligiousPracticeLevel.MODERATE,
        sect: SectType.SUNNI_HANAFI,
        familyStructureCurrent: FamilyStructureType.NUCLEAR,
        familyStructurePreference: FamilyStructureType.NUCLEAR,
        relocationFlexibility: RelocationFlexibilityType.GLOBAL_FLEXIBLE,
        hobbiesInterests: ['Reading', 'Cricket', 'Travel']
      }
    });

    // 3. Setup partner preferences
    await app.inject({
      method: 'PUT',
      url: '/api/v1/preferences/me/preferences',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        minAge: 22,
        maxAge: 32,
        minHeightCm: 155,
        maxHeightCm: 175,
        allowedMaritalStatuses: [MaritalStatusType.NEVER_MARRIED],
        allowedSects: [SectType.SUNNI_HANAFI],
        dealBreakers: []
      }
    });
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('retrieves ranked candidate recommendations with deterministic score breakdown and explanations', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/discovery/recommendations',
      headers: { authorization: `Bearer ${candidateToken}` }
    });

    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.ok(Array.isArray(body.recommendations));
    assert.ok(body.recommendations.length > 0, 'Should return candidate recommendations');

    const topMatch = body.recommendations[0];
    assert.strictEqual(topMatch.displayName, 'Fatima Zahra');
    assert.ok(topMatch.compatibility.overallScore >= 80, 'Top match score should be >= 80');
    assert.strictEqual(topMatch.compatibility.dimensionScores.location, 20, 'Location score should be 20 for Lahore match');
    assert.strictEqual(topMatch.compatibility.dimensionScores.family, 20, 'Family score should be 20 for nuclear match');
    assert.strictEqual(topMatch.compatibility.dimensionScores.education, 15, 'Education score should be 15 for matched degrees');

    // Verify Explainability
    assert.ok(topMatch.explanation.summary.includes('Fatima Zahra'), 'Explanation should reference candidate');
    assert.ok(topMatch.explanation.conversationStarters.length >= 1, 'Should provide conversation starters');
  });

  it('fetches granular compatibility detail for a specific candidate match', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/discovery/compatibility/cand-female-1',
      headers: { authorization: `Bearer ${candidateToken}` }
    });

    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.strictEqual(body.targetCandidate.base.displayName, 'Fatima Zahra');
    assert.ok(body.compatibility.alignments.length >= 2, 'Should list explicit alignment points');
    assert.ok(body.explanation.summary.length > 10, 'Should include summary explanation');
  });
});
