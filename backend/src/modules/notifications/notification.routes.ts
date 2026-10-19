import { FastifyPluginAsync } from 'fastify';
import { notificationService } from './notification.service.js';

export const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all notifications for current user
  fastify.get('/me', async (request, reply) => {
    const notifications = notificationService.getUserNotifications('default-user');
    const unreadCount = notifications.filter(n => !n.read).length;
    return reply.send({
      notifications,
      unreadCount
    });
  });

  // Mark single notification as read
  fastify.patch('/:id/read', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updated = notificationService.markAsRead(id);
    if (!updated) {
      return reply.code(404).send({ error: 'Notification not found' });
    }
    return reply.send({ success: true, notification: updated });
  });

  // Mark all notifications as read
  fastify.post('/mark-all-read', async (request, reply) => {
    notificationService.markAllAsRead('default-user');
    return reply.send({ success: true });
  });

  // Simulation endpoint for interactive testing / demo triggers
  fastify.post('/simulate', async (request, reply) => {
    const body = request.body as {
      type: 'GUARDIAN' | 'MATCH' | 'PROPOSAL' | 'VERIFICATION' | 'SYSTEM';
      title?: string;
      message?: string;
      actionUrl?: string;
    };

    let title = body.title;
    let message = body.message;
    let actionUrl = body.actionUrl || '/dashboard';

    if (body.type === 'GUARDIAN') {
      title = title || 'Guardian Invite Accepted';
      message = message || 'Tariq Khan (Father) accepted your Guardian Invite.';
      actionUrl = '/family';
    } else if (body.type === 'MATCH') {
      title = title || 'High Compatibility Match';
      message = message || 'You have a new 94% compatibility match in Lahore!';
      actionUrl = '/dashboard';
    } else if (body.type === 'PROPOSAL') {
      title = title || 'Proposal Interaction';
      message = message || 'Zara Khan expressed interest in your proposal.';
      actionUrl = '/proposals';
    } else if (body.type === 'VERIFICATION') {
      title = title || 'Trust & Safety Approval';
      message = message || 'Your Higher Education Badge was approved by Trust & Safety.';
      actionUrl = '/profile';
    }

    const created = notificationService.createNotification({
      userId: 'default-user',
      type: body.type || 'SYSTEM',
      title: title || 'Notification Alert',
      message: message || 'You have a new update.',
      actionUrl
    });

    return reply.code(201).send({
      success: true,
      notification: created
    });
  });
};
