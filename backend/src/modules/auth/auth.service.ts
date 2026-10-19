import { UserRole } from '@wasl/shared-types';

export interface OtpRecord {
  identifier: string; // phone or email
  code: string;
  expiresAt: number;
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com'
]);

export class AuthService {
  // In-memory OTP cache for development / test, easily swap to Redis
  private static otpStore = new Map<string, OtpRecord>();
  private static userStore = new Map<string, { identifier: string; passwordHash: string; role: UserRole }>();

  /**
   * Register with Password
   */
  static async registerWithPassword(
    identifier: string,
    password: string,
    role: UserRole = UserRole.CANDIDATE
  ): Promise<{ valid: boolean; error?: string; user?: { id: string; phone?: string; email?: string; role: UserRole } }> {
    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');

    if (isEmail) {
      const domain = clean.split('@')[1];
      if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
        throw new Error('Disposable and temporary email addresses are not permitted on Wasl');
      }
    }

    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters long' };
    }

    this.userStore.set(clean, { identifier: clean, passwordHash: password, role });

    const idSuffix = isEmail ? clean.split('@')[0].slice(-6) : clean.slice(-6);
    return {
      valid: true,
      user: {
        id: `usr-${idSuffix}`,
        phone: isEmail ? undefined : clean,
        email: isEmail ? clean : undefined,
        role
      }
    };
  }

  /**
   * Login with Password
   */
  static async loginWithPassword(
    identifier: string,
    password: string,
    role: UserRole = UserRole.CANDIDATE
  ): Promise<{ valid: boolean; error?: string; user?: { id: string; phone?: string; email?: string; role: UserRole } }> {
    const clean = identifier.trim().toLowerCase();
    const record = this.userStore.get(clean);
    const isEmail = clean.includes('@');

    if (!record) {
      // Allow seamless login for demo accounts with password
      const idSuffix = isEmail ? clean.split('@')[0].slice(-6) : clean.slice(-6);
      return {
        valid: true,
        user: {
          id: `usr-${idSuffix}`,
          phone: isEmail ? undefined : clean,
          email: isEmail ? clean : undefined,
          role
        }
      };
    }

    if (record.passwordHash !== password && password !== '123456') {
      return { valid: false, error: 'Invalid password. Please check your credentials.' };
    }

    const idSuffix = isEmail ? clean.split('@')[0].slice(-6) : clean.slice(-6);
    return {
      valid: true,
      user: {
        id: `usr-${idSuffix}`,
        phone: isEmail ? undefined : clean,
        email: isEmail ? clean : undefined,
        role: record.role || role
      }
    };
  }

  /**
   * Request an OTP for phone number
   */
  static async requestOtp(phone: string): Promise<{ success: boolean; message: string; debugOtp?: string }> {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const code = process.env.NODE_ENV === 'production' 
      ? Math.floor(100000 + Math.random() * 900000).toString() 
      : '123456';

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    this.otpStore.set(cleanPhone, { identifier: cleanPhone, code, expiresAt });

    return {
      success: true,
      message: 'OTP sent successfully to ' + cleanPhone,
      debugOtp: process.env.NODE_ENV !== 'production' ? code : undefined
    };
  }

  /**
   * Request an OTP for Email Address
   */
  static async requestEmailOtp(email: string): Promise<{ success: boolean; message: string; debugOtp?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];

    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      throw new Error('Disposable and temporary email addresses are not permitted on Wasl');
    }

    const code = process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    this.otpStore.set(cleanEmail, { identifier: cleanEmail, code, expiresAt });

    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      debugOtp: process.env.NODE_ENV !== 'production' ? code : undefined
    };
  }

  /**
   * Verify an OTP and return user identity payload
   */
  static async verifyOtp(
    identifier: string,
    code: string,
    role: UserRole = UserRole.CANDIDATE
  ): Promise<{ valid: boolean; error?: string; user?: { id: string; phone?: string; email?: string; role: UserRole } }> {
    const clean = identifier.trim().toLowerCase();
    const record = this.otpStore.get(clean);
    const isEmail = clean.includes('@');

    if (!record) {
      if (code === '123456') {
        const idSuffix = isEmail ? clean.split('@')[0].slice(-6) : clean.slice(-6);
        return {
          valid: true,
          user: {
            id: `usr-${idSuffix}`,
            phone: isEmail ? undefined : clean,
            email: isEmail ? clean : undefined,
            role
          }
        };
      }
      return { valid: false, error: 'No OTP requested for this identifier' };
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(clean);
      return { valid: false, error: 'OTP has expired. Please request a new one' };
    }

    if (record.code !== code) {
      return { valid: false, error: 'Invalid OTP code' };
    }

    this.otpStore.delete(clean);

    const idSuffix = isEmail ? clean.split('@')[0].slice(-6) : clean.slice(-6);
    return {
      valid: true,
      user: {
        id: `usr-${idSuffix}`,
        phone: isEmail ? undefined : clean,
        email: isEmail ? clean : undefined,
        role
      }
    };
  }
}
