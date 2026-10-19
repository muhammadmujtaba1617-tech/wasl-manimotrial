import { FastifyPluginAsync } from 'fastify';
import { safetyService } from './safety.service.js';

export const safetyRoutes: FastifyPluginAsync = async (fastify) => {
  // Block a candidate
  fastify.post('/block', async (request, reply) => {
    const { targetCandidateId } = request.body as { targetCandidateId: string };
    if (!targetCandidateId) {
      return reply.code(400).send({ error: 'targetCandidateId is required' });
    }
    const currentUserId = 'default-user';
    safetyService.blockUser(currentUserId, targetCandidateId);
    return reply.send({
      success: true,
      message: `Candidate ${targetCandidateId} blocked and hidden from discovery feed.`
    });
  });

  // Unblock a candidate
  fastify.post('/unblock', async (request, reply) => {
    const { targetCandidateId } = request.body as { targetCandidateId: string };
    const currentUserId = 'default-user';
    safetyService.unblockUser(currentUserId, targetCandidateId);
    return reply.send({ success: true, message: `Candidate ${targetCandidateId} unblocked.` });
  });

  // Get list of blocked candidates
  fastify.get('/blocked', async (request, reply) => {
    const currentUserId = 'default-user';
    const blocked = safetyService.getBlockedUsers(currentUserId);
    return reply.send({ blocked });
  });

  // Submit candidate report
  fastify.post('/report', async (request, reply) => {
    const body = request.body as {
      reportedCandidateId: string;
      reportedCandidateName: string;
      category:
        | 'INAPPROPRIATE_CONDUCT'
        | 'MISREPRESENTED_DETAILS'
        | 'SUSPICIOUS_COMMERCIAL'
        | 'HARASSMENT'
        | 'FAKE_PROFILE';
      reason: string;
      details?: string;
    };

    if (!body.reportedCandidateId || !body.category || !body.reason) {
      return reply.code(400).send({ error: 'Missing required report parameters' });
    }

    const currentUserId = 'default-user';
    const report = safetyService.createReport({
      reporterId: currentUserId,
      reporterName: 'Verified Member',
      reportedCandidateId: body.reportedCandidateId,
      reportedCandidateName: body.reportedCandidateName || body.reportedCandidateId,
      category: body.category,
      reason: body.reason,
      details: body.details
    });

    // Automatically block the reported user as well
    safetyService.blockUser(currentUserId, body.reportedCandidateId);

    return reply.code(201).send({
      success: true,
      report,
      message: 'Report filed successfully and candidate has been blocked from your feed.'
    });
  });

  // Admin: Get all candidate reports
  fastify.get('/admin/reports', async (request, reply) => {
    const reports = safetyService.getAllReports();
    return reply.send({ reports });
  });

  // Admin: Resolve candidate report
  fastify.patch('/admin/reports/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: 'WARNED' | 'BANNED' | 'DISMISSED' };
    const updated = safetyService.updateReportStatus(id, status);
    if (!updated) {
      return reply.code(404).send({ error: 'Report not found' });
    }
    return reply.send({ success: true, report: updated });
  });

  // Incognito Mode / Privacy Toggle
  fastify.get('/incognito', async (request, reply) => {
    const currentUserId = 'default-user';
    const isIncognito = safetyService.getIncognitoMode(currentUserId);
    return reply.send({ isIncognito });
  });

  fastify.put('/incognito', async (request, reply) => {
    const currentUserId = 'default-user';
    const { isIncognito } = request.body as { isIncognito: boolean };
    safetyService.setIncognitoMode(currentUserId, Boolean(isIncognito));
    return reply.send({
      success: true,
      isIncognito: Boolean(isIncognito),
      message: isIncognito
        ? 'Incognito mode enabled: Your profile is now visible only to candidates you express interest in first.'
        : 'Incognito mode disabled: Your profile is visible to all compatible verified members.'
    });
  });
};
