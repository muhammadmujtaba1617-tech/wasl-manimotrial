import { z } from 'zod';

export const DimensionScoresSchema = z.object({
  location: z.number().min(0).max(20),
  family: z.number().min(0).max(20),
  career: z.number().min(0).max(20),
  religion: z.number().min(0).max(15),
  education: z.number().min(0).max(15),
  lifestyle: z.number().min(0).max(10)
});

export const CompatibilityResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensionScores: DimensionScoresSchema,
  alignments: z.array(z.string()),
  discussionPoints: z.array(z.string()),
  engineVersion: z.string().default('v1.0.0-deterministic'),
  llmExplanation: z.string().optional(),
  llmConversationStarters: z.array(z.string()).optional()
});

export type DimensionScores = z.infer<typeof DimensionScoresSchema>;
export type CompatibilityResult = z.infer<typeof CompatibilityResultSchema>;
