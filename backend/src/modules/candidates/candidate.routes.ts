import { FastifyPluginAsync } from 'fastify';
import { CandidateBaseSchema, CandidateProfileSchema, PhotoBlurRule } from '@wasl/shared-types';
import { CandidateService } from './candidate.service.js';
import { authenticate } from '../../middleware/auth.js';
import { z } from 'zod';

const PhotoUploadSchema = z.object({
  storagePath: z.string().min(5),
  blurRule: z.nativeEnum(PhotoBlurRule).optional(),
  isPrimary: z.boolean().optional()
});

export const candidateRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  app.get('/me', async (request, reply) => {
    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }
    return reply.send({ candidate });
  });

  app.put('/me/base', async (request, reply) => {
    const parseResult = CandidateBaseSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const candidate = await CandidateService.createOrUpdateBase(request.user.userId, parseResult.data);
    return reply.send({ success: true, candidate });
  });

  app.put('/me/profile', async (request, reply) => {
    const parseResult = CandidateProfileSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const candidate = await CandidateService.updateProfile(request.user.userId, parseResult.data);
      return reply.send({ success: true, candidate });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  app.post('/me/photos', async (request, reply) => {
    const parseResult = PhotoUploadSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const candidate = await CandidateService.addPhoto(request.user.userId, parseResult.data);
      return reply.send({ success: true, photos: candidate.photos });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
};
