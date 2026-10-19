import { CandidateBase, CandidateProfile, PhotoBlurRule } from '@wasl/shared-types';

export interface StoredCandidate {
  id: string;
  userId: string;
  base: CandidateBase;
  profile?: CandidateProfile;
  photos: {
    id: string;
    storagePath: string;
    blurredStoragePath: string;
    blurRule: PhotoBlurRule;
    isPrimary: boolean;
    isVerifiedSelfieMatch: boolean;
  }[];
}

export class CandidateService {
  private static candidatesStore = new Map<string, StoredCandidate>();

  static async getCandidateByUserId(userId: string): Promise<StoredCandidate | null> {
    for (const cand of this.candidatesStore.values()) {
      if (cand.userId === userId) return cand;
    }
    return null;
  }

  static async getCandidateById(candidateId: string): Promise<StoredCandidate | null> {
    return this.candidatesStore.get(candidateId) || null;
  }

  static async createOrUpdateBase(userId: string, baseData: CandidateBase): Promise<StoredCandidate> {
    let cand = await this.getCandidateByUserId(userId);
    if (!cand) {
      const newId = `cand-${userId}`;
      cand = {
        id: newId,
        userId,
        base: baseData,
        photos: []
      };
      this.candidatesStore.set(newId, cand);
    } else {
      cand.base = baseData;
    }
    return cand;
  }

  static async updateProfile(userId: string, profileData: CandidateProfile): Promise<StoredCandidate> {
    let cand = await this.getCandidateByUserId(userId);
    if (!cand) {
      throw new Error('Candidate base record must be initialized before setting profile');
    }
    cand.profile = profileData;
    return cand;
  }

  static async addPhoto(
    userId: string,
    photoData: {
      storagePath: string;
      blurRule?: PhotoBlurRule;
      isPrimary?: boolean;
    }
  ): Promise<StoredCandidate> {
    const cand = await this.getCandidateByUserId(userId);
    if (!cand) {
      throw new Error('Candidate not found');
    }

    const photoId = `photo-${Date.now()}`;
    const blurredPath = `${photoData.storagePath}_blurred.webp`;

    const newPhoto = {
      id: photoId,
      storagePath: photoData.storagePath,
      blurredStoragePath: blurredPath,
      blurRule: photoData.blurRule || PhotoBlurRule.BLUR_UNTIL_MUTUAL_MATCH,
      isPrimary: photoData.isPrimary ?? cand.photos.length === 0,
      isVerifiedSelfieMatch: false
    };

    if (newPhoto.isPrimary) {
      cand.photos.forEach(p => (p.isPrimary = false));
    }

    cand.photos.push(newPhoto);
    return cand;
  }
}
