import { ProposalStatus, UserRole } from '@wasl/shared-types';
import { ProposalStateMachine } from './proposal.service.js';

export interface StoredProposal {
  id: string;
  initiatorCandidateId: string;
  recipientCandidateId: string;
  currentStatus: ProposalStatus;
  isActive: boolean;
  lastActionBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredProposalEvent {
  id: string;
  proposalId: string;
  fromStatus: ProposalStatus;
  toStatus: ProposalStatus;
  actorUserId: string;
  actorRole: UserRole;
  reasonNote?: string;
  createdAt: Date;
}

export class ProposalStoreService {
  private static proposals = new Map<string, StoredProposal>();
  private static events: StoredProposalEvent[] = [];

  static async createProposal(
    initiatorCandidateId: string,
    recipientCandidateId: string,
    actorUserId: string,
    actorRole: UserRole
  ): Promise<{ proposal: StoredProposal; event: StoredProposalEvent }> {
    const proposalId = `prop-${Date.now()}`;
    const proposal: StoredProposal = {
      id: proposalId,
      initiatorCandidateId,
      recipientCandidateId,
      currentStatus: ProposalStatus.INTERESTED,
      isActive: true,
      lastActionBy: actorUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.proposals.set(proposalId, proposal);

    const event: StoredProposalEvent = {
      id: `evt-${Date.now()}`,
      proposalId,
      fromStatus: ProposalStatus.DISCOVERED,
      toStatus: ProposalStatus.INTERESTED,
      actorUserId,
      actorRole,
      createdAt: new Date()
    };
    this.events.push(event);

    return { proposal, event };
  }

  static async getProposal(proposalId: string): Promise<StoredProposal | null> {
    return this.proposals.get(proposalId) || null;
  }

  static async getProposalsForCandidate(candidateId: string): Promise<{ proposal: StoredProposal; events: StoredProposalEvent[] }[]> {
    const results: { proposal: StoredProposal; events: StoredProposalEvent[] }[] = [];
    for (const p of this.proposals.values()) {
      if (p.initiatorCandidateId === candidateId || p.recipientCandidateId === candidateId) {
        const evts = this.events.filter(e => e.proposalId === p.id);
        results.push({ proposal: p, events: evts });
      }
    }
    return results;
  }

  static async transitionProposal(
    proposalId: string,
    targetStatus: ProposalStatus,
    actorUserId: string,
    actorRole: UserRole,
    reasonNote?: string
  ): Promise<{ proposal: StoredProposal; event: StoredProposalEvent }> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const evaluation = ProposalStateMachine.evaluateTransition({
      proposalId,
      currentStatus: proposal.currentStatus,
      targetStatus,
      actorUserId,
      actorRole,
      reasonNote
    });

    if (!evaluation.success) {
      throw new Error(evaluation.error || 'State transition failed');
    }

    const fromStatus = proposal.currentStatus;
    proposal.currentStatus = targetStatus;
    proposal.lastActionBy = actorUserId;
    proposal.updatedAt = new Date();
    if (targetStatus === ProposalStatus.WITHDRAWN || targetStatus === ProposalStatus.REJECTED) {
      proposal.isActive = false;
    }

    const event: StoredProposalEvent = {
      id: `evt-${Date.now()}`,
      proposalId,
      fromStatus,
      toStatus: targetStatus,
      actorUserId,
      actorRole,
      reasonNote,
      createdAt: new Date()
    };
    this.events.push(event);

    return { proposal, event };
  }
}
