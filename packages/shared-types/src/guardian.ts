import { z } from 'zod';
import { GuardianRelationType, GuardianPermissionKey } from './enums.js';

export const InviteGuardianSchema = z.object({
  invitedPhone: z.string().min(10).max(20),
  invitedName: z.string().min(2).max(100),
  relationship: z.nativeEnum(GuardianRelationType),
  permissions: z.array(z.nativeEnum(GuardianPermissionKey)).min(1)
});

export const GuardianPermissionUpdateSchema = z.object({
  guardianId: z.string().uuid(),
  permissionName: z.nativeEnum(GuardianPermissionKey),
  isGranted: z.boolean()
});

export type InviteGuardianInput = z.infer<typeof InviteGuardianSchema>;
export type GuardianPermissionUpdateInput = z.infer<typeof GuardianPermissionUpdateSchema>;
