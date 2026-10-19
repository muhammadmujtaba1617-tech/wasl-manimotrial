export type UserAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'UNDER_REVIEW';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'CANDIDATE' | 'GUARDIAN' | 'ADMIN';
  gender: 'FEMALE' | 'MALE';
  age: number;
  profession: string;
  caste: string;
  status: UserAccountStatus;
  trustScore: number; // 0 - 100
  isNadraVerified: boolean;
  isDegreeVerified: boolean;
  isWorkVerified: boolean;
  reportsCount: number;
  suspicionReason?: string;
  registeredAt: string;
  lastActiveAt: string;
}

export interface SystemControlsConfig {
  emergencyChatFreeze: boolean;
  automodPiiStrictness: 'STRICT' | 'MODERATE' | 'OFF';
  mandatoryPhotoWatermarks: boolean;
  nadraGateEnforced: boolean;
  incognitoDefaultFemales: boolean;
  discoveryMaintenanceMode: boolean;
  broadcastBanner: {
    active: boolean;
    type: 'INFO' | 'WARNING' | 'ALERT';
    message: string;
  };
}

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'cand-female-1',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@lums.edu.pk',
    phone: '+92 300 1234567',
    city: 'Lahore (DHA Phase 5)',
    role: 'CANDIDATE',
    gender: 'FEMALE',
    age: 28,
    profession: 'Marketing Lead',
    caste: 'Jatt (Virk)',
    status: 'ACTIVE',
    trustScore: 98,
    isNadraVerified: true,
    isDegreeVerified: true,
    isWorkVerified: true,
    reportsCount: 0,
    registeredAt: '2026-08-15',
    lastActiveAt: '2026-10-08 03:00'
  },
  {
    id: 'cand-male-1',
    name: 'Hamza Malik',
    email: 'hamza.malik@fast.edu.pk',
    phone: '+92 321 9876543',
    city: 'Lahore (Gulberg III)',
    role: 'CANDIDATE',
    gender: 'MALE',
    age: 29,
    profession: 'Senior Software Architect',
    caste: 'Malik / Awan',
    status: 'ACTIVE',
    trustScore: 96,
    isNadraVerified: true,
    isDegreeVerified: true,
    isWorkVerified: false,
    reportsCount: 0,
    registeredAt: '2026-08-20',
    lastActiveAt: '2026-10-08 02:45'
  },
  {
    id: 'cand-scam-101',
    name: 'Raza Qureshi (Suspicious)',
    email: 'cheap.deals99@tempmail.com',
    phone: '+92 345 0001122',
    city: 'Rawalpindi',
    role: 'CANDIDATE',
    gender: 'MALE',
    age: 34,
    profession: 'Overseas Business Consultant',
    caste: 'Qureshi',
    status: 'UNDER_REVIEW',
    trustScore: 24,
    isNadraVerified: false,
    isDegreeVerified: false,
    isWorkVerified: false,
    reportsCount: 4,
    suspicionReason: 'Reported by 4 candidates for unsolicited WhatsApp solicitation & disposable email domain.',
    registeredAt: '2026-10-05',
    lastActiveAt: '2026-10-07 19:30'
  },
  {
    id: 'cand-female-2',
    name: 'Dr. Zainab Bibi',
    email: 'zainab.bibi@nust.edu.pk',
    phone: '+92 333 4455667',
    city: 'Islamabad (Sector F-7)',
    role: 'CANDIDATE',
    gender: 'FEMALE',
    age: 27,
    profession: 'Data Scientist',
    caste: 'Rajput',
    status: 'ACTIVE',
    trustScore: 95,
    isNadraVerified: true,
    isDegreeVerified: true,
    isWorkVerified: true,
    reportsCount: 0,
    registeredAt: '2026-08-10',
    lastActiveAt: '2026-10-08 01:20'
  },
  {
    id: 'cand-fake-202',
    name: 'Ali Shafi (Scam Alert)',
    email: 'crypto.invest.pk@gmail.com',
    phone: '+92 312 8887766',
    city: 'Karachi',
    role: 'CANDIDATE',
    gender: 'MALE',
    age: 26,
    profession: 'Crypto Forex Trader',
    caste: 'Sheikh',
    status: 'BANNED',
    trustScore: 10,
    isNadraVerified: false,
    isDegreeVerified: false,
    isWorkVerified: false,
    reportsCount: 6,
    suspicionReason: 'Definite scammer: Promoted fake investment schemes in chat messages. Account permanently terminated.',
    registeredAt: '2026-10-01',
    lastActiveAt: '2026-10-03 14:10'
  },
  {
    id: 'cand-female-4',
    name: 'Ayesha Arain',
    email: 'ayesha.arain@punjab.gov.pk',
    phone: '+92 301 5566778',
    city: 'Lahore (Model Town)',
    role: 'CANDIDATE',
    gender: 'FEMALE',
    age: 25,
    profession: 'Civil Services PAS',
    caste: 'Arain',
    status: 'ACTIVE',
    trustScore: 99,
    isNadraVerified: true,
    isDegreeVerified: true,
    isWorkVerified: true,
    reportsCount: 0,
    registeredAt: '2026-09-01',
    lastActiveAt: '2026-10-08 02:10'
  }
];

let globalUsers = [...INITIAL_USERS];

let globalSystemControls: SystemControlsConfig = {
  emergencyChatFreeze: false,
  automodPiiStrictness: 'STRICT',
  mandatoryPhotoWatermarks: true,
  nadraGateEnforced: true,
  incognitoDefaultFemales: true,
  discoveryMaintenanceMode: false,
  broadcastBanner: {
    active: false,
    type: 'INFO',
    message: 'Welcome to Wasl Matrimonial. All users are protected by NADRA Smart Verification.'
  }
};

export class AdminService {
  public getAllUsers(filter?: { status?: string; search?: string; minReports?: number }): AdminUserRecord[] {
    let result = [...globalUsers];

    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter(u => u.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }

    if (filter?.minReports && filter.minReports > 0) {
      result = result.filter(u => u.reportsCount >= filter.minReports!);
    }

    return result;
  }

  public updateUserStatus(userId: string, status: UserAccountStatus, reason?: string): AdminUserRecord | null {
    const userIndex = globalUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    globalUsers[userIndex] = {
      ...globalUsers[userIndex],
      status,
      suspicionReason: reason || globalUsers[userIndex].suspicionReason,
      trustScore: status === 'BANNED' ? 0 : status === 'SUSPENDED' ? 30 : globalUsers[userIndex].trustScore
    };

    return globalUsers[userIndex];
  }

  public deleteOrRemoveUser(userId: string): boolean {
    const initialLen = globalUsers.length;
    globalUsers = globalUsers.filter(u => u.id !== userId);
    return globalUsers.length < initialLen;
  }

  public getSystemControls(): SystemControlsConfig {
    return { ...globalSystemControls };
  }

  public updateSystemControls(updates: Partial<SystemControlsConfig>): SystemControlsConfig {
    globalSystemControls = {
      ...globalSystemControls,
      ...updates,
      broadcastBanner: updates.broadcastBanner
        ? { ...globalSystemControls.broadcastBanner, ...updates.broadcastBanner }
        : globalSystemControls.broadcastBanner
    };
    return { ...globalSystemControls };
  }
}

export const adminService = new AdminService();
