import { CandidatePreferences } from '@wasl/shared-types';

export class PreferencesService {
  private static preferencesStore = new Map<string, CandidatePreferences>();

  static async getPreferences(candidateId: string): Promise<CandidatePreferences | null> {
    return this.preferencesStore.get(candidateId) || null;
  }

  static async savePreferences(candidateId: string, preferences: CandidatePreferences): Promise<CandidatePreferences> {
    this.preferencesStore.set(candidateId, preferences);
    return preferences;
  }
}
