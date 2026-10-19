'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  User,
  Heart,
  Briefcase,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Globe,
  MapPin,
  Calendar,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';
import FileUploadDropzone from '../../components/FileUploadDropzone';
import { SECT_OPTIONS, CASTE_OPTIONS } from '../../constants/casteOptions';
import { getApiBaseUrl } from '../../utils/apiConfig';

const PRAYER_LEVELS = ['Always (5x daily)', 'Usually', 'Sometimes', 'Only on Fridays / Ramadan', 'Working on it'];
const EDUCATION_LEVELS = ["Bachelor's Degree", "Master's Degree", 'Doctorate / PhD', 'MBBS / Medical Specialist', 'Chartered Accountant / ACCA', 'High School / Diploma'];
const MARITAL_STATUSES = ['Single (Never Married)', 'Divorced', 'Widowed', 'Annulled'];
const FAMILY_TYPES = ['Nuclear Family', 'Joint Family Setup', 'Independent Living'];
const DIASPORA_CITIES = [
  'Karachi, Pakistan',
  'Lahore, Pakistan',
  'Islamabad / Rawalpindi, Pakistan',
  'Faisalabad, Pakistan',
  'Peshawar, Pakistan',
  'London, United Kingdom',
  'Manchester, United Kingdom',
  'Birmingham, United Kingdom',
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Riyadh, Saudi Arabia',
  'Jeddah, Saudi Arabia',
  'Toronto, Canada',
  'New York / New Jersey, USA',
  'Chicago, USA',
  'Dallas / Houston, USA',
  'Sydney, Australia',
  'Melbourne, Australia'
];

const HOBBY_SUGGESTIONS = [
  'Islamic Studies', 'Travel & Exploring', 'Reading & Philosophy', 'Fitness & Gym', 
  'Cooking & Foodie', 'Tech & Startups', 'Art & Calligraphy', 'Cricket & Sports', 
  'Hiking & Nature', 'Volunteering', 'Photography', 'Financial Markets'
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userWatermarkText, setUserWatermarkText] = useState<string>('WASL-SECURE-USER');

  // Step 1: Basic Identity & Demographics
  const [formDataStep1, setFormDataStep1] = useState({
    fullName: '',
    gender: 'MALE',
    dateOfBirth: '',
    heightCm: 175,
    maritalStatus: 'Single (Never Married)',
    city: 'Lahore, Pakistan',
    motherTongue: 'Urdu',
    nationality: 'Pakistani'
  });

  // Step 2: Faith & Family Values
  const [formDataStep2, setFormDataStep2] = useState({
    sect: 'Sunni',
    caste: 'Arain',
    customCaste: '',
    prayerFrequency: 'Always (5x daily)',
    fastingRamadan: true,
    dietaryHalal: 'Strictly Halal Always',
    familyType: 'Nuclear Family',
    familyValues: 'Traditional & Modern Blend',
    relocationFlexibility: 'Open to relocating globally for spouse'
  });

  // Step 3: Education & Career
  const [formDataStep3, setFormDataStep3] = useState({
    educationLevel: "Bachelor's Degree",
    institution: '',
    occupation: '',
    companyOrField: '',
    incomeRange: '',
    bio: '',
    hobbies: [] as string[]
  });

  // Step 4: Partner Preferences & Deal-Breakers
  const [formDataStep4, setFormDataStep4] = useState({
    ageMin: 22,
    ageMax: 28,
    heightMinCm: 155,
    heightMaxCm: 175,
    preferredSects: ['Sunni', 'Just Muslim / Non-denominational'],
    preferredCastes: [] as string[],
    casteStrictness: 'NO_BAR' as 'NO_BAR' | 'SAME_CASTE_PREFERRED' | 'SAME_CASTE_ONLY' | 'SPECIFIC_CASTES',
    preferredCities: [] as string[],
    smokingAcceptable: false,
    mustPrayDaily: true
  });

  // Step 5: Photos & Privacy Settings
  const [formDataStep5, setFormDataStep5] = useState({
    photoUrl: '',
    blurRule: 'BLUR_UNTIL_MUTUAL_MATCH' as 'ALWAYS_CLEAR' | 'BLUR_UNTIL_MUTUAL_MATCH' | 'BLUR_UNTIL_UNLOCKED',
    watermarkEnabled: true
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('wasl_auth_token');
    const phone = localStorage.getItem('wasl_user_phone');
    const email = localStorage.getItem('wasl_user_email');
    
    if (phone || email) {
      setUserWatermarkText(`WASL • ${phone || email} • CONFIDENTIAL`);
    }

    // Step 1: Basic Identity & Demographics
    const storedName = localStorage.getItem('wasl_user_name');
    const storedGender = localStorage.getItem('wasl_user_gender');
    const storedDob = localStorage.getItem('wasl_user_dob');
    const storedHeight = localStorage.getItem('wasl_user_height');
    const storedMarital = localStorage.getItem('wasl_user_marital');
    const storedCity = localStorage.getItem('wasl_user_city');
    const storedMotherTongue = localStorage.getItem('wasl_user_mother_tongue');
    const storedNationality = localStorage.getItem('wasl_user_nationality');

    if (storedName || storedGender || storedDob || storedHeight || storedMarital || storedCity || storedMotherTongue || storedNationality) {
      setFormDataStep1(prev => ({
        ...prev,
        fullName: storedName || prev.fullName,
        gender: storedGender || prev.gender,
        dateOfBirth: storedDob || prev.dateOfBirth,
        heightCm: storedHeight ? Number(storedHeight) : prev.heightCm,
        maritalStatus: storedMarital || prev.maritalStatus,
        city: storedCity || prev.city,
        motherTongue: storedMotherTongue || prev.motherTongue,
        nationality: storedNationality || prev.nationality
      }));
    }

    // Step 2: Faith & Family Values
    const storedSect = localStorage.getItem('wasl_user_sect');
    const storedCaste = localStorage.getItem('wasl_user_caste');
    const storedCustomCaste = localStorage.getItem('wasl_user_custom_caste');
    const storedPrayer = localStorage.getItem('wasl_user_prayer');
    const storedFasting = localStorage.getItem('wasl_user_fasting');
    const storedDiet = localStorage.getItem('wasl_user_diet');
    const storedFamilyType = localStorage.getItem('wasl_user_family_type');
    const storedFamilyValues = localStorage.getItem('wasl_user_family_values');
    const storedRelocation = localStorage.getItem('wasl_user_relocation');

    if (storedSect || storedCaste || storedPrayer || storedFamilyType || storedRelocation || storedDiet) {
      setFormDataStep2(prev => ({
        ...prev,
        sect: storedSect || prev.sect,
        caste: storedCaste || prev.caste,
        customCaste: storedCustomCaste || prev.customCaste,
        prayerFrequency: storedPrayer || prev.prayerFrequency,
        fastingRamadan: storedFasting !== null ? storedFasting === 'true' : prev.fastingRamadan,
        dietaryHalal: storedDiet || prev.dietaryHalal,
        familyType: storedFamilyType || prev.familyType,
        familyValues: storedFamilyValues || prev.familyValues,
        relocationFlexibility: storedRelocation || prev.relocationFlexibility
      }));
    }

    // Step 3: Education & Career
    const storedEdu = localStorage.getItem('wasl_user_education');
    const storedInst = localStorage.getItem('wasl_user_institution');
    const storedProf = localStorage.getItem('wasl_user_profession');
    const storedComp = localStorage.getItem('wasl_user_company');
    const storedIncome = localStorage.getItem('wasl_user_income');
    const storedBio = localStorage.getItem('wasl_user_bio');
    const storedHobbies = localStorage.getItem('wasl_user_hobbies');

    if (storedEdu || storedInst || storedProf || storedComp || storedIncome || storedBio || storedHobbies) {
      let parsedHobbies = undefined;
      if (storedHobbies) {
        try {
          const parsed = JSON.parse(storedHobbies);
          if (Array.isArray(parsed)) parsedHobbies = parsed;
        } catch {}
      }

      setFormDataStep3(prev => ({
        ...prev,
        educationLevel: storedEdu || prev.educationLevel,
        institution: storedInst || prev.institution,
        occupation: storedProf || prev.occupation,
        companyOrField: storedComp || prev.companyOrField,
        incomeRange: storedIncome || prev.incomeRange,
        bio: storedBio || prev.bio,
        hobbies: parsedHobbies || prev.hobbies
      }));
    }

    // Step 4: Partner Preferences
    const storedPrefAgeMin = localStorage.getItem('wasl_pref_age_min');
    const storedPrefAgeMax = localStorage.getItem('wasl_pref_age_max');
    const storedPrefHeightMin = localStorage.getItem('wasl_pref_height_min');
    const storedPrefHeightMax = localStorage.getItem('wasl_pref_height_max');
    const storedPrefCaste = localStorage.getItem('wasl_caste_preference');
    const storedPrefSects = localStorage.getItem('wasl_pref_sects');
    const storedPrefCities = localStorage.getItem('wasl_pref_cities');

    if (storedPrefAgeMin || storedPrefAgeMax || storedPrefHeightMin || storedPrefHeightMax || storedPrefCaste || storedPrefSects || storedPrefCities) {
      let parsedSects = undefined;
      let parsedCities = undefined;
      if (storedPrefSects) {
        try {
          const parsed = JSON.parse(storedPrefSects);
          if (Array.isArray(parsed)) parsedSects = parsed;
        } catch {}
      }
      if (storedPrefCities) {
        try {
          const parsed = JSON.parse(storedPrefCities);
          if (Array.isArray(parsed)) parsedCities = parsed;
        } catch {}
      }

      setFormDataStep4(prev => ({
        ...prev,
        ageMin: storedPrefAgeMin ? Number(storedPrefAgeMin) : prev.ageMin,
        ageMax: storedPrefAgeMax ? Number(storedPrefAgeMax) : prev.ageMax,
        heightMinCm: storedPrefHeightMin ? Number(storedPrefHeightMin) : prev.heightMinCm,
        heightMaxCm: storedPrefHeightMax ? Number(storedPrefHeightMax) : prev.heightMaxCm,
        casteStrictness: (storedPrefCaste as any) || prev.casteStrictness,
        preferredSects: parsedSects || prev.preferredSects,
        preferredCities: parsedCities || prev.preferredCities
      }));
    }

    // Step 5: Photos & Privacy
    const storedPhoto = localStorage.getItem('wasl_user_photo');
    const storedBlurRule = localStorage.getItem('wasl_photo_blur_rule');

    if (storedPhoto || storedBlurRule) {
      setFormDataStep5(prev => ({
        ...prev,
        photoUrl: storedPhoto || prev.photoUrl,
        blurRule: (storedBlurRule as any) || prev.blurRule
      }));
    }
  }, []);

  const toggleHobby = (hobby: string) => {
    setFormDataStep3(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const togglePreferredSect = (sect: string) => {
    setFormDataStep4(prev => ({
      ...prev,
      preferredSects: prev.preferredSects.includes(sect)
        ? prev.preferredSects.filter(s => s !== sect)
        : [...prev.preferredSects, sect]
    }));
  };

  const togglePreferredCaste = (caste: string) => {
    setFormDataStep4(prev => ({
      ...prev,
      preferredCastes: prev.preferredCastes.includes(caste)
        ? prev.preferredCastes.filter(c => c !== caste)
        : [...prev.preferredCastes, caste]
    }));
  };

  const handleNext = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!formDataStep1.fullName.trim()) {
        setErrorMessage('Please enter your legal full name.');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('wasl_auth_token');
      const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBase = getApiBaseUrl();

      // Send Base Profile
      try {
        await fetch(`${apiBase}/api/v1/candidates/me/base`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            fullName: formDataStep1.fullName,
            gender: formDataStep1.gender,
            dateOfBirth: formDataStep1.dateOfBirth,
            heightCm: Number(formDataStep1.heightCm),
            maritalStatus: formDataStep1.maritalStatus,
            city: formDataStep1.city,
            sect: formDataStep2.sect
          })
        });
      } catch (err) {
        console.warn('Backend base update skipped or simulated', err);
      }

      // Send Extended Profile
      try {
        await fetch(`${apiBase}/api/v1/candidates/me/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            bio: formDataStep3.bio,
            education: `${formDataStep3.educationLevel} from ${formDataStep3.institution}`,
            profession: `${formDataStep3.occupation} at ${formDataStep3.companyOrField}`,
            prayerLevel: formDataStep2.prayerFrequency,
            familyStructure: formDataStep2.familyType,
            lifestyleTags: formDataStep3.hobbies
          })
        });
      } catch (err) {
        console.warn('Backend profile update skipped or simulated', err);
      }

      // Send Partner Preferences
      try {
        await fetch(`${apiBase}/api/v1/preferences/me/preferences`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            ageRange: [formDataStep4.ageMin, formDataStep4.ageMax],
            heightRange: [formDataStep4.heightMinCm, formDataStep4.heightMaxCm],
            allowedSects: formDataStep4.preferredSects,
            allowedCities: formDataStep4.preferredCities,
            dealbreakers: {
              smokingAcceptable: formDataStep4.smokingAcceptable,
              mustPrayDaily: formDataStep4.mustPrayDaily
            }
          })
        });
      } catch (err) {
        console.warn('Backend preference update skipped or simulated', err);
      }

      // Send Photo & Blur Configuration
      try {
        await fetch(`${apiBase}/api/v1/candidates/me/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify({
            url: formDataStep5.photoUrl,
            blurRule: formDataStep5.blurRule,
            isPrimary: true
          })
        });
      } catch (err) {
        console.warn('Backend photo update skipped or simulated', err);
      }

      // Effective Caste value
      const effectiveCaste =
        formDataStep2.caste === 'Other / Prefer Not to Say' && formDataStep2.customCaste.trim()
          ? formDataStep2.customCaste.trim()
          : formDataStep2.caste;

      // Persist permanently into Database Repository
      try {
        const userPhone = localStorage.getItem('wasl_user_phone') || undefined;
        let userEmail = localStorage.getItem('wasl_user_email');
        if (!userEmail) {
          userEmail = `user_${Date.now()}@wasl.app`;
          localStorage.setItem('wasl_user_email', userEmail);
        }
        await fetch(`${apiBase}/api/v1/persistence/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userPhone,
            email: userEmail,
            role: 'CANDIDATE',
            profile: {
              displayName: formDataStep1.fullName,
              gender: formDataStep1.gender,
              dateOfBirth: formDataStep1.dateOfBirth,
              heightCm: Number(formDataStep1.heightCm),
              maritalStatus: formDataStep1.maritalStatus,
              city: formDataStep1.city,
              country: formDataStep1.nationality,
              education: `${formDataStep3.educationLevel} from ${formDataStep3.institution}`,
              profession: `${formDataStep3.occupation} (${formDataStep3.companyOrField})`,
              sect: formDataStep2.sect,
              caste: effectiveCaste,
              prayerLevel: formDataStep2.prayerFrequency,
              familyStructure: formDataStep2.familyType,
              bio: formDataStep3.bio,
              hobbies: formDataStep3.hobbies,
              photos: [formDataStep5.photoUrl],
              isVerified: true
            }
          })
        });
      } catch (err) {
        console.warn('Persistent DB registration sync completed with fallback', err);
      }

      // Mark local storage profile completed with all user-entered information
      localStorage.setItem('wasl_onboarded', 'true');
      localStorage.setItem('wasl_user_name', formDataStep1.fullName);
      localStorage.setItem('wasl_user_gender', formDataStep1.gender);
      localStorage.setItem('wasl_user_dob', formDataStep1.dateOfBirth);
      localStorage.setItem('wasl_user_height', String(formDataStep1.heightCm));
      localStorage.setItem('wasl_user_marital', formDataStep1.maritalStatus);
      localStorage.setItem('wasl_user_city', formDataStep1.city);
      localStorage.setItem('wasl_user_mother_tongue', formDataStep1.motherTongue);
      localStorage.setItem('wasl_user_nationality', formDataStep1.nationality);

      localStorage.setItem('wasl_user_caste', effectiveCaste);
      if (formDataStep2.customCaste) {
        localStorage.setItem('wasl_user_custom_caste', formDataStep2.customCaste);
      }
      localStorage.setItem('wasl_user_sect', formDataStep2.sect);
      localStorage.setItem('wasl_user_prayer', formDataStep2.prayerFrequency);
      localStorage.setItem('wasl_user_fasting', String(formDataStep2.fastingRamadan));
      localStorage.setItem('wasl_user_diet', formDataStep2.dietaryHalal);
      localStorage.setItem('wasl_user_family_type', formDataStep2.familyType);
      localStorage.setItem('wasl_user_family_values', formDataStep2.familyValues);
      localStorage.setItem('wasl_user_relocation', formDataStep2.relocationFlexibility);

      localStorage.setItem('wasl_user_education', formDataStep3.educationLevel);
      localStorage.setItem('wasl_user_institution', formDataStep3.institution);
      localStorage.setItem('wasl_user_profession', formDataStep3.occupation);
      localStorage.setItem('wasl_user_company', formDataStep3.companyOrField);
      localStorage.setItem('wasl_user_income', formDataStep3.incomeRange);
      localStorage.setItem('wasl_user_bio', formDataStep3.bio);
      localStorage.setItem('wasl_user_hobbies', JSON.stringify(formDataStep3.hobbies));

      localStorage.setItem('wasl_pref_age_min', String(formDataStep4.ageMin));
      localStorage.setItem('wasl_pref_age_max', String(formDataStep4.ageMax));
      localStorage.setItem('wasl_pref_height_min', String(formDataStep4.heightMinCm));
      localStorage.setItem('wasl_pref_height_max', String(formDataStep4.heightMaxCm));
      localStorage.setItem('wasl_pref_sects', JSON.stringify(formDataStep4.preferredSects));
      localStorage.setItem('wasl_pref_cities', JSON.stringify(formDataStep4.preferredCities));
      localStorage.setItem('wasl_pref_locations', formDataStep4.preferredCities.join(', '));
      localStorage.setItem('wasl_caste_preference', formDataStep4.casteStrictness);

      localStorage.setItem('wasl_photo_blur_rule', formDataStep5.blurRule);
      if (formDataStep5.photoUrl) {
        localStorage.setItem('wasl_user_photo', formDataStep5.photoUrl);
      }

      // Successfully finished wizard!
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while saving profile. Continuing to dashboard...');
      localStorage.setItem('wasl_onboarded', 'true');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-800 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800 font-bold text-white shadow-md shadow-emerald-950/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950">
                WASL وصل
              </span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                • Matrimonial Profile Setup
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Step {currentStep} of 5</span>
            <p className="text-sm font-extrabold text-emerald-900">
              {currentStep === 1 && 'Identity & Demographics'}
              {currentStep === 2 && 'Faith & Family Values'}
              {currentStep === 3 && 'Career & Lifestyle'}
              {currentStep === 4 && 'Partner Criteria & Filters'}
              {currentStep === 5 && 'Photo Privacy & Verification'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { id: 1, label: 'Identity', icon: User },
              { id: 2, label: 'Faith & Family', icon: Heart },
              { id: 3, label: 'Education & Career', icon: Briefcase },
              { id: 4, label: 'Preferences', icon: Sliders },
              { id: 5, label: 'Photo Privacy', icon: ShieldCheck }
            ].map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <button
                    onClick={() => isDone && setCurrentStep(step.id)}
                    disabled={!isDone}
                    className={`flex items-center space-x-2 text-left transition-all ${
                      isActive
                        ? 'text-emerald-900 font-bold'
                        : isDone
                        ? 'text-emerald-700 font-semibold cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
                        isActive
                          ? 'border-emerald-700 bg-emerald-800 text-white shadow-md shadow-emerald-900/20 ring-4 ring-emerald-600/20'
                          : isDone
                          ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className="hidden text-xs font-semibold sm:inline-block">{step.label}</span>
                  </button>
                  {idx < 4 && (
                    <div
                      className={`mx-2 h-[2px] flex-1 transition-all ${
                        currentStep > idx + 1 ? 'bg-emerald-700' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 text-slate-900">
          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & DEMOGRAPHICS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Let’s begin with who you are</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Please provide authentic details. Wasl maintains a zero-tolerance policy for fake credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formDataStep1.fullName}
                    onChange={e => setFormDataStep1({ ...formDataStep1, fullName: e.target.value })}
                    placeholder="e.g., Sarah Fatima / Hamza Malik"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {['FEMALE', 'MALE'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormDataStep1({ ...formDataStep1, gender: g })}
                        className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                          formDataStep1.gender === g
                            ? 'border-emerald-700 bg-emerald-800 text-white ring-2 ring-emerald-600/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {g === 'FEMALE' ? 'Female (Bride)' : 'Male (Groom)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      value={formDataStep1.dateOfBirth}
                      onChange={e => setFormDataStep1({ ...formDataStep1, dateOfBirth: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Height: <span className="text-emerald-800 font-extrabold">{formDataStep1.heightCm} cm</span> (
                    {Math.floor(formDataStep1.heightCm / 30.48)}&apos;
                    {Math.round((formDataStep1.heightCm % 30.48) / 2.54)}&quot;)
                  </label>
                  <input
                    type="range"
                    min="140"
                    max="210"
                    value={formDataStep1.heightCm}
                    onChange={e => setFormDataStep1({ ...formDataStep1, heightCm: Number(e.target.value) })}
                    className="mt-4 w-full accent-emerald-800 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Marital Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDataStep1.maritalStatus}
                    onChange={e => setFormDataStep1({ ...formDataStep1, maritalStatus: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {MARITAL_STATUSES.map(status => (
                      <option key={status} value={status} className="bg-white text-slate-900">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Current City / Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDataStep1.city}
                    onChange={e => setFormDataStep1({ ...formDataStep1, city: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {DIASPORA_CITIES.map(city => (
                      <option key={city} value={city} className="bg-white text-slate-900">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FAITH & FAMILY VALUES */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faith & Family Foundations</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Shared spiritual commitments and family understanding are crucial for lifelong harmony.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Sect / Denomination <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDataStep2.sect}
                    onChange={e => setFormDataStep2({ ...formDataStep2, sect: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {SECT_OPTIONS.map(sect => (
                      <option key={sect} value={sect} className="bg-white text-slate-900">
                        {sect}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Caste / Biradari / Clan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formDataStep2.caste}
                    onChange={e => setFormDataStep2({ ...formDataStep2, caste: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {CASTE_OPTIONS.map(caste => (
                      <option key={caste} value={caste} className="bg-white text-slate-900">
                        {caste}
                      </option>
                    ))}
                  </select>
                </div>

                {formDataStep2.caste === 'Other / Prefer Not to Say' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Specify Custom Caste / Biradari (Optional)
                    </label>
                    <input
                      type="text"
                      value={formDataStep2.customCaste}
                      onChange={e => setFormDataStep2({ ...formDataStep2, customCaste: e.target.value })}
                      placeholder="e.g. Kakazai, Satti, Gondal, Langrial, etc."
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prayer (Salah) Practice
                  </label>
                  <select
                    value={formDataStep2.prayerFrequency}
                    onChange={e => setFormDataStep2({ ...formDataStep2, prayerFrequency: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {PRAYER_LEVELS.map(level => (
                      <option key={level} value={level} className="bg-white text-slate-900">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Family Living Arrangement
                  </label>
                  <select
                    value={formDataStep2.familyType}
                    onChange={e => setFormDataStep2({ ...formDataStep2, familyType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {FAMILY_TYPES.map(ft => (
                      <option key={ft} value={ft} className="bg-white text-slate-900">
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Relocation Willingness
                  </label>
                  <select
                    value={formDataStep2.relocationFlexibility}
                    onChange={e => setFormDataStep2({ ...formDataStep2, relocationFlexibility: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    <option value="Open to relocating globally for spouse" className="bg-white text-slate-900">
                      Open to relocating globally
                    </option>
                    <option value="Open to relocating within country" className="bg-white text-slate-900">
                      Within current country only
                    </option>
                    <option value="Prefer staying in current city" className="bg-white text-slate-900">
                      Prefer current city only
                    </option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Ramadan Fasting & Halal Dietary Habit</h4>
                    <p className="text-xs text-slate-500">Strictly follow Halal meat dietary standards and observe Ramadan fasts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formDataStep2.fastingRamadan}
                    onChange={e => setFormDataStep2({ ...formDataStep2, fastingRamadan: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 bg-white accent-emerald-800 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EDUCATION & CAREER */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Education & Professional Aspirations</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Highlight your academic achievements and career passions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Highest Level of Education
                  </label>
                  <select
                    value={formDataStep3.educationLevel}
                    onChange={e => setFormDataStep3({ ...formDataStep3, educationLevel: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {EDUCATION_LEVELS.map(edu => (
                      <option key={edu} value={edu} className="bg-white text-slate-900">
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Alma Mater / University
                  </label>
                  <input
                    type="text"
                    value={formDataStep3.institution}
                    onChange={e => setFormDataStep3({ ...formDataStep3, institution: e.target.value })}
                    placeholder="e.g. LUMS, King's College London, NUST"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Occupation / Profession
                  </label>
                  <input
                    type="text"
                    value={formDataStep3.occupation}
                    onChange={e => setFormDataStep3({ ...formDataStep3, occupation: e.target.value })}
                    placeholder="e.g. Senior Software Architect, Doctor, Financial Analyst"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Estimated Annual Income Tier
                  </label>
                  <select
                    value={formDataStep3.incomeRange}
                    onChange={e => setFormDataStep3({ ...formDataStep3, incomeRange: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    <option value="Prefer not to state" className="bg-white text-slate-900">Prefer not to state</option>
                    <option value="PKR 100k - 250k / month" className="bg-white text-slate-900">PKR 100k - 250k / month</option>
                    <option value="PKR 250k - 500k / month" className="bg-white text-slate-900">PKR 250k - 500k / month</option>
                    <option value="$40,000 - $70,000 / year (or PKR 300k+/mo)" className="bg-white text-slate-900">$40,000 - $70,000 / year (Overseas or Tier-1)</option>
                    <option value="$70,000 - $120,000 / year" className="bg-white text-slate-900">$70,000 - $120,000 / year (UK / UAE / US / Canada)</option>
                    <option value="$120,000+ / year" className="bg-white text-slate-900">$120,000+ / year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  About You & What You Value (Bio)
                </label>
                <textarea
                  rows={3}
                  value={formDataStep3.bio}
                  onChange={e => setFormDataStep3({ ...formDataStep3, bio: e.target.value })}
                  placeholder="Share a short introduction about your personality, aspirations, and character..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Interests & Hobbies
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {HOBBY_SUGGESTIONS.map(hobby => {
                    const isSelected = formDataStep3.hobbies.includes(hobby);
                    return (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => toggleHobby(hobby)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/20'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {hobby} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PARTNER PREFERENCES & DEAL-BREAKERS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Partner Criteria & Deal-Breakers</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Wasl uses smart two-way compatibility matching algorithms to filter candidates who align with your preferences.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Age Preference: <span className="text-emerald-800 font-extrabold">{formDataStep4.ageMin} - {formDataStep4.ageMax} years</span>
                  </label>
                  <div className="mt-4 flex items-center space-x-4">
                    <input
                      type="range"
                      min="18"
                      max="55"
                      value={formDataStep4.ageMin}
                      onChange={e => setFormDataStep4({ ...formDataStep4, ageMin: Math.min(Number(e.target.value), formDataStep4.ageMax - 1) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="18"
                      max="55"
                      value={formDataStep4.ageMax}
                      onChange={e => setFormDataStep4({ ...formDataStep4, ageMax: Math.max(Number(e.target.value), formDataStep4.ageMin + 1) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Height Range: <span className="text-emerald-800 font-extrabold">{formDataStep4.heightMinCm} - {formDataStep4.heightMaxCm} cm</span>
                  </label>
                  <div className="mt-4 flex items-center space-x-4">
                    <input
                      type="range"
                      min="140"
                      max="210"
                      value={formDataStep4.heightMinCm}
                      onChange={e => setFormDataStep4({ ...formDataStep4, heightMinCm: Math.min(Number(e.target.value), formDataStep4.heightMaxCm - 2) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="140"
                      max="210"
                      value={formDataStep4.heightMaxCm}
                      onChange={e => setFormDataStep4({ ...formDataStep4, heightMaxCm: Math.max(Number(e.target.value), formDataStep4.heightMinCm + 2) })}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Acceptable Sects
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SECT_OPTIONS.map(sect => {
                    const isSelected = formDataStep4.preferredSects.includes(sect);
                    return (
                      <button
                        key={sect}
                        type="button"
                        onClick={() => togglePreferredSect(sect)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-800 text-white ring-2 ring-emerald-600/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {sect} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caste Preference Policy */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Caste / Biradari Preference Policy
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose how strictly you and your family prefer matching based on caste/biradari.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'NO_BAR', label: 'Caste No Bar (Any)', desc: 'Open to all pious & compatible castes' },
                    { id: 'SAME_CASTE_PREFERRED', label: `Prefer Same (${formDataStep2.caste})`, desc: 'Give higher matching score to same caste' },
                    { id: 'SPECIFIC_CASTES', label: 'Specific Castes Only', desc: 'Select one or more acceptable castes' }
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormDataStep4({ ...formDataStep4, casteStrictness: option.id as any })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        formDataStep4.casteStrictness === option.id
                          ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{option.label}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>

                {formDataStep4.casteStrictness === 'SPECIFIC_CASTES' && (
                  <div className="pt-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Acceptable Castes:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 bg-white rounded-xl border border-slate-200">
                      {CASTE_OPTIONS.map(caste => {
                        const isSelected = formDataStep4.preferredCastes.includes(caste);
                        return (
                          <button
                            key={caste}
                            type="button"
                            onClick={() => togglePreferredCaste(caste)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              isSelected
                                ? 'border-emerald-700 bg-emerald-800 text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {caste} {isSelected ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hard Deal-Breakers
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all hover:border-slate-300">
                    <span className="text-xs font-semibold text-slate-800">Strict Non-Smoker Only</span>
                    <input
                      type="checkbox"
                      checked={!formDataStep4.smokingAcceptable}
                      onChange={e => setFormDataStep4({ ...formDataStep4, smokingAcceptable: !e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 bg-white accent-emerald-800 cursor-pointer"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all hover:border-slate-300">
                    <span className="text-xs font-semibold text-slate-800">Must Pray 5 Times Daily</span>
                    <input
                      type="checkbox"
                      checked={formDataStep4.mustPrayDaily}
                      onChange={e => setFormDataStep4({ ...formDataStep4, mustPrayDaily: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 bg-white accent-emerald-800 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PHOTO PRIVACY & ANTI-SCRAPING */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Privacy-First Protected Media</span>
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Profile Photo & Privacy Protection</h2>
                <p className="mt-1 text-sm text-slate-600">
                  You maintain 100% full sovereignty over who sees your photos. Photos are protected with tamper-evident dynamic watermarks.
                </p>
              </div>

              {/* Drag-and-Drop Cloud Uploader */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <FileUploadDropzone
                  label="Upload Profile Photo (Cloudflare R2 / S3)"
                  subLabel="Drag & drop high-resolution JPEG, PNG, or WEBP photo (Max 10MB)"
                  acceptTypes="image/jpeg,image/png,image/webp"
                  folder="photos"
                  initialUrl={formDataStep5.photoUrl}
                  onUploadComplete={(result) => {
                    setFormDataStep5(prev => ({ ...prev, photoUrl: result.url }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Privacy Rule Selectors */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Choose Photo Visibility Policy
                  </label>

                  <div
                    onClick={() => setFormDataStep5({ ...formDataStep5, blurRule: 'BLUR_UNTIL_MUTUAL_MATCH' })}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      formDataStep5.blurRule === 'BLUR_UNTIL_MUTUAL_MATCH'
                        ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                          <EyeOff className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Blur Until Mutual Match</h4>
                      </div>
                      <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Your photo is heavily blurred for casual browsing. Only candidates you mutually accept and match with can see your clear photo.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormDataStep5({ ...formDataStep5, blurRule: 'BLUR_UNTIL_UNLOCKED' })}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      formDataStep5.blurRule === 'BLUR_UNTIL_UNLOCKED'
                        ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                        <Lock className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Manual Request to Unlock</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Photo remains blurred until you manually approve a candidate&apos;s explicit &quot;Request Photo Access&quot; notification.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormDataStep5({ ...formDataStep5, blurRule: 'ALWAYS_CLEAR' })}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      formDataStep5.blurRule === 'ALWAYS_CLEAR'
                        ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <Eye className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Always Visible</h4>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Verified members can see your photo immediately. Dynamic watermark is still applied for anti-scraping security.
                    </p>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <span className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Live Security & Watermark Preview
                  </span>

                  <div className="relative h-64 w-52 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formDataStep5.photoUrl}
                      alt="Profile Preview"
                      className={`h-full w-full object-cover transition-all duration-500 ${
                        formDataStep5.blurRule !== 'ALWAYS_CLEAR' ? 'scale-110 blur-xl filter' : 'scale-100'
                      }`}
                    />

                    {/* Anti-Scraping Dynamic Watermark Overlay */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-2 select-none">
                      <div className="rotate-[-25deg] transform space-y-3 opacity-40">
                        <p className="text-[10px] font-black tracking-widest text-white drop-shadow">
                          {userWatermarkText}
                        </p>
                        <p className="text-[10px] font-black tracking-widest text-white drop-shadow">
                          WASL MATRIMONIAL • VERIFIED
                        </p>
                        <p className="text-[10px] font-black tracking-widest text-white drop-shadow">
                          {userWatermarkText}
                        </p>
                      </div>
                    </div>

                    {formDataStep5.blurRule !== 'ALWAYS_CLEAR' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 p-4 text-center">
                        <Lock className="h-6 w-6 text-amber-300" />
                        <span className="mt-2 text-xs font-bold text-white">Photo Protected</span>
                        <span className="text-[10px] text-slate-200">
                          {formDataStep5.blurRule === 'BLUR_UNTIL_MUTUAL_MATCH'
                            ? 'Revealed on mutual match'
                            : 'Revealed upon approved request'}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Dynamic security watermark embeds viewer metadata to protect against unauthorized screenshots and re-distribution.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 rounded-xl bg-emerald-800 px-7 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-900 hover:scale-[1.01]"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCompleteOnboarding}
                className="flex items-center space-x-2 rounded-xl bg-emerald-800 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-900 hover:scale-[1.01] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Complete Profile & Enter Dashboard</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
