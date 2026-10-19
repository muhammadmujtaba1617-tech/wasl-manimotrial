import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole, GuardianPermissionKey } from '@wasl/shared-types';
import { db } from '@wasl/database';
import { AuthUserPayload } from './auth.js';

export function requireGuardianPermission(requiredPermission: GuardianPermissionKey) {
  return async (request: FastifyRequest<{ Params: { candidateId?: string }; Body: { candidateId?: string } }>, reply: FastifyReply) => {
    const user = request.user as AuthUserPayload | undefined;
    if (!user) {
      return reply.status(401).send({ error: 'Unauthenticated' });
    }

    // Candidate has direct sovereign access
    if (user.role === UserRole.CANDIDATE) {
      return;
    }

    if (user.role === UserRole.GUARDIAN) {
      const candidateId = request.params?.candidateId || request.body?.candidateId;
      if (!candidateId) {
        return reply.status(400).send({ error: 'candidateId is required for guardian operations' });
      }

      const guardianRecord = await db.guardian.findFirst({
        where: {
          guardianUserId: user.userId,
          candidateId: candidateId,
          isInviteAccepted: true,
          permissions: {
            some: {
              permissionName: requiredPermission,
              isGranted: true,
              revokedAt: null
            }
          }
        }
      });

      if (!guardianRecord) {
        return reply.status(403).send({
          error: `Forbidden: Guardian does not hold active permission '${requiredPermission}' for this candidate`
        });
      }
      return;
    }

    return reply.status(403).send({ error: 'Forbidden: Unauthorized role' });
  };
}
