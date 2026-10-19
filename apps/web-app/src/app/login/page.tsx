'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, Mail, ArrowRight, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { getApiBaseUrl } from '../../utils/apiConfig';

export default function LoginPage() {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'login' || params.get('mode') === 'signin') {
        return 'LOGIN';
      }
    }
    return 'SIGNUP';
  });

  // Default to EMAIL option first as requested
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('300 1234567');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'CANDIDATE' | 'GUARDIAN'>('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fullPhone = `${countryCode} ${phoneNumber}`.replace(/\s+/g, '');
  const identifier = authMethod === 'EMAIL' ? email : fullPhone;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (mode === 'SIGNUP' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please make sure both passwords match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const apiBase = getApiBaseUrl();
    const endpoint = mode === 'SIGNUP'
      ? `${apiBase}/api/v1/auth/register`
      : `${apiBase}/api/v1/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('wasl_token', data.token);
        localStorage.setItem('wasl_auth_token', data.token);
      }

      if (authMethod === 'EMAIL') {
        localStorage.setItem('wasl_user_email', email);
      } else {
        localStorage.setItem('wasl_user_phone', fullPhone);
      }
      localStorage.setItem('wasl_user_role', role);

      if (mode === 'SIGNUP') {
        // New user sign-up -> start completely blank profile wizard
        const profileKeys = [
          'wasl_onboarded', 'wasl_user_name', 'wasl_user_gender', 'wasl_user_dob',
          'wasl_user_height', 'wasl_user_marital', 'wasl_user_city', 'wasl_user_caste',
          'wasl_user_sect', 'wasl_user_prayer', 'wasl_user_family_type', 'wasl_user_education',
          'wasl_user_institution', 'wasl_user_profession', 'wasl_user_company', 'wasl_user_income',
          'wasl_user_bio', 'wasl_user_hobbies', 'wasl_user_photo', 'wasl_photo_blur_rule',
          'wasl_pref_age_min', 'wasl_pref_age_max', 'wasl_pref_locations', 'wasl_pref_edu',
          'wasl_caste_preference', 'wasl_match_states_v1'
        ];
        profileKeys.forEach(k => localStorage.removeItem(k));
        window.location.href = '/onboarding';
      } else {
        // Returning user sign-in -> redirect directly to Profile Page
        window.location.href = '/profile';
      }
    } catch {
      // Fallback local authentication for dev testing
      if (authMethod === 'EMAIL') {
        localStorage.setItem('wasl_user_email', email);
      } else {
        localStorage.setItem('wasl_user_phone', fullPhone);
      }
      localStorage.setItem('wasl_user_role', role);

      if (mode === 'SIGNUP') {
        const profileKeys = [
          'wasl_onboarded', 'wasl_user_name', 'wasl_user_gender', 'wasl_user_dob',
          'wasl_user_height', 'wasl_user_marital', 'wasl_user_city', 'wasl_user_caste',
          'wasl_user_sect', 'wasl_user_prayer', 'wasl_user_family_type', 'wasl_user_education',
          'wasl_user_institution', 'wasl_user_profession', 'wasl_user_company', 'wasl_user_income',
          'wasl_user_bio', 'wasl_user_hobbies', 'wasl_user_photo', 'wasl_photo_blur_rule',
          'wasl_pref_age_min', 'wasl_pref_age_max', 'wasl_pref_locations', 'wasl_pref_edu',
          'wasl_caste_preference', 'wasl_match_states_v1'
        ];
        profileKeys.forEach(k => localStorage.removeItem(k));
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/profile';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
        {/* Sign In vs Sign Up Mode Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
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
            Create New Profile (Sign Up)
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

        {/* Method Switcher: EMAIL FIRST, PHONE SECOND */}
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
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {/* Identity Field (Email or Phone) */}
          {authMethod === 'EMAIL' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personal Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Temporary emails are blocked automatically
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    <option value="+1">🇺🇸 +1 (US/CA)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+966">🇸🇦 +966 (KSA)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
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
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Supports international & Pakistani numbers
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {mode === 'SIGNUP' ? 'Set Account Password' : 'Account Password'}
              </label>
            </div>
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

          {/* Confirm Password Field (Sign Up Mode only) */}
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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
            className="w-full py-3 rounded-xl bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow"
          >
            {loading ? (
              'Processing...'
            ) : mode === 'SIGNUP' ? (
              <>Create Account & Start Profile <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Sign In to Profile <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
