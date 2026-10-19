import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  GenderType,
  MaritalStatusType,
  ReligiousPracticeLevel,
  SectType,
  FamilyStructureType,
  RelocationFlexibilityType,
  FinancialBracketType
} from '@wasl/shared-types';
import {
  calculateDeterministicCompatibility,
  passesHardFilters,
  CandidateScoringProfile,
  CandidateFilterCriteria
} from '../src/index.js';

describe('Deterministic Compatibility Engine', () => {
  const candidateA: CandidateScoringProfile = {
    id: '11111111-1111-1111-1111-111111111111',
    gender: GenderType.MALE,
    dateOfBirth: '1996-05-15', // ~30 years old
    heightCm: 178,
    maritalStatus: MaritalStatusType.NEVER_MARRIED,
    childrenCount: 0,
    currentCity: 'Lahore',
    currentCountry: 'Pakistan',
    educationLevel: "Master's",
    occupationTitle: 'Software Engineer',
    monthlyIncomeBracket: FinancialBracketType.TIER_3,
    religiousPractice: ReligiousPracticeLevel.MODERATE,
    sect: SectType.SUNNI_HANAFI,
    familyStructureCurrent: FamilyStructureType.JOINT,
    familyStructurePreference: FamilyStructureType.JOINT,
    relocationFlexibility: RelocationFlexibilityType.GLOBAL_FLEXIBLE,
    careerPreference: 'Supports spouse working',
    hobbies: ['Reading', 'Hiking', 'Tech']
  };

  const candidateB: CandidateScoringProfile = {
    id: '22222222-2222-2222-2222-222222222222',
    gender: GenderType.FEMALE,
    dateOfBirth: '1998-08-20', // ~28 years old
    heightCm: 165,
    maritalStatus: MaritalStatusType.NEVER_MARRIED,
    childrenCount: 0,
    currentCity: 'Islamabad',
    currentCountry: 'Pakistan',
    educationLevel: "Master's",
    occupationTitle: 'Data Analyst',
    monthlyIncomeBracket: FinancialBracketType.TIER_3,
    religiousPractice: ReligiousPracticeLevel.MODERATE,
    sect: SectType.SUNNI_HANAFI,
    familyStructureCurrent: FamilyStructureType.JOINT,
    familyStructurePreference: FamilyStructureType.JOINT,
    relocationFlexibility: RelocationFlexibilityType.ANYWHERE_IN_PAKISTAN,
    careerPreference: 'Wants to continue career',
    hobbies: ['Reading', 'Travel', 'Photography']
  };

  it('calculates deterministic compatibility matching expected dimensions', () => {
    const result = calculateDeterministicCompatibility(candidateA, candidateB);

    assert.ok(result.overallScore >= 80 && result.overallScore <= 100, `Expected score in 80-100, got ${result.overallScore}`);
    assert.strictEqual(result.dimensionScores.family, 20, 'Family score should be 20 for joint-joint match');
    assert.strictEqual(result.dimensionScores.career, 20, 'Career score should be 20 for supportive-wants to work match');
    assert.strictEqual(result.dimensionScores.education, 15, "Education score should be 15 for Master's-Master's match");
    assert.strictEqual(result.dimensionScores.religion, 15, 'Religion score should be 15 for Moderate-Moderate match');
    assert.ok(result.alignments.length >= 3, 'Should generate key alignment points');
    assert.ok(result.discussionPoints.length >= 1, 'Should generate discussion points for different cities');
  });

  it('correctly passes hard filters when criteria are satisfied', () => {
    const criteria: CandidateFilterCriteria = {
      minAge: 24,
      maxAge: 32,
      minHeightCm: 160,
      maxHeightCm: 180,
      allowedMaritalStatuses: [MaritalStatusType.NEVER_MARRIED],
      allowedSects: [SectType.SUNNI_HANAFI],
      allowedReligiousLevels: [ReligiousPracticeLevel.MODERATE, ReligiousPracticeLevel.PRACTICING],
      dealBreakers: []
    };

    const filterResult = passesHardFilters(candidateB, criteria);
    assert.strictEqual(filterResult.passed, true);
    assert.strictEqual(filterResult.failureReasons.length, 0);
  });

  it('correctly rejects candidates violating hard filters', () => {
    const strictCriteria: CandidateFilterCriteria = {
      minAge: 32, // Candidate B is ~28
      maxAge: 40,
      minHeightCm: 170, // Candidate B is 165cm
      maxHeightCm: 190,
      allowedMaritalStatuses: [MaritalStatusType.DIVORCED], // Candidate B is NEVER_MARRIED
      dealBreakers: []
    };

    const filterResult = passesHardFilters(candidateB, strictCriteria);
    assert.strictEqual(filterResult.passed, false);
    assert.ok(filterResult.failureReasons.length >= 3, 'Should identify multiple filter violations');
  });
});
