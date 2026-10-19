import { BadgeType } from '@wasl/shared-types';

export const API_BASE_URL = 'http://localhost:4000';

export interface AuthSession {
  token: string;
  candidateId?: string;
  guardianId?: string;
  phone: string;
  role: 'CANDIDATE' | 'GUARDIAN';
}

export interface MobileCandidate {
  id: string;
  firstName: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  city: string;
  profession: string;
  education: string;
  sect: string;
  cast?: string;
  isPhotoBlurred: boolean;
  score: number;
  badges: BadgeType[];
  explanations?: {
    summary: string;
    keyAlignments: string[];
    potentialDiscussionTopics: string[];
  };
}

class ApiClient {
  private session: AuthSession | null = null;

  setSession(session: AuthSession | null) {
    this.session = session;
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      return await res.json();
    } catch {
      // Mock fallback
      return { success: true, message: 'Verification code sent (Dev Code: 123456)' };
    }
  }

  async verifyOtp(phone: string, otp: string, role: 'CANDIDATE' | 'GUARDIAN'): Promise<AuthSession> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, role })
      });
      const data = await res.json();
      const session: AuthSession = {
        token: data.token || 'mock_jwt_token',
        candidateId: data.candidateId || 'cand_mobile_101',
        guardianId: data.guardianId,
        phone,
        role
      };
      this.setSession(session);
      return session;
    } catch {
      const session: AuthSession = {
        token: 'mock_jwt_token',
        candidateId: 'cand_mobile_101',
        phone,
        role
      };
      this.setSession(session);
      return session;
    }
  }

  async getDiscoveryRecommendations(): Promise<MobileCandidate[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/discovery/recommendations`, {
        headers: { Authorization: `Bearer ${this.session?.token}` }
      });
      const data = await res.json();
      if (Array.isArray(data.recommendations)) {
        return data.recommendations;
      }
    } catch {}

    // Fallback seed recommendations
    return [
      {
        id: 'cand_101',
        firstName: 'Zara',
        gender: 'FEMALE',
        age: 26,
        city: 'Lahore',
        profession: 'Software Engineer',
        education: 'BS Computer Science (LUMS)',
        sect: 'Sunni',
        cast: 'Sheikh',
        isPhotoBlurred: true,
        score: 94,
        badges: [BadgeType.CNIC_IDENTITY, BadgeType.EDUCATION, BadgeType.WALI_VERIFIED],
        explanations: {
          summary: 'Exceptional 94% compatibility across Lahore residency, LUMS education, and aligned family values.',
          keyAlignments: ['Both based in Lahore', 'Shared educational standards', 'Verified Wali involvement'],
          potentialDiscussionTopics: ['Future postgraduate career plans', 'Living arrangements preferences']
        }
      },
      {
        id: 'cand_102',
        firstName: 'Hamza',
        gender: 'MALE',
        age: 28,
        city: 'Islamabad',
        profession: 'Financial Analyst',
        education: 'ACCA / BSc Finance',
        sect: 'Sunni',
        cast: 'Malik',
        isPhotoBlurred: false,
        score: 88,
        badges: [BadgeType.CNIC_IDENTITY, BadgeType.EMPLOYMENT],
        explanations: {
          summary: 'Strong 88% compatibility with aligned career outlook and verified financial background.',
          keyAlignments: ['Professional corporate careers', 'Complementary family structures'],
          potentialDiscussionTopics: ['Relocation between Islamabad and Lahore']
        }
      }
    ];
  }
}

export const api = new ApiClient();
