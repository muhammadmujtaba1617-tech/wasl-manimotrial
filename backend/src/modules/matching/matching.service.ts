import {
  calculateDeterministicCompatibility,
  passesHardFilters,
  CandidateScoringProfile,
  CandidateFilterCriteria
} from '@wasl/compatibility-engine';
import { CompatibilityResult } from '@wasl/shared-types';

export interface ScoredCandidateMatch {
  candidate: CandidateScoringProfile;
  compatibility: CompatibilityResult;
}

export class MatchingService {
  /**
   * Evaluates a list of candidate profiles against a subject's criteria and calculates deterministic compatibility
   */
  static matchCandidates(
    subject: CandidateScoringProfile,
    criteria: CandidateFilterCriteria,
    candidates: CandidateScoringProfile[]
  ): ScoredCandidateMatch[] {
    const scoredMatches: ScoredCandidateMatch[] = [];

    for (const candidate of candidates) {
      if (candidate.id === subject.id) continue;
      if (candidate.gender === subject.gender) continue; // Matrimonial opposite gender check

      // Step 1: Hard filter elimination
      const filterResult = passesHardFilters(candidate, criteria);
      if (!filterResult.passed) {
        continue;
      }

      // Step 2: Deterministic scoring
      const compatibility = calculateDeterministicCompatibility(subject, candidate);

      scoredMatches.push({
        candidate,
        compatibility
      });
    }

    // Sort descending by overall score
    scoredMatches.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);

    return scoredMatches;
  }
}
