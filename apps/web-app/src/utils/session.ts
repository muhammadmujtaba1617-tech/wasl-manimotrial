'use client';

export const SESSION_KEYS = [
  'wasl_token',
  'wasl_auth_token',
  'wasl_user_id',
  'wasl_user_email',
  'wasl_user_phone',
  'wasl_user_name',
  'wasl_user_gender',
  'wasl_user_city',
  'wasl_user_role',
  'wasl_onboarded',
  'wasl_user_photo',
  'wasl_user_dob',
  'wasl_user_height',
  'wasl_user_marital',
  'wasl_user_caste',
  'wasl_user_sect',
  'wasl_user_prayer',
  'wasl_user_fasting',
  'wasl_user_diet',
  'wasl_user_family_type',
  'wasl_user_education',
  'wasl_user_institution',
  'wasl_user_profession',
  'wasl_user_company',
  'wasl_user_income',
  'wasl_user_bio',
  'wasl_user_hobbies'
];

export function getWaslToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wasl_auth_token') || localStorage.getItem('wasl_token') || null;
}

export function isWaslAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = getWaslToken();
  return Boolean(token && token.trim().length > 0);
}

export function clearWaslSession(redirectPath: string = '/login'): void {
  if (typeof window === 'undefined') return;
  SESSION_KEYS.forEach(key => localStorage.removeItem(key));
  window.location.href = redirectPath;
}
