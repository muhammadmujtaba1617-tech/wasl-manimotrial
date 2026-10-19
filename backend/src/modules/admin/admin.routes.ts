import { FastifyInstance } from 'fastify';
import { adminService, UserAccountStatus, SystemControlsConfig } from './admin.service.js';

export async function adminRoutes(app: FastifyInstance) {
  // GET /api/v1/admin/users
  app.get('/users', async (req) => {
    const { status, search, minReports } = req.query as {
      status?: string;
      search?: string;
      minReports?: string;
    };

    const users = adminService.getAllUsers({
      status,
      search,
      minReports: minReports ? parseInt(minReports, 10) : undefined
    });

    return {
      success: true,
      total: users.length,
      users
    };
  });

  // PUT /api/v1/admin/users/:userId/status
  app.put('/users/:userId/status', async (req, reply) => {
    const { userId } = req.params as { userId: string };
    const { status, reason } = req.body as {
      status: UserAccountStatus;
      reason?: string;
    };

    if (!status) {
      return reply.status(400).send({ error: 'Status is required.' });
    }

    const updated = adminService.updateUserStatus(userId, status, reason);
    if (!updated) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    return {
      success: true,
      message: `User status updated to ${status}.`,
      user: updated
    };
  });

  // DELETE /api/v1/admin/users/:userId (Remove / Ban Scammer)
  app.delete('/users/:userId', async (req, reply) => {
    const { userId } = req.params as { userId: string };
    const removed = adminService.deleteOrRemoveUser(userId);

    if (!removed) {
      return reply.status(404).send({ error: 'User not found or already removed.' });
    }

    return {
      success: true,
      message: `User ${userId} has been permanently purged and banned from the platform.`
    };
  });

  // GET /api/v1/admin/system/controls
  app.get('/system/controls', async () => {
    const controls = adminService.getSystemControls();
    return {
      success: true,
      controls
    };
  });

  // PUT /api/v1/admin/system/controls
  app.put('/system/controls', async (req) => {
    const updates = req.body as Partial<SystemControlsConfig>;
    const updated = adminService.updateSystemControls(updates);
    return {
      success: true,
      message: 'System controls updated successfully.',
      controls: updated
    };
  });
}
