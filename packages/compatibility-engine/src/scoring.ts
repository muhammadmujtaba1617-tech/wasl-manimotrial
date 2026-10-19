import { CompatibilityResult, RelocationFlexibilityType, FamilyStructureType } from '@wasl/shared-types';
import { CandidateScoringProfile } from './types.js';

export const COMPATIBILITY_ENGINE_VERSION = 'v1.0.0-deterministic';

/**
 * Pure TypeScript deterministic compatibility algorithm.
 * 100-point scale:
 * - Location: 20 pts
 * - Family Structure: 20 pts
 * - Career & Financial: 20 pts
 * - Religious Alignment: 15 pts
 * - Education: 15 pts
 * - Lifestyle & Interests: 10 pts
 */
export function calculateDeterministicCompatibility(
  candA: CandidateScoringProfile,
  candB: CandidateScoringProfile
): CompatibilityResult {
  let location = 0;
  let family = 0;
  let career = 0;
  let religion = 0;
  let education = 0;
  let lifestyle = 0;

  const alignments: string[] = [];
  const discussionPoints: string[] = [];

  // --- 1. Location (20 pts) ---
  const sameCity = candA.currentCity.trim().toLowerCase() === candB.currentCity.trim().toLowerCase();
  if (sameCity) {
    location = 20;
    alignments.push(`Both reside in ${candA.currentCity}`);
  } else if (
    candA.relocationFlexibility === RelocationFlexibilityType.GLOBAL_FLEXIBLE ||
    candB.relocationFlexibility === RelocationFlexibilityType.GLOBAL_FLEXIBLE ||
    candA.relocationFlexibility === RelocationFlexibilityType.ANYWHERE_IN_PAKISTAN ||
    candB.relocationFlexibility === RelocationFlexibilityType.ANYWHERE_IN_PAKISTAN
  ) {
    location = 16;
    alignments.push('Mutually flexible relocation preferences across cities/regions');
    discussionPoints.push(`Relocation coordination between ${candA.currentCity} and ${candB.currentCity}`);
  } else {
    location = 6;
    discussionPoints.push(`Residing in different cities (${candA.currentCity} vs ${candB.currentCity}) with limited relocation flexibility`);
  }

  // --- 2. Family Structure (20 pts) ---
  if (candA.familyStructurePreference === candB.familyStructurePreference) {
    family = 20;
    alignments.push(`Identical preference for ${candA.familyStructurePreference.toLowerCase()} family setup`);
  } else if (
    candA.familyStructurePreference === FamilyStructureType.FLEXIBLE ||
    candB.familyStructurePreference === FamilyStructureType.FLEXIBLE
  ) {
    family = 15;
    alignments.push('Adaptable expectations regarding family living arrangements');
    discussionPoints.push('Living arrangement specifics (joint vs nuclear household dynamics)');
  } else {
    family = 5;
    discussionPoints.push(`Divergent family setup preferences (${candA.familyStructurePreference.toLowerCase()} vs ${candB.familyStructurePreference.toLowerCase()})`);
  }

  // --- 3. Career & Financial Expectations (20 pts) ---
  const aSupportsWork = !candA.careerPreference || candA.careerPreference.toLowerCase().includes('support') || candA.careerPreference.toLowerCase().includes('want');
  const bSupportsWork = !candB.careerPreference || candB.careerPreference.toLowerCase().includes('support') || candB.careerPreference.toLowerCase().includes('want');

  if (aSupportsWork && bSupportsWork) {
    career = 20;
    alignments.push('Mutually supportive professional and career expectations');
  } else if (aSupportsWork || bSupportsWork) {
    career = 14;
    discussionPoints.push('Post-marriage career and work aspirations');
  } else {
    career = 10;
    discussionPoints.push('Differing outlook on post-marriage employment and career');
  }

  // --- 4. Religious Practice & Values (15 pts) ---
  if (candA.religiousPractice === candB.religiousPractice) {
    religion = 15;
    alignments.push(`Matching religious practice level (${candA.religiousPractice.toLowerCase()})`);
  } else if (
    (candA.religiousPractice === 'MODERATE' && candB.religiousPractice === 'PRACTICING') ||
    (candA.religiousPractice === 'PRACTICING' && candB.religiousPractice === 'MODERATE')
  ) {
    religion = 12;
    alignments.push('Close religious outlook with minor practice differences');
  } else {
    religion = 7;
    discussionPoints.push(`Differences in personal religious practice (${candA.religiousPractice.toLowerCase()} vs ${candB.religiousPractice.toLowerCase()})`);
  }

  // --- 5. Education Background (15 pts) ---
  const cleanEduA = candA.educationLevel.trim().toLowerCase();
  const cleanEduB = candB.educationLevel.trim().toLowerCase();
  if (cleanEduA === cleanEduB) {
    education = 15;
    alignments.push(`Matched educational attainment (${candA.educationLevel})`);
  } else {
    education = 11;
  }

  // --- 6. Lifestyle & Hobbies (10 pts) ---
  const hobbiesA = candA.hobbies.map(h => h.trim().toLowerCase());
  const hobbiesB = candB.hobbies.map(h => h.trim().toLowerCase());
  const shared = hobbiesA.filter(h => hobbiesB.includes(h));

  lifestyle = Math.min(10, 4 + shared.length * 2);
  if (shared.length > 0) {
    alignments.push(`Shared interests: ${shared.slice(0, 3).join(', ')}`);
  }

  const overallScore = Math.min(100, location + family + career + religion + education + lifestyle);

  return {
    overallScore,
    dimensionScores: {
      location,
      family,
      career,
      religion,
      education,
      lifestyle
    },
    alignments,
    discussionPoints,
    engineVersion: COMPATIBILITY_ENGINE_VERSION
  };
}
