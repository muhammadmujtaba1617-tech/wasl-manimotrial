import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface PersistentUserRecord {
  id: string;
  phone?: string;
  email?: string;
  role: 'CANDIDATE' | 'GUARDIAN' | 'ADMIN';
  createdAt: string;
  candidateProfile?: {
    displayName: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    heightCm: number;
    maritalStatus: string;
    city: string;
    country: string;
    education: string;
    profession: string;
    sect: string;
    caste?: string;
    prayerLevel: string;
    familyStructure: string;
    bio: string;
    hobbies: string[];
    photos: string[];
    isVerified: boolean;
  };
}

class PersistenceService {
  private memoryStore: Map<string, PersistentUserRecord> = new Map();
  private storageFilePath: string = path.resolve(process.cwd(), 'database_state.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const data = fs.readFileSync(this.storageFilePath, 'utf-8');
        const parsed: PersistentUserRecord[] = JSON.parse(data);
        parsed.forEach((rec) => this.memoryStore.set(rec.id, rec));
      }
    } catch {
      // In-memory initialized
    }
  }

  private saveToDisk(): void {
    try {
      const allRecords = Array.from(this.memoryStore.values());
      fs.writeFileSync(this.storageFilePath, JSON.stringify(allRecords, null, 2), 'utf-8');
    } catch {}
  }

  registerUser(data: {
    phone?: string;
    email?: string;
    role?: 'CANDIDATE' | 'GUARDIAN' | 'ADMIN';
    profile?: PersistentUserRecord['candidateProfile'];
  }): PersistentUserRecord {
    // Check if existing
    const existing = Array.from(this.memoryStore.values()).find(
      (u) => (data.phone && u.phone === data.phone) || (data.email && u.email === data.email)
    );

    if (existing) {
      if (data.profile) {
        existing.candidateProfile = {
          ...(existing.candidateProfile || ({} as any)),
          ...data.profile
        };
        this.saveToDisk();
      }
      return existing;
    }

    const newUser: PersistentUserRecord = {
      id: crypto.randomUUID(),
      phone: data.phone,
      email: data.email,
      role: data.role || 'CANDIDATE',
      createdAt: new Date().toISOString(),
      candidateProfile: data.profile
    };

    this.memoryStore.set(newUser.id, newUser);
    this.saveToDisk();
    return newUser;
  }

  getUser(id: string): PersistentUserRecord | null {
    return this.memoryStore.get(id) || null;
  }

  getAllUsers(): PersistentUserRecord[] {
    return Array.from(this.memoryStore.values());
  }

  updateProfile(id: string, profile: Partial<PersistentUserRecord['candidateProfile']>): PersistentUserRecord | null {
    const user = this.memoryStore.get(id);
    if (!user) return null;
    user.candidateProfile = {
      ...(user.candidateProfile || ({} as any)),
      ...profile
    };
    this.saveToDisk();
    return user;
  }
}

export const persistenceService = new PersistenceService();
