'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Flag,
  ArrowRight,
  BookOpen,
  Award,
  Home,
  Check,
  Smile,
  BadgeAlert,
  MessageCircle
} from 'lucide-react';
import { getCandidateMatchStatus } from '../utils/matchStore';

export interface VerifiedBadge {
  id: string;
  type: 'IDENTITY' | 'EDUCATION' | 'EMPLOYMENT' | 'GUARDIAN';
  title: string;
  issuer: string;
  verifiedAt: string;
  authorityLogo?: string;
}

export interface CandidateFullProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  city: string;
  originCity: string;
  profession: string;
  companyOrField: string;
  income: string;
  education: string;
  institution: string;
  gender?: 'MALE' | 'FEMALE';
  sect: string;
  caste?: string;
  prayerLevel: string;
  fastingDietary: string;
  familyType: string;
  score: number;
  photos: string[];
  photoBlurred: boolean;
  aboutMe: string;
  idealPartner: string;
  hobbies: string[];
  familyDetails: {
    fatherProfession: string;
    motherProfession: string;
    siblingSummary: string;
    residenceDetails: string;
    familyValues: string;
  };
  verifiedBadges: VerifiedBadge[];
  alignments: string[];
  discussionPoints: string[];
  explanation: string;
  starters: string[];
}

interface CandidateProfileModalProps {
  candidate: CandidateFullProfile | null;
  onClose: () => void;
  onExpressInterest: (id: string) => void;
  isInterestExpressed: boolean;
  onReportOrBlock: (candidate: CandidateFullProfile) => void;
}

export default function CandidateProfileModal({
  candidate,
  onClose,
  onExpressInterest,
  isInterestExpressed,
  onReportOrBlock
}: CandidateProfileModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState<boolean>(Boolean(candidate?.photoBlurred));
  const [watermarkText, setWatermarkText] = useState<string>('WASL-PROTECTED-VIEWER');

  useEffect(() => {
    if (candidate) {
      setIsPhotoBlurred(Boolean(candidate.photoBlurred));
      setActivePhotoIdx(0);
    }
  }, [candidate]);

  useEffect(() => {
    const userPhone = typeof window !== 'undefined' ? localStorage.getItem('wasl_user_phone') : '';
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('wasl_user_email') : '';
    const identifier = userPhone || userEmail || 'SECURE_VIEWER_902';
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setWatermarkText(`WASL • ${identifier} • ${now} • DO NOT DISTRIBUTE`);
  }, []);

  if (!candidate) return null;

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % candidate.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + candidate.photos.length) % candidate.photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative my-6 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 font-bold text-white text-sm shadow-sm">
              وصل
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">{candidate.name}</h3>
              <p className="text-xs text-slate-500">
                {candidate.age} yrs • {candidate.height} • {candidate.city}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onReportOrBlock(candidate)}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
            >
              <Flag className="h-3.5 w-3.5" /> Report Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="max-h-[78vh] space-y-8 overflow-y-auto p-6 sm:p-8">
          {/* Top Section: Photo Carousel & Key Highlights */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Left 5 Cols: Watermarked Photo Carousel */}
            <div className="flex flex-col items-center md:col-span-5">
              <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl sm:h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={candidate.photos[activePhotoIdx]}
                  alt={`${candidate.name} - Photo ${activePhotoIdx + 1}`}
                  className={`h-full w-full object-cover transition-all duration-300 ${
                    isPhotoBlurred ? 'scale-110 blur-xl filter' : 'scale-100'
                  }`}
                />

                {/* Active Anti-Scraping Dynamic Watermark Overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none opacity-30">
                  <div className="rotate-[-28deg] transform space-y-4 text-center font-mono">
                    <p className="text-[10px] font-black tracking-widest text-white drop-shadow-md">
                      {watermarkText}
                    </p>
                    <p className="text-[10px] font-black tracking-widest text-rose-300 drop-shadow-md">
                      WASL MATRIMONIAL • VERIFIED MEMBER
                    </p>
                    <p className="text-[10px] font-black tracking-widest text-white drop-shadow-md">
                      {watermarkText}
                    </p>
                  </div>
                </div>

                {/* Blur Overlay & Privacy Notice */}
                {isPhotoBlurred && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                    <Lock className="h-8 w-8 text-rose-300 mb-2" />
                    <span className="text-sm font-bold text-white tracking-wide">Photo Protected</span>
                    <span className="text-[11px] text-rose-100 mt-1">
                      Clear photos automatically unlocked upon mutual acceptance.
                    </span>
                  </div>
                )}

                {/* Carousel Navigation Arrows */}
                {candidate.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/75 transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/75 transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Indicator Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur">
                      {candidate.photos.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-all ${
                            activePhotoIdx === idx ? 'w-4 bg-emerald-400' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Photo Privacy Toggle */}
              <button
                type="button"
                onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
              >
                {isPhotoBlurred ? (
                  <>
                    <Eye className="h-4 w-4 text-emerald-700" /> Preview Clear View
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-slate-500" /> Apply Privacy Blur
                  </>
                )}
              </button>
            </div>

            {/* Right 7 Cols: Vital Stats & Compatibility Highlight */}
            <div className="flex flex-col justify-between space-y-6 md:col-span-7">
              <div className="space-y-4">
                {/* Score & Header */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200/80">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Deterministic Match
                    </span>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">{candidate.name}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Current City: {candidate.city} • Origin: {candidate.originCity}
                    </p>
                  </div>

                  <div className="flex flex-col items-end rounded-2xl bg-gradient-to-br from-amber-50 via-emerald-50/40 to-amber-100/50 border border-amber-200/90 px-4 py-2.5 text-right shadow-sm">
                    <span className="text-2xl font-black text-emerald-950 leading-none">{candidate.score}%</span>
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Overall Match</span>
                  </div>
                </div>

                {/* 2x2 Quick Summary */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career & Field</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{candidate.profession}</p>
                    <p className="text-[11px] text-slate-500">{candidate.companyOrField}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Education</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{candidate.education}</p>
                    <p className="text-[11px] text-slate-500">{candidate.institution}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Faith & Community / Caste</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {candidate.sect} {candidate.caste ? `• ${candidate.caste}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500">{candidate.prayerLevel}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Income Bracket</span>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">{candidate.income}</p>
                    <p className="text-[11px] text-slate-500">{candidate.familyType}</p>
                  </div>
                </div>

                {/* Explainable AI Reasoning */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                    Algorithmic Compatibility Breakdown
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{candidate.explanation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Narrative Sections ("About Me" & "My Ideal Partner") */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* About Me */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-slate-900">
                <Smile className="h-5 w-5 text-emerald-700" />
                <h4 className="text-base font-extrabold">About Me & My Life Philosophy</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {candidate.aboutMe}
              </p>

              {/* Hobbies / Interests */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Interests & Activities</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {candidate.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* My Ideal Partner */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-slate-900">
                <Heart className="h-5 w-5 text-rose-600" />
                <h4 className="text-base font-extrabold">My Ideal Partner & Expectations</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {candidate.idealPartner}
              </p>

              {/* Conversation Starters */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curated Conversation Starters</span>
                <div className="mt-2 space-y-1.5">
                  {candidate.starters.map((starter, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs text-slate-700"
                    >
                      &ldquo;{starter}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Verified Badges & Credential Authorities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <h4 className="text-base font-extrabold">Verified Certificates & Discrete Badges</h4>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                100% Trust Verified
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {candidate.verifiedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-slate-900">{badge.title}</h5>
                    <p className="text-[11px] text-slate-600 font-medium">{badge.issuer}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Audit Date:</span>
                    <span className="font-semibold text-slate-600">{badge.verifiedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Family Background Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900">
              <Home className="h-5 w-5 text-indigo-600" />
              <h4 className="text-base font-extrabold">Family Background & Living Setup</h4>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Father&apos;s Background</span>
                <p className="text-xs font-bold text-slate-900">{candidate.familyDetails.fatherProfession}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mother&apos;s Background</span>
                <p className="text-xs font-bold text-slate-900">{candidate.familyDetails.motherProfession}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Siblings Setup</span>
                <p className="text-xs font-bold text-slate-900">{candidate.familyDetails.siblingSummary}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Residence</span>
                <p className="text-xs font-bold text-slate-900">{candidate.familyDetails.residenceDetails}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Family Outlook & Traditions</span>
                <p className="text-xs font-bold text-slate-900">{candidate.familyDetails.familyValues}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Modal Bottom Action Footer */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center space-x-3">
            <Link
              href={`/compatibility/${candidate.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
            >
              <Sparkles className="h-4 w-4" /> Full 6-Dimension Score Analysis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {getCandidateMatchStatus(candidate.id) === 'MUTUAL_MATCH' ? (
              <Link
                href={`/chat/${candidate.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Chat (Unlocked)
              </Link>
            ) : getCandidateMatchStatus(candidate.id) === 'RECEIVED_PENDING' ? (
              <button
                type="button"
                onClick={() => onExpressInterest(candidate.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-100 px-5 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-200 transition shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Accept Proposal & Chat
              </button>
            ) : getCandidateMatchStatus(candidate.id) === 'SENT_PENDING' || isInterestExpressed ? (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600">
                <Lock className="h-3.5 w-3.5 text-amber-600" />
                Pending Match (Chat Locked 🔒)
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onExpressInterest(candidate.id)}
                className="inline-flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-bold shadow transition bg-emerald-800 text-white hover:bg-emerald-900"
              >
                <Heart className="h-3.5 w-3.5" />
                Express Interest & Request Chat
              </button>
            )}

            <Link
              href="/family"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <Users className="h-3.5 w-3.5 text-emerald-700" />
              Discuss with Family Wali
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
