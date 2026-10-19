'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  UserCheck,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface KycItem {
  id: string;
  candidateName: string;
  candidateId: string;
  documentType: 'CNIC_SELFIE' | 'DEGREE_SCAN' | 'EMPLOYMENT_SALARY';
  targetBadge: string;
  submittedAt: string;
  claimDetails: Record<string, string>;
  documentMeta: {
    fileName: string;
    kmsKeyId: string;
    fileSize: string;
  };
}

const INITIAL_QUEUE: KycItem[] = [
  {
    id: 'doc-101',
    candidateName: 'Ahmed Khan',
    candidateId: 'cand-ahmed-1',
    documentType: 'DEGREE_SCAN',
    targetBadge: 'EDUCATION',
    submittedAt: '10 Mins Ago',
    claimDetails: {
      'Institution': 'LUMS (Lahore University of Management Sciences)',
      'Degree': 'Master of Science in Computer Science (MS CS)',
      'Graduation Year': '2020',
      'HEC Attestation Ref': 'HEC-PK-892147'
    },
    documentMeta: {
      fileName: 'ahmed_lums_ms_transcript.pdf.enc',
      kmsKeyId: 'arn:aws:kms:me-south-1:992:key/wasl-kyc-enc',
      fileSize: '2.4 MB'
    }
  },
  {
    id: 'doc-102',
    candidateName: 'Fatima Zahra',
    candidateId: 'cand-fatima-1',
    documentType: 'CNIC_SELFIE',
    targetBadge: 'CNIC_IDENTITY',
    submittedAt: '35 Mins Ago',
    claimDetails: {
      'CNIC Number': '35201-XXXXXXX-4 (Redacted)',
      'DOB': '14-Sep-1997',
      'NADRA Liveness Score': '99.4% (Facial Geometry Match)',
      'City of Origin': 'Lahore'
    },
    documentMeta: {
      fileName: 'fatima_cnic_front_liveness.webp.enc',
      kmsKeyId: 'arn:aws:kms:me-south-1:992:key/wasl-kyc-enc',
      fileSize: '1.8 MB'
    }
  }
];

export default function KycQueuePage() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [activeItem, setActiveItem] = useState<KycItem | null>(INITIAL_QUEUE[0]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDecision = (id: string, decision: 'APPROVE' | 'REJECT') => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (activeItem?.id === id) {
      const remaining = queue.filter(item => item.id !== id);
      setActiveItem(remaining.length > 0 ? remaining[0] : null);
    }
    setActionSuccess(`Document ${id} marked as ${decision === 'APPROVE' ? 'Approved (Badge Issued)' : 'Rejected'}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            KYC Verification Review Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authenticate identity and credential proofs before issuing discrete verification badges.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          {queue.length} Submissions Pending
        </span>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-900/60 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {actionSuccess}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="bg-slate-950 rounded-3xl p-12 text-center space-y-3 border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h2 className="text-base font-bold text-white">Queue is clear</h2>
          <p className="text-xs text-slate-400">All submitted documents have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue List */}
          <div className="space-y-3">
            {queue.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                  activeItem?.id === item.id
                    ? 'bg-slate-800 border-emerald-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.candidateName}</span>
                  <span className="text-[10px] text-slate-400">{item.submittedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Badge: {item.targetBadge}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.documentType}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-Side Reviewer Pane */}
          {activeItem && (
            <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeItem.candidateName}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Target Badge: <span className="text-emerald-400 font-semibold">{activeItem.targetBadge}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  KMS Encrypted Storage
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Candidate Claims */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Claimed Credentials
                  </h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(activeItem.claimDetails).map(([k, v]) => (
                      <div key={k} className="border-b border-slate-800/80 pb-1.5">
                        <span className="text-[11px] text-slate-400 block">{k}</span>
                        <span className="text-xs font-semibold text-slate-100">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Document Scan Preview */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Document Proof
                    </h3>
                    <div className="h-36 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center space-y-1">
                      <FileText className="w-8 h-8 text-emerald-500" />
                      <div className="text-xs font-mono text-slate-300 truncate max-w-full">
                        {activeItem.documentMeta.fileName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {activeItem.documentMeta.fileSize} • Valid Signature
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center font-mono">
                    Key: {activeItem.documentMeta.kmsKeyId.slice(0, 30)}...
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDecision(activeItem.id, 'REJECT')}
                  className="px-4 py-2 rounded-xl bg-red-950/60 text-red-300 text-xs font-bold border border-red-800 hover:bg-red-900/80 transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject Proof
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(activeItem.id, 'APPROVE')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Issue Badge
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
