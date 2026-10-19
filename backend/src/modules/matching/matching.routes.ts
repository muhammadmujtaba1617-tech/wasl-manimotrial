import { FastifyPluginAsync } from 'fastify';
import { DiscoveryService } from './discovery.service.js';
import { authenticate } from '../../middleware/auth.js';

export const matchingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  // Top 10 recommendations feed for candidate
  app.get('/recommendations', async (request, reply) => {
    try {
      const recommendations = await DiscoveryService.getRecommendations(request.user.userId);
      return reply.send({ recommendations });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // Detailed compatibility analysis between candidate & specific match
  app.get('/compatibility/:targetCandidateId', async (request: any, reply) => {
    const { targetCandidateId } = request.params;
    try {
      const detail = await DiscoveryService.getCompatibilityDetail(request.user.userId, targetCandidateId);
      return reply.send(detail);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
};
