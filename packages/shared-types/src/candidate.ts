import { z } from 'zod';
import {
  GenderType,
  MaritalStatusType,
  ReligiousPracticeLevel,
  SectType,
  FamilyStructureType,
  RelocationFlexibilityType,
  FinancialBracketType,
  PhotoBlurRule
} from './enums.js';

export const CandidateBaseSchema = z.object({
  displayName: z.string().min(2).max(100),
  gender: z.nativeEnum(GenderType),
  dateOfBirth: z.string().or(z.date()),
  heightCm: z.number().int().min(100).max(250),
  maritalStatus: z.nativeEnum(MaritalStatusType),
  childrenCount: z.number().int().min(0).default(0),
  currentCity: z.string().min(2).max(100),
  currentCountry: z.string().min(2).max(100).default('Pakistan'),
  originCity: z.string().max(100).optional()
});

export const CandidateProfileSchema = z.object({
  educationLevel: z.string().min(2).max(100), // e.g. Bachelors, Masters, PhD, MBBS
  degreeTitle: z.string().max(150).optional(),
  institutionName: z.string().max(200).optional(),
  occupationTitle: z.string().min(2).max(150),
  companyName: z.string().max(200).optional(),
  monthlyIncomeBracket: z.nativeEnum(FinancialBracketType),
  religiousPractice: z.nativeEnum(ReligiousPracticeLevel),
  sect: z.nativeEnum(SectType).default(SectType.PREFER_NOT_TO_SAY),
  praysFrequency: z.string().max(50).optional(),
  fastsRamadan: z.boolean().default(true),
  hijabOrBeardPreference: z.string().max(100).optional(),
  familyStructureCurrent: z.nativeEnum(FamilyStructureType),
  familyStructurePreference: z.nativeEnum(FamilyStructureType),
  relocationFlexibility: z.nativeEnum(RelocationFlexibilityType),
  housingSituation: z.string().max(100).optional(),
  aboutMe: z.string().max(2000).optional(),
  aboutFamily: z.string().max(2000).optional(),
  hobbiesInterests: z.array(z.string()).default([])
});

export const CandidatePreferencesSchema = z.object({
  minAge: z.number().int().min(18).max(70).default(18),
  maxAge: z.number().int().min(18).max(70).default(60),
  minHeightCm: z.number().int().min(100).max(250).default(120),
  maxHeightCm: z.number().int().min(100).max(250).default(230),
  allowedMaritalStatuses: z.array(z.nativeEnum(MaritalStatusType)),
  allowedSects: z.array(z.nativeEnum(SectType)).optional(),
  allowedReligiousLevels: z.array(z.nativeEnum(ReligiousPracticeLevel)).optional(),
  allowedEducationLevels: z.array(z.string()).optional(),
  allowedCities: z.array(z.string()).optional(),
  relocationAcceptance: z.array(z.nativeEnum(RelocationFlexibilityType)).optional(),
  familyStructureAcceptance: z.array(z.nativeEnum(FamilyStructureType)).optional(),
  careerAfterMarriagePreference: z.string().max(100).optional(),
  dealBreakers: z.array(z.string()).default([])
});

export const ProfilePhotoSchema = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string().uuid(),
  storagePath: z.string(),
  blurredStoragePath: z.string(),
  isPrimary: z.boolean().default(false),
  isVerifiedSelfieMatch: z.boolean().default(false),
  blurRule: z.nativeEnum(PhotoBlurRule).default(PhotoBlurRule.BLUR_UNTIL_MUTUAL_MATCH),
  sortOrder: z.number().int().default(0)
});

export type CandidateBase = z.infer<typeof CandidateBaseSchema>;
export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;
export type CandidatePreferences = z.infer<typeof CandidatePreferencesSchema>;
export type ProfilePhoto = z.infer<typeof ProfilePhotoSchema>;
