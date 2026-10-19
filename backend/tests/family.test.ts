import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';
import {
  UserRole,
  GenderType,
  MaritalStatusType,
  GuardianRelationType,
  GuardianPermissionKey
} from '@wasl/shared-types';

describe('Phase 4: Family Mode & Guardian Workspaces Endpoints', () => {
  let app: any;
  let candidateToken: string;
  let guardianToken: string;
  let candidateId: string;
  let guardianRecordId: string;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();

    // 1. Authenticate candidate
    const candVerify = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923007777777', code: '123456', role: UserRole.CANDIDATE }
    });
    candidateToken = JSON.parse(candVerify.payload).token;

    // Create Candidate Base
    const candBase = await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/base',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        displayName: 'Ayesha Siddiqui',
        gender: GenderType.FEMALE,
        dateOfBirth: '1998-10-10',
        heightCm: 168,
        maritalStatus: MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Lahore',
        currentCountry: 'Pakistan'
      }
    });
    candidateId = JSON.parse(candBase.payload).candidate.id;

    // 2. Authenticate guardian user
    const guarVerify = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923008888888', code: '123456', role: UserRole.GUARDIAN }
    });
    guardianToken = JSON.parse(guarVerify.payload).token;
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('allows candidate to invite guardian with scoped permissions', async () => {
    const inviteRes = await app.inject({
      method: 'POST',
      url: '/api/v1/family/invite',
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        invitedPhone: '+923008888888',
        invitedName: 'Mrs. Siddiqui (Mother)',
        relationship: GuardianRelationType.MOTHER,
        permissions: [
          GuardianPermissionKey.VIEW_PROFILE,
          GuardianPermissionKey.SUGGEST_MATCHES,
          GuardianPermissionKey.REVIEW_PROPOSALS
        ]
      }
    });

    assert.strictEqual(inviteRes.statusCode, 200);
    const body = JSON.parse(inviteRes.payload);
    assert.strictEqual(body.success, true);
    guardianRecordId = body.guardianId;
  });

  it('allows guardian to accept invite and view candidate workspace', async () => {
    // 1. Accept Invite
    const acceptRes = await app.inject({
      method: 'POST',
      url: '/api/v1/family/accept-invite',
      headers: { authorization: `Bearer ${guardianToken}` }
    });
    assert.strictEqual(acceptRes.statusCode, 200);

    // 2. View Candidate Workspace
    const workspaceRes = await app.inject({
      method: 'GET',
      url: `/api/v1/family/candidates/${candidateId}/workspace`,
      headers: { authorization: `Bearer ${guardianToken}` }
    });
    assert.strictEqual(workspaceRes.statusCode, 200);
    const workspaceBody = JSON.parse(workspaceRes.payload);
    assert.strictEqual(workspaceBody.displayName, 'Ayesha Siddiqui');
  });

  it('allows guardian to suggest a match and supports immediate candidate revocation', async () => {
    // 1. Guardian suggests match
    const suggestRes = await app.inject({
      method: 'POST',
      url: `/api/v1/family/candidates/${candidateId}/suggest`,
      headers: { authorization: `Bearer ${guardianToken}` },
      payload: {
        targetCandidateId: 'cand-male-1',
        note: 'Good family background and education'
      }
    });
    assert.strictEqual(suggestRes.statusCode, 200);
    const suggestBody = JSON.parse(suggestRes.payload);
    assert.strictEqual(suggestBody.success, true);

    // 2. Candidate immediately revokes suggest_matches permission
    const revokeRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/family/permissions/${guardianRecordId}`,
      headers: { authorization: `Bearer ${candidateToken}` },
      payload: {
        permissionName: GuardianPermissionKey.SUGGEST_MATCHES,
        isGranted: false
      }
    });
    assert.strictEqual(revokeRes.statusCode, 200);

    // 3. Guardian tries to suggest again and is denied (403 Forbidden)
    const deniedSuggestRes = await app.inject({
      method: 'POST',
      url: `/api/v1/family/candidates/${candidateId}/suggest`,
      headers: { authorization: `Bearer ${guardianToken}` },
      payload: {
        targetCandidateId: 'cand-male-2'
      }
    });
    assert.strictEqual(deniedSuggestRes.statusCode, 403);
  });
});
