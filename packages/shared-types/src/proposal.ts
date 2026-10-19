import { z } from 'zod';
import { ProposalStatus, UserRole } from './enums.js';

export const ValidTransitions: Record<ProposalStatus, ProposalStatus[]> = {
  [ProposalStatus.DISCOVERED]: [
    ProposalStatus.INTERESTED,
    ProposalStatus.WITHDRAWN
  ],
  [ProposalStatus.INTERESTED]: [
    ProposalStatus.FAMILY_INTERESTED,
    ProposalStatus.INTRODUCTION_REQUESTED,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.FAMILY_INTERESTED]: [
    ProposalStatus.INTRODUCTION_REQUESTED,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.INTRODUCTION_REQUESTED]: [
    ProposalStatus.SUPERVISED_CHAT,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.SUPERVISED_CHAT]: [
    ProposalStatus.VOICE_VIDEO,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.VOICE_VIDEO]: [
    ProposalStatus.FAMILY_MEETING,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.FAMILY_MEETING]: [
    ProposalStatus.ENGAGED,
    ProposalStatus.WITHDRAWN,
    ProposalStatus.REJECTED
  ],
  [ProposalStatus.ENGAGED]: [
    ProposalStatus.WITHDRAWN
  ],
  [ProposalStatus.WITHDRAWN]: [],
  [ProposalStatus.REJECTED]: []
};

export const ProposalTransitionSchema = z.object({
  proposalId: z.string().uuid(),
  targetStatus: z.nativeEnum(ProposalStatus),
  reasonNote: z.string().max(500).optional(),
  metadata: z.record(z.any()).optional()
});

export type ProposalTransitionInput = z.infer<typeof ProposalTransitionSchema>;
