import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  GuardianRelationType,
  GuardianPermissionKey,
  UserRole
} from '@wasl/shared-types';
import { FamilyService } from './family.service.js';
import { CandidateService } from '../candidates/candidate.service.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';

const InviteGuardianRouteSchema = z.object({
  invitedPhone: z.string().min(10).max(20),
  invitedName: z.string().min(2).max(100),
  relationship: z.nativeEnum(GuardianRelationType),
  permissions: z.array(z.nativeEnum(GuardianPermissionKey)).min(1)
});

const UpdatePermissionRouteSchema = z.object({
  permissionName: z.nativeEnum(GuardianPermissionKey),
  isGranted: z.boolean()
});

const SuggestMatchRouteSchema = z.object({
  targetCandidateId: z.string().min(3),
  note: z.string().max(500).optional()
});

export const familyRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate);

  // 1. Candidate invites guardian
  app.post('/invite', { preHandler: [requireRoles([UserRole.CANDIDATE])] }, async (request, reply) => {
    const parseResult = InviteGuardianRouteSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }

    const guardian = await FamilyService.inviteGuardian(candidate.id, parseResult.data);
    return reply.send({ success: true, guardianId: guardian.id, message: 'Guardian invitation sent via SMS' });
  });

  // 2. Guardian accepts invitation
  app.post('/accept-invite', { preHandler: [requireRoles([UserRole.GUARDIAN])] }, async (request, reply) => {
    const guardian = await FamilyService.acceptInvite(request.user.userId, request.user.phone || '');
    if (!guardian) {
      return reply.status(404).send({ error: 'No matching invitation found for this phone number' });
    }
    return reply.send({ success: true, message: 'Invitation accepted', candidateId: guardian.candidateId });
  });

  // 3. Candidate lists active guardians & permissions
  app.get('/guardians', { preHandler: [requireRoles([UserRole.CANDIDATE])] }, async (request, reply) => {
    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }

    const guardians = await FamilyService.getGuardiansForCandidate(candidate.id);
    return reply.send({ guardians });
  });

  // 4. Candidate updates / revokes guardian permission immediately
  app.patch('/permissions/:guardianId', { preHandler: [requireRoles([UserRole.CANDIDATE])] }, async (request: any, reply) => {
    const { guardianId } = request.params;
    const parseResult = UpdatePermissionRouteSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const candidate = await CandidateService.getCandidateByUserId(request.user.userId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate profile not found' });
    }

    try {
      await FamilyService.updatePermission(
        candidate.id,
        guardianId,
        parseResult.data.permissionName,
        parseResult.data.isGranted
      );
      return reply.send({ success: true, message: `Permission '${parseResult.data.permissionName}' updated` });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // 5. Guardian workspace view (Candidate profile summary)
  app.get('/candidates/:candidateId/workspace', { preHandler: [requireRoles([UserRole.GUARDIAN])] }, async (request: any, reply) => {
    const { candidateId } = request.params;
    const canView = FamilyService.hasPermission(request.user.userId, candidateId, GuardianPermissionKey.VIEW_PROFILE);
    if (!canView) {
      return reply.status(403).send({ error: 'Guardian does not hold view_profile permission for this candidate' });
    }

    const candidate = await CandidateService.getCandidateById(candidateId);
    if (!candidate) {
      return reply.status(404).send({ error: 'Candidate not found' });
    }

    const canViewFamily = FamilyService.hasPermission(request.user.userId, candidateId, GuardianPermissionKey.VIEW_FAMILY_INFO);

    return reply.send({
      candidateId: candidate.id,
      displayName: candidate.base.displayName,
      age: new Date().getFullYear() - new Date(candidate.base.dateOfBirth).getFullYear(),
      currentCity: candidate.base.currentCity,
      educationLevel: candidate.profile?.educationLevel,
      occupationTitle: candidate.profile?.occupationTitle,
      familyInfo: canViewFamily ? {
        familyStructureCurrent: candidate.profile?.familyStructureCurrent,
        familyStructurePreference: candidate.profile?.familyStructurePreference,
        aboutFamily: candidate.profile?.aboutFamily
      } : null
    });
  });

  // 6. Guardian suggests a match to candidate
  app.post('/candidates/:candidateId/suggest', { preHandler: [requireRoles([UserRole.GUARDIAN])] }, async (request: any, reply) => {
    const { candidateId } = request.params;
    const parseResult = SuggestMatchRouteSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const suggestion = await FamilyService.suggestMatch(
        request.user.userId,
        candidateId,
        parseResult.data.targetCandidateId,
        parseResult.data.note
      );
      return reply.send({ success: true, suggestion });
    } catch (err: any) {
      return reply.status(403).send({ error: err.message });
    }
  });
};
