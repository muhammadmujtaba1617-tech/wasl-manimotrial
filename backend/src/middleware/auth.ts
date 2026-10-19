import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@wasl/shared-types';

export interface AuthUserPayload {
  userId: string;
  role: UserRole;
  phone?: string;
  email?: string;
  candidateId?: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthUserPayload;
    user: AuthUserPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid Authorization header' });
    }
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
  }
}

export function requireRoles(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as AuthUserPayload | undefined;
    if (!user || !allowedRoles.includes(user.role)) {
      return reply.status(403).send({ error: 'Forbidden: Insufficient role permissions' });
    }
  };
}
