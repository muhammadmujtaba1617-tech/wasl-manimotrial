import {
  GenderType,
  MaritalStatusType,
  ReligiousPracticeLevel,
  SectType,
  FamilyStructureType,
  RelocationFlexibilityType,
  FinancialBracketType
} from '@wasl/shared-types';

export interface CandidateScoringProfile {
  id: string;
  gender: GenderType;
  dateOfBirth: Date | string;
  heightCm: number;
  maritalStatus: MaritalStatusType;
  childrenCount: number;
  currentCity: string;
  currentCountry: string;
  educationLevel: string;
  occupationTitle: string;
  monthlyIncomeBracket: FinancialBracketType;
  religiousPractice: ReligiousPracticeLevel;
  sect: SectType;
  familyStructureCurrent: FamilyStructureType;
  familyStructurePreference: FamilyStructureType;
  relocationFlexibility: RelocationFlexibilityType;
  careerPreference?: string;
  hobbies: string[];
}

export interface CandidateFilterCriteria {
  minAge: number;
  maxAge: number;
  minHeightCm: number;
  maxHeightCm: number;
  allowedMaritalStatuses: MaritalStatusType[];
  allowedSects?: SectType[];
  allowedReligiousLevels?: ReligiousPracticeLevel[];
  allowedCities?: string[];
  dealBreakers: string[];
}
