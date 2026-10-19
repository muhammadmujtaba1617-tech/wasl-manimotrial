import { FastifyPluginAsync } from 'fastify';
import { CandidatePreferencesSchema } from '@wasl/shared-types';
import { PreferencesService } from './preferences.service.js';
import { authenticate } from '../../middleware/auth.js';

export const preferencesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  app.get('/me/preferences', async (request, reply) => {
    const preferences = await PreferencesService.getPreferences(request.user.userId);
    return reply.send({ preferences });
  });

  app.put('/me/preferences', async (request, reply) => {
    const parseResult = CandidatePreferencesSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const saved = await PreferencesService.savePreferences(request.user.userId, parseResult.data);
    return reply.send({ success: true, preferences: saved });
  });
};
