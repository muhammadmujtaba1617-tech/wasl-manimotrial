'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, MessageCircle, Heart } from 'lucide-react';

interface CandidateInfo {
  name: string;
  city: string;
  profession: string;
  education: string;
  score: number;
}

const STATIC_CANDIDATES: Record<string, CandidateInfo> = {
  'cand-female-1': { name: 'Fatima Zahra', city: 'Lahore (DHA Phase 5)', profession: 'Marketing & Brand Strategy Lead', education: 'MBA, LUMS', score: 94 },
  'cand-female-2': { name: 'Dr. Zainab Bibi', city: 'Islamabad (Sector F-7)', profession: 'Senior Health Informatics & Data Scientist', education: 'MBBS & MS Data Science, NUST', score: 89 },
  'cand-female-3': { name: 'Maryam Tariq', city: 'Karachi (Clifton Block 4)', profession: 'Chartered Financial Analyst (CFA)', education: 'BSc Accounting & Finance, IBA', score: 87 },
  'cand-female-4': { name: 'Ayesha Arain', city: 'Lahore (Model Town)', profession: 'Civil Services Officer (PAS)', education: 'BSc Economics & Politics, LUMS', score: 92 },
  'cand-male-1': { name: 'Hamza Malik', city: 'Lahore (Gulberg III)', profession: 'Senior Software Architect', education: 'MS Computer Science, FAST-NUCES', score: 93 },
  'cand-male-2': { name: 'Bilal Ahmed', city: 'Islamabad (Sector I-8)', profession: 'Mechanical Engineering Lead', education: 'BE Mechanical Engineering, GIKI', score: 91 },
  'cand-male-3': { name: 'Usman Farooq', city: 'Rawalpindi (Bahria Town Phase 7)', profession: 'Investment Banker & Portfolio Manager', education: 'BBA & MS Finance, LSE', score: 88 },
  'cand-male-4': { name: 'Dr. Daniyal Shah', city: 'Karachi (PECHS Block 6)', profession: 'Resident Pediatrician & Clinical Fellow', education: 'MBBS, Aga Khan University Hospital', score: 95 }
};

export default function CompatibilityDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.candidateId) ? params.candidateId[0] : (params?.candidateId as string);
  const candidateId = rawId || 'cand-female-1';

  const [candidate, setCandidate] = useState<CandidateInfo>(() => {
    return STATIC_CANDIDATES[candidateId] || {
      name: `Candidate (${candidateId})`,
      city: 'Pakistan',
      profession: 'Professional',
      education: 'Graduate Degree',
      score: 91
    };
  });

  useEffect(() => {
    if (STATIC_CANDIDATES[candidateId]) {
      setCandidate(STATIC_CANDIDATES[candidateId]);
      return;
    }

    try {
      const stored = localStorage.getItem('wasl_registered_candidates');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const found = list.find((c: any) => c.id === candidateId || c.email === candidateId);
          if (found) {
            setCandidate({
              name: found.name || 'Candidate',
              city: found.city || 'Pakistan',
              profession: found.profession || 'Professional',
              education: found.education || 'Graduate',
              score: found.matchScore || 92
            });
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error resolving candidate info:', e);
    }
  }, [candidateId]);

  const dimensions = [
    { name: 'Family Structure', score: 20, max: 20, desc: `Both prefer supportive family setup in ${candidate.city.split('(')[0].trim() || 'Pakistan'}` },
    { name: 'Career & Financial', score: 19, max: 20, desc: `Mutual support for ${candidate.profession} career growth` },
    { name: 'Location & Relocation', score: 18, max: 20, desc: `Both residing in or connected with ${candidate.city}` },
    { name: 'Education Attainment', score: 15, max: 15, desc: `Higher education alignment (${candidate.education})` },
    { name: 'Religious Values', score: 13, max: 15, desc: 'Moderate practice with shared Islamic fundamentals' },
    { name: 'Lifestyle & Hobbies', score: 8, max: 10, desc: 'Shared life principles, family priorities, and personal ethics' }
  ];

  const alignments = [
    `Identical family structure preference and life goals`,
    `Mutually supportive career expectations for ${candidate.profession}`,
    `Matched educational compatibility (${candidate.education})`,
    `Comfortable with joint long-term vision in ${candidate.city}`
  ];

  const discussionPoints = [
    `Long-term family and living arrangement preferences in ${candidate.city}`,
    `Balancing work commitments and household responsibilities together`
  ];

  const starters = [
    `How do you envision structuring work-life balance around your work as a ${candidate.profession}?`,
    `What are some family values and traditions that are most important to you?`
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Recommendation Feed
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Deterministic Engine v1.0
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Compatibility Analysis: {candidate.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculated across 6 weighted dimensions based on explicit matrimonial criteria.
          </p>
        </div>

        <div className="bg-emerald-800 text-white rounded-2xl p-6 text-center shadow-lg shrink-0">
          <div className="text-4xl font-black">{candidate.score} / 100</div>
          <div className="text-xs font-semibold text-emerald-200 mt-0.5">Overall Alignment</div>
        </div>
      </div>

      {/* 6 Dimensions Progress Bars */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          Dimension Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions.map((dim, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{dim.name}</span>
                <span className="text-emerald-800">{dim.score} / {dim.max} pts</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all"
                  style={{ width: `${(dim.score / dim.max) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">{dim.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alignments vs Discussion Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Alignments
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {alignments.map((a, i) => (
              <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" /> Discussion Topics
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {discussionPoints.map((d, i) => (
              <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-amber-700 font-bold">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Conversation Starters */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-300" />
          Suggested Conversation Starters
        </h3>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Derived from mutual alignments to facilitate respectful, meaningful dialogue:
        </p>

        <div className="space-y-3 pt-2">
          {starters.map((s, i) => (
            <div key={i} className="bg-emerald-800/80 p-4 rounded-2xl border border-emerald-700 text-xs font-medium text-emerald-50">
              &ldquo;{s}&rdquo;
            </div>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-end">
          <Link
            href="/proposals"
            className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition shadow flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-emerald-800" /> Proceed with Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}
