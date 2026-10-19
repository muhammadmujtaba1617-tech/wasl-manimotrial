import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ProposalStatus, UserRole } from '@wasl/shared-types';
import { ProposalStoreService } from './proposal.store.js';
import { CandidateService } from '../candidates/candidate.service.js';
import { MessagingService } from '../messaging/messaging.service.js';
import { authenticate } from '../../middleware/auth.js';

const ExpressInterestSchema = z.object({
  targetCandidateId: z.string().min(3)
});

const TransitionProposalSchema = z.object({
  targetStatus: z.nativeEnum(ProposalStatus),
  reasonNote: z.string().max(500).optional()
});

export const proposalRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  // 1. Express interest
  app.post('/express-interest', async (request, reply) => {
    const parseResult = ExpressInterestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }

    const { proposal, event } = await ProposalStoreService.createProposal(
      candidate.id,
      parseResult.data.targetCandidateId,
      request.user.userId,
      request.user.role
    );

    return reply.send({ success: true, proposal, event });
  });

  // 2. Transition proposal to next stage
  app.post('/:proposalId/transition', async (request: any, reply) => {
    const { proposalId } = request.params;
    const parseResult = TransitionProposalSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const { proposal, event } = await ProposalStoreService.transitionProposal(
        proposalId,
        parseResult.data.targetStatus,
        request.user.userId,
        request.user.role,
        parseResult.data.reasonNote
      );

      // If unlocked SUPERVISED_CHAT, automatically initialize a conversation thread
      let thread = null;
      if (proposal.currentStatus === ProposalStatus.SUPERVISED_CHAT) {
        thread = await MessagingService.getOrCreateThread(proposal.id);
      }

      return reply.send({ success: true, proposal, event, thread });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // 3. Get all active proposals and audit event history for candidate
  app.get('/me', async (request, reply) => {
    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }

    const proposals = await ProposalStoreService.getProposalsForCandidate(candidate.id);
    return reply.send({ proposals });
  });
};
