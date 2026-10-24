'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MessageSquare,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getMatchStates, setCandidateMatchStatus, MatchStatus } from '../../utils/matchStore';

interface ProposalCardData {
  id: string;
  candidateId: string;
  candidateName: string;
  avatarInitials: string;
  photoUrl?: string;
  age: number;
  city: string;
  profession: string;
  education: string;
  matchScore: number;
  stageName: string;
  stepNumber: number;
  lastAction: string;
  category: 'mutual' | 'received' | 'sent';
}

const ALL_PROPOSALS: ProposalCardData[] = [
  {
    id: 'prop-1',
    candidateId: 'cand-female-1',
    candidateName: 'Fatima Zahra',
    avatarInitials: 'FZ',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    age: 28,
    city: 'Lahore (DHA Phase 5)',
    profession: 'Marketing & Brand Strategy Lead',
    education: 'MBA, LUMS',
    matchScore: 94,
    stageName: 'Stage 5: Supervised Chat Active',
    stepNumber: 5,
    lastAction: 'Both parties accepted mutual interest. Direct chat is unlocked & encrypted.',
    category: 'mutual'
  },
  {
    id: 'prop-2',
    candidateId: 'cand-female-2',
    candidateName: 'Dr. Zainab Bibi',
    avatarInitials: 'ZB',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    age: 27,
    city: 'Islamabad (Sector F-7)',
    profession: 'Senior Health Informatics & Data Scientist',
    education: 'MBBS & MS Data Science, NUST',
    matchScore: 89,
    stageName: 'Stage 2: Proposal Received',
    stepNumber: 2,
    lastAction: 'Dr. Zainab and her family sent an interest proposal to you. Accept to unlock chat.',
    category: 'received'
  },
  {
    id: 'prop-3',
    candidateId: 'cand-female-4',
    candidateName: 'Ayesha Arain',
    avatarInitials: 'AA',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    age: 25,
    city: 'Lahore (Model Town)',
    profession: 'Civil Services Officer (PAS)',
    education: 'BSc Economics & Politics, LUMS',
    matchScore: 92,
    stageName: 'Stage 2: Proposal Received',
    stepNumber: 2,
    lastAction: 'Ayesha sent you a direct proposal introduction request. Accept to unlock communication.',
    category: 'received'
  },
  {
    id: 'prop-4',
    candidateId: 'cand-male-1',
    candidateName: 'Hamza Malik',
    avatarInitials: 'HM',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    age: 29,
    city: 'Lahore (Gulberg III)',
    profession: 'Senior Software Architect',
    education: 'MS Computer Science, FAST-NUCES',
    matchScore: 93,
    stageName: 'Stage 3: Family Reviewing',
    stepNumber: 3,
    lastAction: 'You expressed interest. Proposal delivered to candidate & guardian for review.',
    category: 'sent'
  }
];

const STAGES = [
  'Discovered',
  'Interested',
  'Family Interested',
  'Intro Requested',
  'Supervised Chat',
  'Voice / Video',
  'Family Meeting',
  'Engaged'
];

export default function ProposalsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mutual' | 'received' | 'sent'>('mutual');
  const [matchStates, setMatchStates] = useState<Record<string, MatchStatus>>(getMatchStates);
  const [proposals, setProposals] = useState<ProposalCardData[]>(ALL_PROPOSALS);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const sync = () => {
      const currentStates = getMatchStates();
      setMatchStates(currentStates);
      
      // Also sync dynamically if custom registered users have pending sent proposals
      try {
        const storedCustomUsers = localStorage.getItem('wasl_registered_candidates');
        if (storedCustomUsers) {
          const customCands = JSON.parse(storedCustomUsers);
          if (Array.isArray(customCands)) {
            const dynamicSent: ProposalCardData[] = customCands
              .filter(c => currentStates[c.id] === 'SENT_PENDING' || currentStates[c.id] === 'MUTUAL_MATCH')
              .map(c => ({
                id: `prop-dyn-${c.id}`,
                candidateId: c.id,
                candidateName: c.name || 'Candidate',
                avatarInitials: (c.name || 'W').substring(0, 2).toUpperCase(),
                photoUrl: c.photoUrl,
                age: c.age || 26,
                city: c.city || 'Pakistan',
                profession: c.profession || 'Professional',
                education: c.education || 'Graduate',
                matchScore: c.matchScore || 88,
                stageName: currentStates[c.id] === 'MUTUAL_MATCH' ? 'Stage 5: Supervised Chat Active' : 'Stage 2: Proposal Sent',
                stepNumber: currentStates[c.id] === 'MUTUAL_MATCH' ? 5 : 2,
                lastAction: currentStates[c.id] === 'MUTUAL_MATCH' ? 'Proposal accepted! Chat unlocked.' : 'You expressed interest. Pending review.',
                category: currentStates[c.id] === 'MUTUAL_MATCH' ? 'mutual' : 'sent'
              }));

            setProposals(prev => {
              const staticFiltered = prev.filter(p => !p.id.startsWith('prop-dyn-'));
              return [...staticFiltered, ...dynamicSent];
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync dynamic proposals:', err);
      }
    };

    sync();
    window.addEventListener('wasl_match_state_updated', sync);
    return () => window.removeEventListener('wasl_match_state_updated', sync);
  }, []);

  const handleAcceptProposal = (candId: string, candName: string) => {
    setCandidateMatchStatus(candId, 'MUTUAL_MATCH');
    setMatchStates(getMatchStates());
    
    // Update local proposals list
    setProposals(prev =>
      prev.map(p =>
        p.candidateId === candId
          ? { ...p, category: 'mutual', stageName: 'Stage 5: Supervised Chat Active', stepNumber: 5, lastAction: 'You accepted proposal! Direct chat is now unlocked.' }
          : p
      )
    );

    setToastMessage(`Proposal from ${candName} accepted! Direct Chat has been unlocked.`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleDeclineProposal = (candId: string, candName: string) => {
    setCandidateMatchStatus(candId, 'NOT_CONNECTED');
    setMatchStates(getMatchStates());
    setProposals(prev => prev.filter(p => p.candidateId !== candId));
    setToastMessage(`Proposal from ${candName} declined.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredProposals = proposals.filter(p => {
    const status = matchStates[p.candidateId] ?? (
      p.category === 'mutual' ? 'MUTUAL_MATCH' :
      p.category === 'received' ? 'RECEIVED_PENDING' : 'SENT_PENDING'
    );
    if (activeTab === 'mutual') {
      return status === 'MUTUAL_MATCH';
    }
    if (activeTab === 'received') {
      return status === 'RECEIVED_PENDING';
    }
    if (activeTab === 'sent') {
      return status === 'SENT_PENDING';
    }
    return false;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mutual Match Gate (Consent-First)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Proposals & Mutual Matches
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct communication is unlocked only when both parties express mutual consent.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
        >
          <span>Explore Discovery Feed</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <button
          onClick={() => setActiveTab('mutual')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'mutual'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mutual Matches (Chats Unlocked)</span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full ${
            activeTab === 'mutual' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {proposals.filter(p => matchStates[p.candidateId] === 'MUTUAL_MATCH').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'received'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Received Proposals</span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full ${
            activeTab === 'received' ? 'bg-emerald-900 text-white' : 'bg-amber-100 text-amber-900'
          }`}>
            {proposals.filter(p => matchStates[p.candidateId] === 'RECEIVED_PENDING').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'sent'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Sent Proposals (Pending)</span>
          <span className={`text-[10px] px-2 py-0.2 rounded-full ${
            activeTab === 'sent' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {proposals.filter(p => matchStates[p.candidateId] === 'SENT_PENDING').length}
          </span>
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-6">
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No proposals in this section</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'mutual' && 'When both you and another candidate accept interest, your direct chat will appear here.'}
              {activeTab === 'received' && 'You have no pending incoming proposals from other candidates.'}
              {activeTab === 'sent' && 'You have not sent any pending proposals. Explore candidates in Discovery feed.'}
            </p>
          </div>
        ) : (
          filteredProposals.map(prop => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 transition hover:border-slate-300"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-xs overflow-hidden shrink-0">
                    {prop.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={prop.photoUrl} alt={prop.candidateName} className="w-full h-full object-cover" />
                    ) : (
                      prop.avatarInitials
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{prop.candidateName}</h2>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                        {prop.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {prop.profession} • {prop.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {prop.stageName}
                  </span>
                </div>
              </div>

              {/* Visual Funnel Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Relationship Progression Stage</span>
                  <span className="text-emerald-800 font-bold">{Math.round((prop.stepNumber / 8) * 100)}% Complete</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {STAGES.map((s, idx) => (
                    <div
                      key={s}
                      className={`h-2 rounded-full transition ${
                        idx < prop.stepNumber ? 'bg-emerald-700' : 'bg-slate-200'
                      }`}
                      title={`Stage ${idx + 1}: ${s}`}
                    />
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Latest Update: </span>
                  {prop.lastAction}
                </div>

                {matchStates[prop.candidateId] === 'MUTUAL_MATCH' ? (
                  <Link
                    href={`/chat/${prop.candidateId}`}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Open Direct Chat
                  </Link>
                ) : matchStates[prop.candidateId] === 'RECEIVED_PENDING' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeclineProposal(prop.candidateId, prop.candidateName)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptProposal(prop.candidateId, prop.candidateName)}
                      className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept & Unlock Chat
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Candidate Response
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
