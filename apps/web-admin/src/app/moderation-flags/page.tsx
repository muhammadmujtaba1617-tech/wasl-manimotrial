'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Ban,
  MessageSquare,
  ShieldAlert,
  Clock,
  UserX,
  Flag,
  ShieldCheck,
  Check,
  RefreshCw
} from 'lucide-react';

interface FlaggedItem {
  id: string;
  threadId: string;
  senderName: string;
  recipientName: string;
  snippet: string;
  flagType: 'PAK_PHONE_NUMBER' | 'EXTERNAL_SOCIAL_HANDLE' | 'PAYMENT_KEYWORD';
  confidence: string;
  detectedAt: string;
}

interface UserReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedCandidateId: string;
  reportedCandidateName: string;
  category: string;
  reason: string;
  details?: string;
  status: 'PENDING_REVIEW' | 'WARNED' | 'BANNED' | 'DISMISSED';
  createdAt: string;
}

const INITIAL_FLAGS: FlaggedItem[] = [
  {
    id: 'flag-1',
    threadId: 'thread-demo',
    senderName: 'Bilal Khan',
    recipientName: 'Fatima Zahra',
    snippet: 'Here is my direct phone: 0300-1234567, text me on WhatsApp',
    flagType: 'PAK_PHONE_NUMBER',
    confidence: '99.8%',
    detectedAt: '5 Mins Ago'
  }
];

const INITIAL_REPORTS: UserReportItem[] = [
  {
    id: 'rep-1',
    reporterId: 'cand-female-1',
    reporterName: 'Fatima Zahra',
    reportedCandidateId: 'cand-male-suspicious-9',
    reportedCandidateName: 'Kamran Ali (Unverified)',
    category: 'SUSPICIOUS_COMMERCIAL',
    reason: 'Commercial Matchmaking Agent soliciting off-platform broker commission',
    details: 'Sent unprompted message asking for PKR 50,000 upfront registration fee.',
    status: 'PENDING_REVIEW',
    createdAt: '35 mins ago'
  }
];

export default function ModerationFlagsPage() {
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'PII_FLAGS'>('REPORTS');
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [reports, setReports] = useState<UserReportItem[]>(INITIAL_REPORTS);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/safety/admin/reports');
      if (res.ok) {
        const data = await res.json();
        if (data.reports && data.reports.length > 0) {
          setReports(data.reports);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFlagAction = (id: string, action: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    setActionSuccess(`Automated flag ${id} resolved: ${action}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleReportAction = async (reportId: string, decision: 'WARNED' | 'BANNED' | 'DISMISSED') => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: decision } : r))
    );

    try {
      await fetch(`http://localhost:4000/api/v1/safety/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision })
      });
    } catch {}

    const actionText =
      decision === 'BANNED'
        ? 'Account Suspended & Banned'
        : decision === 'WARNED'
        ? 'Official Warning Issued'
        : 'Report Dismissed';

    setActionSuccess(`Incident ${reportId} resolved: ${actionText}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Trust & Safety Moderation Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit user-submitted incident reports and automated contact leak prevention queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-4">
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'REPORTS'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>User Incident Reports</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] border border-rose-800">
            {reports.filter(r => r.status === 'PENDING_REVIEW').length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PII_FLAGS')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'PII_FLAGS'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Automated PII Flags</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] border border-amber-800">
            {flags.length}
          </span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-900/60 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {actionSuccess}
        </div>
      )}

      {/* TAB 1: USER INCIDENT REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-slate-950 rounded-3xl p-12 text-center space-y-3 border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h2 className="text-base font-bold text-white">No pending safety reports</h2>
              <p className="text-xs text-slate-400">All community incident tickets have been processed.</p>
            </div>
          ) : (
            reports.map(report => (
              <div
                key={report.id}
                className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">
                      Reported: <span className="text-rose-400">{report.reportedCandidateName}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Category: {report.category}
                    </span>
                    {report.status !== 'PENDING_REVIEW' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Status: {report.status}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Filed by {report.reporterName} • {report.createdAt}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-200">Violation Reason:</div>
                  <p className="text-slate-300">{report.reason}</p>
                  {report.details && (
                    <p className="text-slate-400 text-[11px] pt-1 italic">
                      Context: &ldquo;{report.details}&rdquo;
                    </p>
                  )}
                </div>

                {report.status === 'PENDING_REVIEW' ? (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleReportAction(report.id, 'DISMISSED')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                    >
                      Dismiss Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReportAction(report.id, 'WARNED')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-950 text-amber-200 text-xs font-bold border border-amber-800 hover:bg-amber-900 transition flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Issue Warning Notice
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReportAction(report.id, 'BANNED')}
                      className="px-3.5 py-1.5 rounded-xl bg-red-950 text-red-200 text-xs font-bold border border-red-800 hover:bg-red-900 transition flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspend & Permanent Ban
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 justify-end pt-2">
                    <CheckCircle2 className="w-4 h-4" /> Incident Resolved: {report.status}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: AUTOMATED PII DETECTION FLAGS */}
      {activeTab === 'PII_FLAGS' && (
        <div className="space-y-4">
          {flags.length === 0 ? (
            <div className="bg-slate-950 rounded-3xl p-12 text-center space-y-3 border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h2 className="text-base font-bold text-white">No active PII flags</h2>
              <p className="text-xs text-slate-400">All message streams are clean and compliant.</p>
            </div>
          ) : (
            flags.map(flag => (
              <div
                key={flag.id}
                className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">
                      {flag.senderName} ➔ {flag.recipientName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Rule Triggered: {flag.flagType}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {flag.detectedAt}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200">
                  &ldquo;{flag.snippet}&rdquo;
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFlagAction(flag.id, 'Dismissed (False Positive)')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    Dismiss Flag
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFlagAction(flag.id, 'Warning Sent to User')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-950 text-amber-200 text-xs font-bold border border-amber-800 hover:bg-amber-900 transition flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Issue Warning
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFlagAction(flag.id, 'Thread Locked')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-950 text-red-200 text-xs font-bold border border-red-800 hover:bg-red-900 transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Lock Thread
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
