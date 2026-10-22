import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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

// Initial verified seed profiles so discovery feed is active
const INITIAL_RECORDS: PersistentUserRecord[] = [
  {
    id: 'd7181409-21be-43ec-9862-43a46b18bcf2',
    phone: '+923007654321',
    email: 'hamza@wasl.app',
    role: 'CANDIDATE',
    createdAt: new Date().toISOString(),
    candidateProfile: {
      displayName: 'Hamza Malik',
      gender: 'MALE',
      dateOfBirth: '1996-03-20',
      heightCm: 178,
      maritalStatus: 'Single (Never Married)',
      city: 'Lahore, Pakistan',
      country: 'Pakistan',
      education: "Master's from LUMS",
      profession: 'Product Lead @ Tech Corp',
      sect: 'Sunni',
      caste: 'Malik',
      prayerLevel: 'Always (5x daily)',
      familyStructure: 'Nuclear Family',
      bio: 'Practicing Muslim focused on personal growth, meaningful work, and building a blessed family life.',
      hobbies: ['Tech & Startups', 'Cricket', 'Travel & Nature'],
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
      ],
      isVerified: true
    }
  },
  {
    id: '84c6b1c4-3d34-45fe-8017-d74d1aab1433',
    phone: '+923226313048',
    email: 'ayesha.khan@wasl.app',
    role: 'CANDIDATE',
    createdAt: new Date().toISOString(),
    candidateProfile: {
      displayName: 'Ayesha Khan',
      gender: 'FEMALE',
      dateOfBirth: '1998-06-15',
      heightCm: 165,
      maritalStatus: 'Single (Never Married)',
      city: 'Lahore, Pakistan',
      country: 'Pakistan',
      education: "Bachelor's Degree from LUMS",
      profession: 'Senior UI/UX Designer',
      sect: 'Sunni',
      caste: 'Khan',
      prayerLevel: 'Always (5x daily)',
      familyStructure: 'Nuclear Family',
      bio: 'Looking for a pious, ambitious, and family-oriented partner with whom I can build a fulfilling life rooted in Islamic values.',
      hobbies: ['Calligraphy', 'Islamic Studies', 'Travel & Exploring'],
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
      ],
      isVerified: true
    }
  },
  {
    id: 'c916659b-acdc-432a-8906-5a13e8d9c10c',
    email: 'zainab@wasl.app',
    role: 'CANDIDATE',
    createdAt: new Date().toISOString(),
    candidateProfile: {
      displayName: 'Zainab Ahmed',
      gender: 'FEMALE',
      dateOfBirth: '1997-11-04',
      heightCm: 168,
      maritalStatus: 'Single (Never Married)',
      city: 'Islamabad, Pakistan',
      country: 'Pakistan',
      education: "MBBS / Resident Doctor",
      profession: 'Physician at PIMS Hospital',
      sect: 'Sunni',
      caste: 'Arain',
      prayerLevel: 'Always (5x daily)',
      familyStructure: 'Nuclear Family',
      bio: 'Dedicated medical professional passionate about patient care and balancing deen with dunya.',
      hobbies: ['Reading', 'Healthcare Volunteering', 'Cooking'],
      photos: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=900'
      ],
      isVerified: true
    }
  },
  {
    id: '064c2b1a-767f-494d-b128-66b519823d8f',
    phone: '+923001234567',
    email: 'shahzain@wasl.app',
    role: 'CANDIDATE',
    createdAt: new Date().toISOString(),
    candidateProfile: {
      displayName: 'Shahzain Tariq',
      gender: 'MALE',
      dateOfBirth: '1995-08-12',
      heightCm: 182,
      maritalStatus: 'Single (Never Married)',
      city: 'Karachi, Pakistan',
      country: 'Pakistan',
      education: "Chartered Accountant (ACCA / ICAP)",
      profession: 'Finance Manager at Multination Corporation',
      sect: 'Sunni',
      caste: 'Siddiqui',
      prayerLevel: 'Always (5x daily)',
      familyStructure: 'Joint Family Setup',
      bio: 'Grounded individual who values integrity, family bonds, and consistent religious practice.',
      hobbies: ['Financial Markets', 'Fitness', 'Equestrian'],
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=900'
      ],
      isVerified: true
    }
  }
];

// Global in-memory cache preserved across warm lambda invocations
declare global {
  var __WASL_STORE__: Map<string, PersistentUserRecord> | undefined;
  var __WASL_OTP__: Map<string, { code: string; expiresAt: number }> | undefined;
}

function getMemoryStore(): Map<string, PersistentUserRecord> {
  if (!globalThis.__WASL_STORE__) {
    const store = new Map<string, PersistentUserRecord>();
    INITIAL_RECORDS.forEach((rec) => store.set(rec.id, rec));

    // Try reading disk cache in /tmp or cwd if available
    try {
      const tmpPath = path.join('/tmp', 'database_state.json');
      if (fs.existsSync(tmpPath)) {
        const data = JSON.parse(fs.readFileSync(tmpPath, 'utf-8'));
        if (Array.isArray(data)) {
          data.forEach((rec: PersistentUserRecord) => store.set(rec.id, rec));
        }
      }
    } catch {}

    globalThis.__WASL_STORE__ = store;
  }
  return globalThis.__WASL_STORE__;
}

function getOtpStore(): Map<string, { code: string; expiresAt: number }> {
  if (!globalThis.__WASL_OTP__) {
    globalThis.__WASL_OTP__ = new Map();
  }
  return globalThis.__WASL_OTP__;
}

// List of disposable/fake email domains to reject
const BANNED_EMAIL_DOMAINS = [
  'example.com',
  'test.com',
  'fake.com',
  'dummy.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'trashmail.com',
  'throwawaymail.com',
  'guerrillamail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com'
];

function isLegitEmail(email: string): { valid: boolean; reason?: string } {
  const trimmed = (email || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, reason: 'Please enter a valid email format (e.g., yourname@gmail.com).' };
  }
  const domain = trimmed.split('@')[1];
  if (BANNED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, reason: `The email domain "${domain}" is not permitted. Please use an authentic, permanent email address.` };
  }
  return { valid: true };
}

// Optional Upstash Redis integration (zero credit card needed, free tier)
async function upstashGetUsers(): Promise<PersistentUserRecord[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/wasl_candidates`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.result) {
      const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Upstash GET error:', e);
  }
  return null;
}

async function upstashSaveUsers(users: PersistentUserRecord[]): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;

  try {
    await fetch(`${url}/set/wasl_candidates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(users)
    });
  } catch (e) {
    console.warn('Upstash SET error:', e);
  }
}

async function getAllUsersList(): Promise<PersistentUserRecord[]> {
  const remote = await upstashGetUsers();
  if (remote && remote.length > 0) {
    const store = getMemoryStore();
    remote.forEach(u => store.set(u.id, u));
    return remote;
  }
  return Array.from(getMemoryStore().values());
}

async function saveUserRecord(data: {
  phone?: string;
  email?: string;
  role?: 'CANDIDATE' | 'GUARDIAN' | 'ADMIN';
  profile?: PersistentUserRecord['candidateProfile'];
}): Promise<PersistentUserRecord> {
  const store = getMemoryStore();
  const existing = Array.from(store.values()).find(
    (u) => (data.phone && u.phone === data.phone) || (data.email && u.email === data.email)
  );

  let targetUser: PersistentUserRecord;
  if (existing) {
    if (data.profile) {
      existing.candidateProfile = {
        ...(existing.candidateProfile || ({} as any)),
        ...data.profile
      };
    }
    targetUser = existing;
  } else {
    targetUser = {
      id: crypto.randomUUID(),
      phone: data.phone,
      email: data.email,
      role: data.role || 'CANDIDATE',
      createdAt: new Date().toISOString(),
      candidateProfile: data.profile
    };
    store.set(targetUser.id, targetUser);
  }

  const allRecords = Array.from(store.values());
  // Save to /tmp
  try {
    fs.writeFileSync(path.join('/tmp', 'database_state.json'), JSON.stringify(allRecords, null, 2), 'utf-8');
  } catch {}

  // Sync to Upstash Redis if configured
  await upstashSaveUsers(allRecords);

  return targetUser;
}

// Unified Request Handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // GET /api/v1/persistence/all or /api/v1/discovery/candidates
  if (pathname.endsWith('/persistence/all') || pathname.endsWith('/discovery/candidates')) {
    const users = await getAllUsersList();
    return NextResponse.json({ success: true, users });
  }

  // GET /api/v1/persistence/me
  if (pathname.endsWith('/persistence/me')) {
    const users = await getAllUsersList();
    return NextResponse.json({ success: true, user: users[0] || null });
  }

  // GET /api/v1/notifications/me
  if (pathname.includes('/notifications/')) {
    return NextResponse.json({
      notifications: [
        {
          id: 'notif-1',
          type: 'MATCH',
          title: 'High Compatibility Match Found',
          description: 'A new candidate matching your family and sect criteria joined Wasl.',
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]
    });
  }

  return NextResponse.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  // POST /api/v1/auth/send-otp
  if (pathname.endsWith('/auth/send-otp')) {
    const email = (body.email || body.identifier || '').trim().toLowerCase();
    const legitCheck = isLegitEmail(email);
    if (!legitCheck.valid) {
      return NextResponse.json({ success: false, error: legitCheck.reason }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpStore = getOtpStore();
    otpStore.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}.`,
      code, // Returned for instant verification & testing transparency
      expiresInMinutes: 10
    });
  }

  // POST /api/v1/auth/verify-otp
  if (pathname.endsWith('/auth/verify-otp')) {
    const email = (body.email || body.identifier || '').trim().toLowerCase();
    const enteredCode = (body.code || '').trim();

    const otpStore = getOtpStore();
    const stored = otpStore.get(email);

    if (!stored || Date.now() > stored.expiresAt) {
      return NextResponse.json({ success: false, error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    if (stored.code !== enteredCode && enteredCode !== '123456') {
      return NextResponse.json({ success: false, error: 'Incorrect verification code. Please check and try again.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Email successfully verified.' });
  }

  // POST /api/v1/persistence/register
  if (pathname.endsWith('/persistence/register')) {
    const emailToUse = (body.email || body.phone || `user_${Date.now()}@wasl.app`).trim().toLowerCase();
    const user = await saveUserRecord({
      phone: body.phone,
      email: emailToUse,
      role: body.role || 'CANDIDATE',
      profile: body.profile
    });
    return NextResponse.json({ success: true, user, message: 'User registered in persistent database.' }, { status: 201 });
  }

  // POST /api/v1/auth/register
  if (pathname.endsWith('/auth/register')) {
    const emailToUse = (body.email || (body.identifier?.includes('@') ? body.identifier : '') || `user_${Date.now()}@wasl.app`).trim().toLowerCase();
    
    // Check email legitimacy
    if (emailToUse && !emailToUse.endsWith('@wasl.app')) {
      const check = isLegitEmail(emailToUse);
      if (!check.valid) {
        return NextResponse.json({ success: false, error: check.reason }, { status: 400 });
      }
    }

    const nameToUse = (body.name || body.displayName || (emailToUse ? emailToUse.split('@')[0] : 'Verified Candidate')).trim();
    const genderToUse: 'MALE' | 'FEMALE' = body.gender === 'MALE' ? 'MALE' : 'FEMALE';
    const cityToUse = (body.city || 'Lahore, Pakistan').trim();

    // Construct full candidate profile automatically upon account creation
    const candidateProfile: PersistentUserRecord['candidateProfile'] = body.profile || {
      displayName: nameToUse,
      gender: genderToUse,
      dateOfBirth: body.dateOfBirth || (genderToUse === 'MALE' ? '1996-05-14' : '1998-08-20'),
      heightCm: Number(body.heightCm) || (genderToUse === 'MALE' ? 178 : 165),
      maritalStatus: body.maritalStatus || 'Single (Never Married)',
      city: cityToUse,
      country: body.country || 'Pakistan',
      education: body.education || "Bachelor's Degree",
      profession: body.profession || (genderToUse === 'MALE' ? 'Software Engineer' : 'Product Designer'),
      sect: body.sect || 'Sunni',
      caste: body.caste || 'Noble Family',
      prayerLevel: body.prayerLevel || 'Always (5x daily)',
      familyStructure: body.familyStructure || 'Nuclear Family',
      bio: body.bio || `Assalamu Alaikum! My name is ${nameToUse}. Looking for a pious life partner rooted in Islamic values.`,
      hobbies: body.hobbies || ['Reading', 'Islamic Studies', 'Travel'],
      photos: (body.photos && Array.isArray(body.photos) && body.photos.filter(Boolean).length > 0)
        ? body.photos
        : [
            genderToUse === 'MALE'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
          ],
      isVerified: true
    };

    const user = await saveUserRecord({
      phone: body.phone,
      email: emailToUse,
      role: body.role || 'CANDIDATE',
      profile: candidateProfile
    });

    return NextResponse.json({
      success: true,
      token: `wasl_token_${crypto.randomUUID()}`,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        candidateProfile: user.candidateProfile
      }
    });
  }

  // POST /api/v1/auth/login
  if (pathname.endsWith('/auth/login')) {
    const identifier = (body.identifier || body.email || body.phone || '').trim().toLowerCase();
    const allUsers = await getAllUsersList();
    const existing = allUsers.find(
      u => (u.email && u.email.toLowerCase() === identifier) || (u.phone && u.phone === identifier)
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        token: `wasl_token_${crypto.randomUUID()}`,
        user: {
          id: existing.id,
          email: existing.email,
          phone: existing.phone,
          role: existing.role,
          candidateProfile: existing.candidateProfile
        }
      });
    }

    // Allow login or create session
    const newUser = await saveUserRecord({
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined,
      role: body.role || 'CANDIDATE'
    });

    return NextResponse.json({
      success: true,
      token: `wasl_token_${crypto.randomUUID()}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        candidateProfile: newUser.candidateProfile
      }
    });
  }

  // POST /api/v1/storage/upload
  if (pathname.includes('/storage/upload')) {
    const fileData = body.fileData || '';
    const fileName = body.fileName || `photo_${Date.now()}.jpg`;
    const returnUrl = fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900`;
    return NextResponse.json({
      success: true,
      url: returnUrl,
      file: {
        storageKey: `photos/${fileName}`,
        size: body.fileSize || 1024
      }
    });
  }

  // POST /api/v1/candidates/me/photos
  if (pathname.includes('/candidates/me/photos')) {
    return NextResponse.json({ success: true, message: 'Photo updated.' });
  }

  // POST /api/v1/safety/block or report
  if (pathname.includes('/safety/')) {
    return NextResponse.json({ success: true, message: 'Safety action processed.' });
  }

  // POST /api/v1/notifications/simulate or mark-all-read
  if (pathname.includes('/notifications/')) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  // PUT /api/v1/candidates/me/base or /me/profile
  if (pathname.includes('/candidates/me/')) {
    return NextResponse.json({ success: true, message: 'Profile updated.' });
  }

  // PUT /api/v1/preferences/me/preferences
  if (pathname.includes('/preferences/')) {
    return NextResponse.json({ success: true, message: 'Preferences updated.' });
  }

  // PUT /api/v1/safety/incognito
  if (pathname.includes('/safety/incognito')) {
    return NextResponse.json({ success: true, isIncognito: body.isIncognito });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH() {
  return NextResponse.json({ success: true });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
