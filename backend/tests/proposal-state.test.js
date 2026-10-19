"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const shared_types_1 = require("@wasl/shared-types");
const proposal_service_js_1 = require("../src/modules/proposals/proposal.service.js");
(0, node_test_1.describe)('Proposal State Machine & Audit Flow', () => {
    (0, node_test_1.it)('allows standard progression: DISCOVERED -> INTERESTED -> FAMILY_INTERESTED -> INTRODUCTION_REQUESTED', () => {
        // 1. DISCOVERED -> INTERESTED
        const step1 = proposal_service_js_1.ProposalStateMachine.evaluateTransition({
            proposalId: 'prop-1',
            currentStatus: shared_types_1.ProposalStatus.DISCOVERED,
            targetStatus: shared_types_1.ProposalStatus.INTERESTED,
            actorUserId: 'user-cand-1',
            actorRole: shared_types_1.UserRole.CANDIDATE
        });
        node_assert_1.default.strictEqual(step1.success, true);
        node_assert_1.default.strictEqual(step1.toStatus, shared_types_1.ProposalStatus.INTERESTED);
        // 2. INTERESTED -> FAMILY_INTERESTED
        const step2 = proposal_service_js_1.ProposalStateMachine.evaluateTransition({
            proposalId: 'prop-1',
            currentStatus: shared_types_1.ProposalStatus.INTERESTED,
            targetStatus: shared_types_1.ProposalStatus.FAMILY_INTERESTED,
            actorUserId: 'user-guardian-1',
            actorRole: shared_types_1.UserRole.GUARDIAN
        });
        node_assert_1.default.strictEqual(step2.success, true);
        node_assert_1.default.strictEqual(step2.toStatus, shared_types_1.ProposalStatus.FAMILY_INTERESTED);
        // 3. FAMILY_INTERESTED -> INTRODUCTION_REQUESTED
        const step3 = proposal_service_js_1.ProposalStateMachine.evaluateTransition({
            proposalId: 'prop-1',
            currentStatus: shared_types_1.ProposalStatus.FAMILY_INTERESTED,
            targetStatus: shared_types_1.ProposalStatus.INTRODUCTION_REQUESTED,
            actorUserId: 'user-cand-1',
            actorRole: shared_types_1.UserRole.CANDIDATE
        });
        node_assert_1.default.strictEqual(step3.success, true);
        node_assert_1.default.strictEqual(step3.toStatus, shared_types_1.ProposalStatus.INTRODUCTION_REQUESTED);
    });
    (0, node_test_1.it)('rejects illegal jumps in the state machine (e.g. DISCOVERED -> SUPERVISED_CHAT)', () => {
        const invalidStep = proposal_service_js_1.ProposalStateMachine.evaluateTransition({
            proposalId: 'prop-1',
            currentStatus: shared_types_1.ProposalStatus.DISCOVERED,
            targetStatus: shared_types_1.ProposalStatus.SUPERVISED_CHAT,
            actorUserId: 'user-cand-1',
            actorRole: shared_types_1.UserRole.CANDIDATE
        });
        node_assert_1.default.strictEqual(invalidStep.success, false);
        node_assert_1.default.ok(invalidStep.error?.includes('Illegal state transition'));
    });
    (0, node_test_1.it)('allows candidate to withdraw at any active stage', () => {
        const stagesToWithdraw = [
            shared_types_1.ProposalStatus.DISCOVERED,
            shared_types_1.ProposalStatus.INTERESTED,
            shared_types_1.ProposalStatus.FAMILY_INTERESTED,
            shared_types_1.ProposalStatus.INTRODUCTION_REQUESTED,
            shared_types_1.ProposalStatus.SUPERVISED_CHAT,
            shared_types_1.ProposalStatus.VOICE_VIDEO,
            shared_types_1.ProposalStatus.FAMILY_MEETING
        ];
        for (const stage of stagesToWithdraw) {
            const withdrawStep = proposal_service_js_1.ProposalStateMachine.evaluateTransition({
                proposalId: 'prop-1',
                currentStatus: stage,
                targetStatus: shared_types_1.ProposalStatus.WITHDRAWN,
                actorUserId: 'user-cand-1',
                actorRole: shared_types_1.UserRole.CANDIDATE
            });
            node_assert_1.default.strictEqual(withdrawStep.success, true, `Should allow withdrawal from ${stage}`);
        }
    });
});
//# sourceMappingURL=proposal-state.test.js.map