import { FastifyPluginAsync } from 'fastify';
import { persistenceService } from './persistence.service.js';

export const persistenceRoutes: FastifyPluginAsync = async (fastify) => {
  // Register or sync user in persistent database
  fastify.post('/register', async (request, reply) => {
    const body = request.body as {
      phone?: string;
      email?: string;
      role?: 'CANDIDATE' | 'GUARDIAN' | 'ADMIN';
      profile?: any;
    };

    const emailToUse = body.email || body.phone || `user_${Date.now()}@wasl.app`;

    const user = persistenceService.registerUser({
      ...body,
      email: emailToUse
    });
    return reply.code(201).send({
      success: true,
      user,
      message: 'User registered in persistent database.'
    });
  });

  // Get current persistent user record
  fastify.get('/me', async (request, reply) => {
    const all = persistenceService.getAllUsers();
    const user = all[0] || null;
    return reply.send({ user });
  });

  // Get all persistent user records
  fastify.get('/all', async (request, reply) => {
    const all = persistenceService.getAllUsers();
    return reply.send({ success: true, users: all });
  });

  // Get user by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = persistenceService.getUser(id);
    if (!user) {
      return reply.code(404).send({ error: 'User record not found' });
    }
    return reply.send({ success: true, user });
  });

  // Update persistent candidate profile
  fastify.put('/:id/profile', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = persistenceService.updateProfile(id, body);
    if (!updated) {
      return reply.code(404).send({ error: 'User not found' });
    }
    return reply.send({ success: true, user: updated });
  });
};
