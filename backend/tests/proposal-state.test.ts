import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ProposalStatus, UserRole } from '@wasl/shared-types';
import { ProposalStateMachine } from '../src/modules/proposals/proposal.service.js';

describe('Proposal State Machine & Audit Flow', () => {
  it('allows standard progression: DISCOVERED -> INTERESTED -> FAMILY_INTERESTED -> INTRODUCTION_REQUESTED', () => {
    // 1. DISCOVERED -> INTERESTED
    const step1 = ProposalStateMachine.evaluateTransition({
      proposalId: 'prop-1',
      currentStatus: ProposalStatus.DISCOVERED,
      targetStatus: ProposalStatus.INTERESTED,
      actorUserId: 'user-cand-1',
      actorRole: UserRole.CANDIDATE
    });
    assert.strictEqual(step1.success, true);
    assert.strictEqual(step1.toStatus, ProposalStatus.INTERESTED);

    // 2. INTERESTED -> FAMILY_INTERESTED
    const step2 = ProposalStateMachine.evaluateTransition({
      proposalId: 'prop-1',
      currentStatus: ProposalStatus.INTERESTED,
      targetStatus: ProposalStatus.FAMILY_INTERESTED,
      actorUserId: 'user-guardian-1',
      actorRole: UserRole.GUARDIAN
    });
    assert.strictEqual(step2.success, true);
    assert.strictEqual(step2.toStatus, ProposalStatus.FAMILY_INTERESTED);

    // 3. FAMILY_INTERESTED -> INTRODUCTION_REQUESTED
    const step3 = ProposalStateMachine.evaluateTransition({
      proposalId: 'prop-1',
      currentStatus: ProposalStatus.FAMILY_INTERESTED,
      targetStatus: ProposalStatus.INTRODUCTION_REQUESTED,
      actorUserId: 'user-cand-1',
      actorRole: UserRole.CANDIDATE
    });
    assert.strictEqual(step3.success, true);
    assert.strictEqual(step3.toStatus, ProposalStatus.INTRODUCTION_REQUESTED);
  });

  it('rejects illegal jumps in the state machine (e.g. DISCOVERED -> SUPERVISED_CHAT)', () => {
    const invalidStep = ProposalStateMachine.evaluateTransition({
      proposalId: 'prop-1',
      currentStatus: ProposalStatus.DISCOVERED,
      targetStatus: ProposalStatus.SUPERVISED_CHAT,
      actorUserId: 'user-cand-1',
      actorRole: UserRole.CANDIDATE
    });
    assert.strictEqual(invalidStep.success, false);
    assert.ok(invalidStep.error?.includes('Illegal state transition'));
  });

  it('allows candidate to withdraw at any active stage', () => {
    const stagesToWithdraw = [
      ProposalStatus.DISCOVERED,
      ProposalStatus.INTERESTED,
      ProposalStatus.FAMILY_INTERESTED,
      ProposalStatus.INTRODUCTION_REQUESTED,
      ProposalStatus.SUPERVISED_CHAT,
      ProposalStatus.VOICE_VIDEO,
      ProposalStatus.FAMILY_MEETING
    ];

    for (const stage of stagesToWithdraw) {
      const withdrawStep = ProposalStateMachine.evaluateTransition({
        proposalId: 'prop-1',
        currentStatus: stage,
        targetStatus: ProposalStatus.WITHDRAWN,
        actorUserId: 'user-cand-1',
        actorRole: UserRole.CANDIDATE
      });
      assert.strictEqual(withdrawStep.success, true, `Should allow withdrawal from ${stage}`);
    }
  });
});
