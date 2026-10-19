'use client';

import React from 'react';
import { ShieldCheck, Lock, Heart, CheckCircle2, X, Sparkles, MessageCircle } from 'lucide-react';
import { MatchStatus } from '../utils/matchStore';

interface MutualMatchConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateId: string;
  status: MatchStatus;
  onSendProposal: (id: string) => void;
  onAcceptProposal?: (id: string) => void;
}

export default function MutualMatchConsentModal({
  isOpen,
  onClose,
  candidateName,
  candidateId,
  status,
  onSendProposal,
  onAcceptProposal
}: MutualMatchConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-200 animate-scaleUp relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 mx-auto flex items-center justify-center text-emerald-800 shadow-sm">
          {status === 'MUTUAL_MATCH' ? (
            <MessageCircle className="w-8 h-8" />
          ) : (
            <Lock className="w-8 h-8 text-amber-600" />
          )}
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mutual Match Gate (Consent-First)</span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900">
            {status === 'NOT_CONNECTED' && `Direct Chat with ${candidateName} is Protected`}
            {status === 'SENT_PENDING' && `Proposal Sent to ${candidateName}`}
            {status === 'RECEIVED_PENDING' && `${candidateName} has Sent You a Proposal!`}
            {status === 'MUTUAL_MATCH' && `Direct Chat Unlocked with ${candidateName}`}
          </h3>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {status === 'NOT_CONNECTED' && (
              <>
                To prevent unsolicited messaging and safeguard candidate privacy, users cannot DM someone out of the blue.
                Direct chat unlocks <strong>only when both parties express mutual interest</strong>.
              </>
            )}
            {status === 'SENT_PENDING' && (
              <>
                You have expressed interest in {candidateName}. The moment they accept your proposal, your encrypted direct chat thread will unlock automatically!
              </>
            )}
            {status === 'RECEIVED_PENDING' && (
              <>
                {candidateName} is interested in your profile and requested a connection. Accept their proposal below to unlock direct chat immediately!
              </>
            )}
            {status === 'MUTUAL_MATCH' && (
              <>
                Both of you have accepted mutual interest! Your supervised direct chat is active and ready.
              </>
            )}
          </p>
        </div>

        {/* Status Flow Steps */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            How Mutual Matching Works:
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                status !== 'NOT_CONNECTED' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </span>
              <span className={status !== 'NOT_CONNECTED' ? 'text-slate-900 font-semibold' : 'text-slate-600'}>
                Send an Interest / Proposal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                status === 'MUTUAL_MATCH' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </span>
              <span className={status === 'MUTUAL_MATCH' ? 'text-slate-900 font-semibold' : 'text-slate-600'}>
                Both Candidates Accept (Mutual Consent)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                status === 'MUTUAL_MATCH' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </span>
              <span className={status === 'MUTUAL_MATCH' ? 'text-emerald-900 font-bold' : 'text-slate-600'}>
                Direct Chat & Photos Unlocked
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
          >
            Close
          </button>

          {status === 'NOT_CONNECTED' && (
            <button
              onClick={() => {
                onSendProposal(candidateId);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Heart className="w-3.5 h-3.5" /> Send Proposal Now
            </button>
          )}

          {status === 'RECEIVED_PENDING' && onAcceptProposal && (
            <button
              onClick={() => {
                onAcceptProposal(candidateId);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Unlock Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
