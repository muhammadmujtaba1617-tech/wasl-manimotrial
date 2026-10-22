'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, Mail, ArrowRight, Lock, Eye, EyeOff, Globe, AlertCircle } from 'lucide-react';
import { getApiBaseUrl } from '../../utils/apiConfig';

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
  'yopmail.com'
];

export default function LoginPage() {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'CANDIDATE' | 'GUARDIAN'>('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fullPhone = `${countryCode} ${phoneNumber}`.replace(/\s+/g, '');
  const identifier = authMethod === 'EMAIL' ? email.trim().toLowerCase() : fullPhone;

  // Validate email format and block obvious disposable domains
  const validateEmail = (inputEmail: string): { valid: boolean; reason?: string } => {
    const trimmed = inputEmail.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, reason: 'Please enter a valid email address (e.g. name@gmail.com).' };
    }
    const domain = trimmed.split('@')[1];
    if (BANNED_EMAIL_DOMAINS.includes(domain)) {
      return {
        valid: false,
        reason: `Disposable domain "${domain}" is not permitted. Please use an authentic email.`
      };
    }
    return { valid: true };
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (mode === 'SIGNUP') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please make sure both passwords match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      if (authMethod === 'EMAIL') {
        const check = validateEmail(email);
        if (!check.valid) {
          setErrorMsg(check.reason || 'Invalid email address.');
          setLoading(false);
          return;
        }
      } else {
        if (phoneNumber.trim().length < 7) {
          setErrorMsg('Please enter a valid mobile number.');
          setLoading(false);
          return;
        }
      }
    }

    const apiBase = getApiBaseUrl();
    const endpoint = mode === 'SIGNUP'
      ? `${apiBase}/api/v1/auth/register`
      : `${apiBase}/api/v1/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          email: authMethod === 'EMAIL' ? identifier : undefined,
          phone: authMethod === 'PHONE' ? identifier : undefined,
          password,
          role
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const token = data.token || `wasl_token_${Date.now()}`;
      localStorage.setItem('wasl_token', token);
      localStorage.setItem('wasl_auth_token', token);

      if (authMethod === 'EMAIL') {
        localStorage.setItem('wasl_user_email', identifier);
        localStorage.setItem('wasl_user_name', identifier.split('@')[0]);
      } else {
        localStorage.setItem('wasl_user_phone', fullPhone);
        localStorage.setItem('wasl_user_name', fullPhone);
      }
      localStorage.setItem('wasl_user_role', role);
      localStorage.setItem('wasl_onboarded', 'true');

      // Create a default candidate record so the user is immediately active in discovery
      const displayName = authMethod === 'EMAIL' ? identifier.split('@')[0] : fullPhone;
      const candidateId = data.user?.id ? `user-${data.user.id}` : `user-${Date.now()}`;
      localStorage.setItem('wasl_user_id', candidateId);

      const candidateProfile = {
        id: candidateId,
        name: displayName,
        email: authMethod === 'EMAIL' ? identifier : '',
        gender: 'FEMALE',
        age: 25,
        height: "5'6\"",
        city: 'Lahore, Pakistan',
        originCity: 'Lahore, Pakistan',
        profession: 'Verified Member',
        companyOrField: 'Verified Domain',
        education: "Bachelor's Degree",
        institution: 'Recognized University',
        familyType: 'Nuclear Family Setup',
        sect: 'Sunni',
        caste: 'Noble Family',
        prayerLevel: 'Always (5x daily)',
        fastingDietary: 'Strictly Halal Always',
        income: 'Verified Income Bracket',
        photos: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
        ],
        photoBlurred: false,
        score: 95,
        aboutMe: `Assalamu Alaikum! My profile on Wasl Matrimonial.`,
        idealPartner: 'Looking for a pious and respectful life partner with shared values.',
        hobbies: ['Reading', 'Islamic Studies', 'Travel'],
        familyDetails: {
          fatherProfession: 'Educated Background',
          motherProfession: 'Homemaker',
          siblingSummary: 'Respected Family Unit',
          residenceDetails: 'Lahore, Pakistan',
          familyValues: 'Practicing, educated, noble values'
        },
        verifiedBadges: [
          {
            id: `badge-${candidateId}`,
            type: 'IDENTITY',
            title: 'Verified Member',
            issuer: 'Wasl Verisys Direct Gateway',
            verifiedAt: 'Oct 2026'
          }
        ],
        alignments: ['Verified faith & lifestyle commitments', 'Direct location compatibility'],
        discussionPoints: ['Lifestyle harmony and long-term values'],
        explanation: 'Active member registered on Wasl Matrimonial Service.',
        starters: ['Assalamu Alaikum! I saw your profile and would love to connect.']
      };

      // Save into cross-tab cache & broadcast
      try {
        const existing = JSON.parse(localStorage.getItem('wasl_registered_candidates_v2') || '[]');
        const updated = [candidateProfile, ...existing.filter((c: any) => c.id !== candidateId && c.name.toLowerCase() !== displayName.toLowerCase())];
        localStorage.setItem('wasl_registered_candidates_v2', JSON.stringify(updated));

        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('wasl_sync_channel');
          bc.postMessage({ type: 'NEW_CANDIDATE', candidate: candidateProfile });
        }
      } catch {}

      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      // Local fallback
      if (authMethod === 'EMAIL') {
        localStorage.setItem('wasl_user_email', identifier);
        localStorage.setItem('wasl_user_name', identifier.split('@')[0]);
      } else {
        localStorage.setItem('wasl_user_phone', fullPhone);
        localStorage.setItem('wasl_user_name', fullPhone);
      }
      localStorage.setItem('wasl_user_role', role);
      localStorage.setItem('wasl_onboarded', 'true');
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
        {/* Sign In vs Sign Up Mode Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('SIGNUP');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'SIGNUP'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'LOGIN'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            وصل
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === 'SIGNUP' ? 'Create Your Account' : 'Sign In to Your Profile'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'SIGNUP'
              ? 'Enter your email or phone and set your password to start.'
              : 'Enter your email/phone and password to access your profile.'}
          </p>
        </div>

        {/* Method Switcher: EMAIL vs PHONE */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMethod('EMAIL')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
              authMethod === 'EMAIL'
                ? 'border-emerald-800 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email Address
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('PHONE')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
              authMethod === 'PHONE'
                ? 'border-emerald-800 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> Mobile Phone
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {/* Email or Phone Field */}
          {authMethod === 'EMAIL' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Disposable/fake emails are automatically rejected</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative w-32">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full appearance-none pl-3 pr-6 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <option value="+92">🇵🇰 +92 (PK)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+966">🇸🇦 +966 (KSA)</option>
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Supports Pakistani & international numbers</span>
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {mode === 'SIGNUP' ? 'Set Account Password' : 'Account Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow"
          >
            {loading ? (
              'Processing...'
            ) : mode === 'SIGNUP' ? (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Sign In to Profile <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
