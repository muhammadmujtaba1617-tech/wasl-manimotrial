export interface NadraVerifyRequest {
  cnicNumber: string; // 13-digit CNIC e.g. 35202-1234567-1 or 3520212345671
  fullName: string;
  dateOfBirth?: string; // YYYY-MM-DD
  fatherOrHusbandName?: string;
  gender?: 'MALE' | 'FEMALE';
}

export interface NadraCitizenRecord {
  cnic: string;
  fullName: string;
  fatherName: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  isAlive: boolean;
  maritalStatus: string;
  issuanceDate: string;
  expiryDate: string;
}

export interface NadraVerifyResult {
  verified: boolean;
  matchScore: number; // 0 - 100
  cnicNormalized: string;
  citizenRecord?: Partial<NadraCitizenRecord>;
  mismatches?: string[];
  failureReason?: string;
  transactionId: string;
  verifiedAt: string;
}
