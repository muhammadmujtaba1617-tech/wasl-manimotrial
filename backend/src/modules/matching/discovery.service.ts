import {
  CandidateScoringProfile,
  CandidateFilterCriteria,
  calculateDeterministicCompatibility,
  passesHardFilters
} from '@wasl/compatibility-engine';
import { CompatibilityResult, GenderType, MaritalStatusType, ReligiousPracticeLevel, SectType, FamilyStructureType, RelocationFlexibilityType, FinancialBracketType } from '@wasl/shared-types';
import { CandidateService, StoredCandidate } from '../candidates/candidate.service.js';
import { PreferencesService } from '../preferences/preferences.service.js';
import { VerificationService } from '../verification/verification.service.js';

export interface DiscoveryRecommendation {
  candidateId: string;
  displayName: string;
  gender: GenderType;
  age: number;
  heightCm: number;
  currentCity: string;
  educationLevel: string;
  occupationTitle: string;
  compatibility: CompatibilityResult;
  verificationBadgeCount: number;
  primaryPhotoUrl?: string;
  explanation: {
    summary: string;
    conversationStarters: string[];
  };
}

export class DiscoveryService {
  /**
   * Generates natural language explanation and conversation starters from deterministic scores
   */
  static generateExplanation(result: CompatibilityResult, candidateName: string): { summary: string; conversationStarters: string[] } {
    const alignmentText = result.alignments.slice(0, 2).join(' and ');
    const discussionText = result.discussionPoints.length > 0 ? result.discussionPoints[0] : 'lifestyle goals';

    const summary = `You and ${candidateName} show strong alignment on ${alignmentText.toLowerCase()}. A constructive area to explore is ${discussionText.toLowerCase()}.`;

    const conversationStarters: string[] = [];
    if (result.discussionPoints.length > 0) {
      conversationStarters.push(`How do you approach ${result.discussionPoints[0].toLowerCase()} when planning for the future?`);
    } else {
      conversationStarters.push(`What are your favorite weekend routines and personal interests?`);
    }

    if (result.alignments.length > 0) {
      conversationStarters.push(`I noticed we both value ${result.alignments[0].toLowerCase()}—what does that look like for you day-to-day?`);
    }

    return {
      summary,
      conversationStarters
    };
  }

  /**
   * Helper to convert StoredCandidate to CandidateScoringProfile
   */
  static toScoringProfile(cand: StoredCandidate): CandidateScoringProfile {
    return {
      id: cand.id,
      gender: cand.base.gender,
      dateOfBirth: cand.base.dateOfBirth,
      heightCm: cand.base.heightCm,
      maritalStatus: cand.base.maritalStatus,
      childrenCount: cand.base.childrenCount,
      currentCity: cand.base.currentCity,
      currentCountry: cand.base.currentCountry,
      educationLevel: cand.profile?.educationLevel || 'Bachelors',
      occupationTitle: cand.profile?.occupationTitle || 'Professional',
      monthlyIncomeBracket: cand.profile?.monthlyIncomeBracket || FinancialBracketType.TIER_3,
      religiousPractice: cand.profile?.religiousPractice || ReligiousPracticeLevel.MODERATE,
      sect: cand.profile?.sect || SectType.SUNNI_HANAFI,
      familyStructureCurrent: cand.profile?.familyStructureCurrent || FamilyStructureType.NUCLEAR,
      familyStructurePreference: cand.profile?.familyStructurePreference || FamilyStructureType.NUCLEAR,
      relocationFlexibility: cand.profile?.relocationFlexibility || RelocationFlexibilityType.GLOBAL_FLEXIBLE,
      careerPreference: cand.profile?.hijabOrBeardPreference || 'Supports working',
      hobbies: cand.profile?.hobbiesInterests || []
    };
  }

  /**
   * Get top ranked recommendations for authenticated candidate
   */
  static async getRecommendations(userId: string): Promise<DiscoveryRecommendation[]> {
    const subjectCandidate = await CandidateService.getCandidateByUserId(userId);
    if (!subjectCandidate || !subjectCandidate.profile) {
      throw new Error('Please complete your profile before viewing recommendations');
    }

    const preferences = await PreferencesService.getPreferences(userId);
    const subjectProfile = this.toScoringProfile(subjectCandidate);

    const filterCriteria: CandidateFilterCriteria = preferences ? {
      minAge: preferences.minAge,
      maxAge: preferences.maxAge,
      minHeightCm: preferences.minHeightCm,
      maxHeightCm: preferences.maxHeightCm,
      allowedMaritalStatuses: preferences.allowedMaritalStatuses,
      allowedSects: preferences.allowedSects,
      allowedReligiousLevels: preferences.allowedReligiousLevels,
      allowedCities: preferences.allowedCities,
      dealBreakers: preferences.dealBreakers
    } : {
      minAge: 18,
      maxAge: 60,
      minHeightCm: 120,
      maxHeightCm: 220,
      allowedMaritalStatuses: [MaritalStatusType.NEVER_MARRIED, MaritalStatusType.DIVORCED],
      dealBreakers: []
    };

    // Retrieve test/mock candidate pool (or from DB in production)
    const candidatesPool = this.getMockPool(subjectCandidate.base.gender);
    const recommendations: DiscoveryRecommendation[] = [];

    for (const rawCand of candidatesPool) {
      const candProfile = this.toScoringProfile(rawCand);

      // 1. Opposite gender check
      if (candProfile.gender === subjectProfile.gender) continue;

      // 2. Hard filter elimination
      const filterRes = passesHardFilters(candProfile, filterCriteria);
      if (!filterRes.passed) continue;

      // 3. Deterministic scoring
      const compatibility = calculateDeterministicCompatibility(subjectProfile, candProfile);

      // 4. Badges & explanation
      const badges = await VerificationService.getBadgesForCandidate(rawCand.userId);
      const verifiedCount = badges.filter(b => b.status === 'VERIFIED').length;
      const explanation = this.generateExplanation(compatibility, rawCand.base.displayName);

      const dob = new Date(rawCand.base.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();

      recommendations.push({
        candidateId: rawCand.id,
        displayName: rawCand.base.displayName,
        gender: rawCand.base.gender,
        age,
        heightCm: rawCand.base.heightCm,
        currentCity: rawCand.base.currentCity,
        educationLevel: rawCand.profile?.educationLevel || 'Bachelors',
        occupationTitle: rawCand.profile?.occupationTitle || 'Professional',
        compatibility,
        verificationBadgeCount: verifiedCount,
        primaryPhotoUrl: rawCand.photos.find(p => p.isPrimary)?.storagePath,
        explanation
      });
    }

    // Recommendation Ranking: Score desc -> Verification badges count desc
    recommendations.sort((a, b) => {
      if (b.compatibility.overallScore !== a.compatibility.overallScore) {
        return b.compatibility.overallScore - a.compatibility.overallScore;
      }
      return b.verificationBadgeCount - a.verificationBadgeCount;
    });

    return recommendations.slice(0, 10);
  }

  /**
   * Get detailed compatibility breakdown between two specific candidates
   */
  static async getCompatibilityDetail(
    userId: string,
    targetCandidateId: string
  ): Promise<{ targetCandidate: StoredCandidate; compatibility: CompatibilityResult; explanation: any }> {
    const subjectCandidate = await CandidateService.getCandidateByUserId(userId);
    if (!subjectCandidate || !subjectCandidate.profile) {
      throw new Error('Please complete your profile to view compatibility');
    }

    // Lookup target candidate from pool or candidate store
    let target = await CandidateService.getCandidateById(targetCandidateId);
    if (!target) {
      const pool = this.getMockPool(subjectCandidate.base.gender);
      target = pool.find(c => c.id === targetCandidateId) || null;
    }

    if (!target || !target.profile) {
      throw new Error('Target candidate profile not found');
    }

    const subjectProfile = this.toScoringProfile(subjectCandidate);
    const targetProfile = this.toScoringProfile(target);

    const compatibility = calculateDeterministicCompatibility(subjectProfile, targetProfile);
    const explanation = this.generateExplanation(compatibility, target.base.displayName);

    return {
      targetCandidate: target,
      compatibility,
      explanation
    };
  }

  private static getMockPool(subjectGender: GenderType): StoredCandidate[] {
    const targetGender = subjectGender === GenderType.MALE ? GenderType.FEMALE : GenderType.MALE;

    if (targetGender === GenderType.FEMALE) {
      return [
        {
          id: 'cand-female-1',
          userId: 'usr-female-1',
          base: {
            displayName: 'Fatima Zahra',
            gender: GenderType.FEMALE,
            dateOfBirth: '1997-09-14',
            heightCm: 165,
            maritalStatus: MaritalStatusType.NEVER_MARRIED,
            childrenCount: 0,
            currentCity: 'Lahore',
            currentCountry: 'Pakistan',
            originCity: 'Lahore'
          },
          profile: {
            educationLevel: "Master's",
            degreeTitle: 'MBA Marketing',
            institutionName: 'LUMS',
            occupationTitle: 'Marketing Lead',
            companyName: 'Fintech Co',
            monthlyIncomeBracket: FinancialBracketType.TIER_3,
            religiousPractice: ReligiousPracticeLevel.MODERATE,
            sect: SectType.SUNNI_HANAFI,
            fastsRamadan: true,
            familyStructureCurrent: FamilyStructureType.NUCLEAR,
            familyStructurePreference: FamilyStructureType.NUCLEAR,
            relocationFlexibility: RelocationFlexibilityType.GLOBAL_FLEXIBLE,
            hobbiesInterests: ['Reading', 'Cricket', 'Travel']
          },
          photos: []
        },
        {
          id: 'cand-female-2',
          userId: 'usr-female-2',
          base: {
            displayName: 'Zainab Bibi',
            gender: GenderType.FEMALE,
            dateOfBirth: '1998-03-20',
            heightCm: 162,
            maritalStatus: MaritalStatusType.NEVER_MARRIED,
            childrenCount: 0,
            currentCity: 'Islamabad',
            currentCountry: 'Pakistan',
            originCity: 'Rawalpindi'
          },
          profile: {
            educationLevel: "Master's",
            degreeTitle: 'MS Data Science',
            institutionName: 'NUST',
            occupationTitle: 'Data Analyst',
            monthlyIncomeBracket: FinancialBracketType.TIER_3,
            religiousPractice: ReligiousPracticeLevel.MODERATE,
            sect: SectType.SUNNI_HANAFI,
            fastsRamadan: true,
            familyStructureCurrent: FamilyStructureType.JOINT,
            familyStructurePreference: FamilyStructureType.JOINT,
            relocationFlexibility: RelocationFlexibilityType.ANYWHERE_IN_PAKISTAN,
            hobbiesInterests: ['Reading', 'Baking', 'Tech']
          },
          photos: []
        }
      ];
    } else {
      return [
        {
          id: 'cand-male-1',
          userId: 'usr-male-1',
          base: {
            displayName: 'Hamza Tariq',
            gender: GenderType.MALE,
            dateOfBirth: '1994-06-10',
            heightCm: 182,
            maritalStatus: MaritalStatusType.NEVER_MARRIED,
            childrenCount: 0,
            currentCity: 'Lahore',
            currentCountry: 'Pakistan'
          },
          profile: {
            educationLevel: "Master's",
            degreeTitle: 'MS Computer Engineering',
            institutionName: 'GIKI',
            occupationTitle: 'Engineering Manager',
            monthlyIncomeBracket: FinancialBracketType.TIER_4,
            religiousPractice: ReligiousPracticeLevel.MODERATE,
            sect: SectType.SUNNI_HANAFI,
            fastsRamadan: true,
            familyStructureCurrent: FamilyStructureType.NUCLEAR,
            familyStructurePreference: FamilyStructureType.NUCLEAR,
            relocationFlexibility: RelocationFlexibilityType.GLOBAL_FLEXIBLE,
            hobbiesInterests: ['Cricket', 'Travel', 'Coding']
          },
          photos: []
        }
      ];
    }
  }
}
