import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { UserRole } from '@wasl/shared-types';
import { VerificationService } from './verification.service.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';

const SubmitKycSchema = z.object({
  documentType: z.string().min(3),
  encryptedFilePath: z.string().min(5),
  metadata: z.record(z.any()).optional()
});

const ReviewKycSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT']),
  notes: z.string().max(500).optional()
});

export const verificationRoutes: FastifyPluginAsync = async (app) => {
  // Public/Authenticated Candidate routes
  app.get('/candidates/:candidateId/badges', async (request: any, reply) => {
    const { candidateId } = request.params;
    const badges = await VerificationService.getBadgesForCandidate(candidateId);
    return reply.send({ candidateId, badges });
  });

  // Candidate Document Submission
  app.post('/submit-kyc', { preHandler: [authenticate] }, async (request, reply) => {
    const parseResult = SubmitKycSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const doc = await VerificationService.submitDocumentForReview(
      request.user.userId,
      parseResult.data.documentType,
      parseResult.data.encryptedFilePath,
      parseResult.data.metadata
    );

    return reply.send({ success: true, document: doc });
  });

  // Moderator / Admin KYC review queue
  app.get(
    '/admin/queue',
    { preHandler: [authenticate, requireRoles([UserRole.MODERATOR, UserRole.ADMIN])] },
    async (request, reply) => {
      const queue = await VerificationService.getKycQueue();
      return reply.send({ queue });
    }
  );

  app.post(
    '/admin/review/:docId',
    { preHandler: [authenticate, requireRoles([UserRole.MODERATOR, UserRole.ADMIN])] },
    async (request: any, reply) => {
      const { docId } = request.params;
      const parseResult = ReviewKycSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
      }

      try {
        const reviewedDoc = await VerificationService.reviewDocument(
          docId,
          parseResult.data.decision,
          request.user.userId,
          parseResult.data.notes
        );
        return reply.send({ success: true, document: reviewedDoc });
      } catch (err: any) {
        return reply.status(404).send({ error: err.message });
      }
    }
  );
};
