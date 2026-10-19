import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';
import {
  UserRole,
  GenderType,
  MaritalStatusType,
  ProposalStatus
} from '@wasl/shared-types';

describe('Phase 5: Proposal Lifecycle & Supervised Chat Endpoints', () => {
  let app: any;
  let candidateTokenA: string;
  let candidateTokenB: string;
  let candidateIdA: string;
  let proposalId: string;
  let threadId: string;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();

    // 1. Authenticate Candidate A (Male)
    const candARes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923001111222', code: '123456', role: UserRole.CANDIDATE }
    });
    candidateTokenA = JSON.parse(candARes.payload).token;

    const candABase = await app.inject({
      method: 'PUT',
      url: '/api/v1/candidates/me/base',
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: {
        displayName: 'Bilal Ahmad',
        gender: GenderType.MALE,
        dateOfBirth: '1995-02-14',
        heightCm: 177,
        maritalStatus: MaritalStatusType.NEVER_MARRIED,
        childrenCount: 0,
        currentCity: 'Lahore',
        currentCountry: 'Pakistan'
      }
    });
    candidateIdA = JSON.parse(candABase.payload).candidate.id;

    // 2. Authenticate Candidate B (Female)
    const candBRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/phone/verify-otp',
      payload: { phone: '+923003333444', code: '123456', role: UserRole.CANDIDATE }
    });
    candidateTokenB = JSON.parse(candBRes.payload).token;
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('progresses proposal through the 8-state relationship funnel', async () => {
    // 1. Express Interest: DISCOVERED -> INTERESTED
    const interestRes = await app.inject({
      method: 'POST',
      url: '/api/v1/proposals/express-interest',
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetCandidateId: 'cand-female-1' }
    });
    assert.strictEqual(interestRes.statusCode, 200);
    const interestBody = JSON.parse(interestRes.payload);
    assert.strictEqual(interestBody.proposal.currentStatus, ProposalStatus.INTERESTED);
    proposalId = interestBody.proposal.id;

    // 2. Family Interest: INTERESTED -> FAMILY_INTERESTED
    const famRes = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetStatus: ProposalStatus.FAMILY_INTERESTED, reasonNote: 'Family gave blessings' }
    });
    assert.strictEqual(famRes.statusCode, 200);
    assert.strictEqual(JSON.parse(famRes.payload).proposal.currentStatus, ProposalStatus.FAMILY_INTERESTED);

    // 3. Request Introduction: FAMILY_INTERESTED -> INTRODUCTION_REQUESTED
    const introRes = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetStatus: ProposalStatus.INTRODUCTION_REQUESTED }
    });
    assert.strictEqual(introRes.statusCode, 200);
    assert.strictEqual(JSON.parse(introRes.payload).proposal.currentStatus, ProposalStatus.INTRODUCTION_REQUESTED);

    // 4. Accept Intro: INTRODUCTION_REQUESTED -> SUPERVISED_CHAT (Unlocks Thread)
    const acceptRes = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenB}` },
      payload: { targetStatus: ProposalStatus.SUPERVISED_CHAT }
    });
    assert.strictEqual(acceptRes.statusCode, 200);
    const acceptBody = JSON.parse(acceptRes.payload);
    assert.strictEqual(acceptBody.proposal.currentStatus, ProposalStatus.SUPERVISED_CHAT);
    assert.ok(acceptBody.thread, 'Conversation thread must be initialized upon chat unlock');
    threadId = acceptBody.thread.id;
  });

  it('handles supervised chat messaging with auto-moderation PII protection', async () => {
    // 1. Send clean message
    const msg1Res = await app.inject({
      method: 'POST',
      url: `/api/v1/messaging/threads/${threadId}/messages`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { messageText: 'Assalam o Alaikum, looking forward to speaking.' }
    });
    assert.strictEqual(msg1Res.statusCode, 200);
    const msg1Body = JSON.parse(msg1Res.payload);
    assert.strictEqual(msg1Body.message.isFlaggedByAutomod, false);

    // 2. Send message with prohibited direct contact phone number
    const msg2Res = await app.inject({
      method: 'POST',
      url: `/api/v1/messaging/threads/${threadId}/messages`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { messageText: 'Here is my direct phone: 0300-1234567, text me on WhatsApp' }
    });
    assert.strictEqual(msg2Res.statusCode, 200);
    const msg2Body = JSON.parse(msg2Res.payload);
    assert.strictEqual(msg2Body.message.isFlaggedByAutomod, true);
    assert.ok(msg2Body.message.automodFlagReason.includes('PHONE') || msg2Body.message.automodFlagReason.includes('SOCIAL'));

    // 3. Fetch thread messages
    const threadFetch = await app.inject({
      method: 'GET',
      url: `/api/v1/messaging/threads/${threadId}/messages`,
      headers: { authorization: `Bearer ${candidateTokenA}` }
    });
    assert.strictEqual(threadFetch.statusCode, 200);
    const threadBody = JSON.parse(threadFetch.payload);
    assert.strictEqual(threadBody.messages.length, 2);
  });

  it('completes proposal funnel through to ENGAGED', async () => {
    // 1. SUPERVISED_CHAT -> VOICE_VIDEO
    const step1 = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetStatus: ProposalStatus.VOICE_VIDEO }
    });
    assert.strictEqual(step1.statusCode, 200);

    // 2. VOICE_VIDEO -> FAMILY_MEETING
    const step2 = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetStatus: ProposalStatus.FAMILY_MEETING }
    });
    assert.strictEqual(step2.statusCode, 200);

    // 3. FAMILY_MEETING -> ENGAGED
    const step3 = await app.inject({
      method: 'POST',
      url: `/api/v1/proposals/${proposalId}/transition`,
      headers: { authorization: `Bearer ${candidateTokenA}` },
      payload: { targetStatus: ProposalStatus.ENGAGED }
    });
    assert.strictEqual(step3.statusCode, 200);
    assert.strictEqual(JSON.parse(step3.payload).proposal.currentStatus, ProposalStatus.ENGAGED);
  });
});
