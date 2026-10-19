import { ProposalStatus, UserRole, ValidTransitions } from '@wasl/shared-types';

export interface StateTransitionRequest {
  proposalId: string;
  currentStatus: ProposalStatus;
  targetStatus: ProposalStatus;
  actorUserId: string;
  actorRole: UserRole;
  reasonNote?: string;
  metadata?: Record<string, any>;
}

export interface StateTransitionResult {
  success: boolean;
  error?: string;
  fromStatus: ProposalStatus;
  toStatus: ProposalStatus;
}

export class ProposalStateMachine {
  /**
   * Validates whether a state transition is permitted under business rules
   */
  static validateTransition(fromStatus: ProposalStatus, toStatus: ProposalStatus): { valid: boolean; error?: string } {
    const allowed = ValidTransitions[fromStatus];
    if (!allowed || !allowed.includes(toStatus)) {
      return {
        valid: false,
        error: `Illegal state transition from ${fromStatus} to ${toStatus}. Allowed transitions: [${(allowed || []).join(', ')}]`
      };
    }
    return { valid: true };
  }

  /**
   * Evaluates transition request with role-based constraints
   */
  static evaluateTransition(req: StateTransitionRequest): StateTransitionResult {
    const validation = this.validateTransition(req.currentStatus, req.targetStatus);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        fromStatus: req.currentStatus,
        toStatus: req.targetStatus
      };
    }

    // Role-specific transition rules
    if (req.targetStatus === ProposalStatus.FAMILY_INTERESTED) {
      if (req.actorRole !== UserRole.GUARDIAN && req.actorRole !== UserRole.CANDIDATE) {
        return {
          success: false,
          error: 'Only candidate or invited guardian can progress to FAMILY_INTERESTED',
          fromStatus: req.currentStatus,
          toStatus: req.targetStatus
        };
      }
    }

    if (req.targetStatus === ProposalStatus.SUPERVISED_CHAT) {
      // Must be accepted by the receiving party or candidate
      if (req.actorRole !== UserRole.CANDIDATE && req.actorRole !== UserRole.ADMIN) {
        return {
          success: false,
          error: 'Direct candidate consent required to unlock SUPERVISED_CHAT',
          fromStatus: req.currentStatus,
          toStatus: req.targetStatus
        };
      }
    }

    return {
      success: true,
      fromStatus: req.currentStatus,
      toStatus: req.targetStatus
    };
  }
}
