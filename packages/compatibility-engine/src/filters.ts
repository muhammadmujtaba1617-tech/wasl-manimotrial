import { CandidateScoringProfile, CandidateFilterCriteria } from './types.js';

export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function passesHardFilters(
  candidate: CandidateScoringProfile,
  criteria: CandidateFilterCriteria
): { passed: boolean; failureReasons: string[] } {
  const failureReasons: string[] = [];
  const age = calculateAge(candidate.dateOfBirth);

  // Age Check
  if (age < criteria.minAge || age > criteria.maxAge) {
    failureReasons.push(`Age ${age} outside preferred range [${criteria.minAge}-${criteria.maxAge}]`);
  }

  // Height Check
  if (candidate.heightCm < criteria.minHeightCm || candidate.heightCm > criteria.maxHeightCm) {
    failureReasons.push(`Height ${candidate.heightCm}cm outside preferred range [${criteria.minHeightCm}-${criteria.maxHeightCm}cm]`);
  }

  // Marital Status Check
  if (
    criteria.allowedMaritalStatuses.length > 0 &&
    !criteria.allowedMaritalStatuses.includes(candidate.maritalStatus)
  ) {
    failureReasons.push(`Marital status ${candidate.maritalStatus} not in allowed statuses`);
  }

  // Sect Check
  if (
    criteria.allowedSects &&
    criteria.allowedSects.length > 0 &&
    !criteria.allowedSects.includes(candidate.sect)
  ) {
    failureReasons.push(`Sect ${candidate.sect} not in allowed sects`);
  }

  // Religious Practice Check
  if (
    criteria.allowedReligiousLevels &&
    criteria.allowedReligiousLevels.length > 0 &&
    !criteria.allowedReligiousLevels.includes(candidate.religiousPractice)
  ) {
    failureReasons.push(`Religious level ${candidate.religiousPractice} not in allowed levels`);
  }

  // City Check
  if (
    criteria.allowedCities &&
    criteria.allowedCities.length > 0 &&
    !criteria.allowedCities.map(c => c.toLowerCase()).includes(candidate.currentCity.toLowerCase())
  ) {
    failureReasons.push(`City ${candidate.currentCity} not in allowed cities`);
  }

  return {
    passed: failureReasons.length === 0,
    failureReasons
  };
}
