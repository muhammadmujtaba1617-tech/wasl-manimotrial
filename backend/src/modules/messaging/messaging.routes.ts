import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { MessagingService } from './messaging.service.js';
import { authenticate } from '../../middleware/auth.js';

const SendMessageSchema = z.object({
  messageText: z.string().min(1).max(2000)
});

export const messagingRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  // 1. Get messages for a thread (Candidate or permissioned Chaperone)
  app.get('/threads/:threadId/messages', async (request: any, reply) => {
    const { threadId } = request.params;
    const thread = await MessagingService.getThreadById(threadId);
    if (!thread) {
      return reply.status(404).send({ error: 'Conversation thread not found' });
    }

    const canAccess = await MessagingService.canAccessThread(request.user.userId, request.user.role, thread);
    if (!canAccess) {
      return reply.status(403).send({ error: 'Unauthorized to view this conversation' });
    }

    const messages = await MessagingService.getMessagesForThread(threadId);
    return reply.send({ thread, messages });
  });

  // 2. Send message in a thread (scanned by automod)
  app.post('/threads/:threadId/messages', async (request: any, reply) => {
    const { threadId } = request.params;
    const parseResult = SendMessageSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const thread = await MessagingService.getThreadById(threadId);
    if (!thread) {
      return reply.status(404).send({ error: 'Conversation thread not found' });
    }

    try {
      const message = await MessagingService.sendMessage(
        threadId,
        request.user.userId,
        parseResult.data.messageText
      );
      return reply.send({ success: true, message });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
};
