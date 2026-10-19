import { z } from 'zod';
import { BadgeType, BadgeStatusType } from './enums.js';

export const VerificationBadgeSchema = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string().uuid(),
  badgeType: z.nativeEnum(BadgeType),
  status: z.nativeEnum(BadgeStatusType),
  verifiedAt: z.date().or(z.string()).nullable().optional(),
  expiresAt: z.date().or(z.string()).nullable().optional(),
  verificationMetadata: z.record(z.any()).optional()
});

export const SubmitCnicKycSchema = z.object({
  cnicFrontBase64: z.string().optional(),
  cnicBackBase64: z.string().optional(),
  selfieLivenessBase64: z.string().optional(),
  cnicNumberMasked: z.string().regex(/^\d{5}-\d{7}-\d{1}$/).optional() // e.g. 35201-1234567-1
});

export type VerificationBadge = z.infer<typeof VerificationBadgeSchema>;
export type SubmitCnicKycInput = z.infer<typeof SubmitCnicKycSchema>;
