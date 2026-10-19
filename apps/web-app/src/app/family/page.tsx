'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Lightbulb,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  Heart,
  Send
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/apiConfig';

interface GuardianItem {
  id: string;
  name: string;
  phone: string;
  relation: string;
  status: 'ACCEPTED' | 'PENDING';
  permissions: {
    view_profile: boolean;
    view_family_info: boolean;
    suggest_matches: boolean;
    review_proposals: boolean;
    chaperone_chat: boolean;
  };
}

const DEFAULT_GUARDIANS: GuardianItem[] = [
  {
    id: 'g-1',
    name: 'Mrs. Parveen Khan',
    phone: '+92 300 8888888',
    relation: 'Mother',
    status: 'ACCEPTED',
    permissions: {
      view_profile: true,
      view_family_info: true,
      suggest_matches: true,
      review_proposals: true,
      chaperone_chat: true
    }
  },
  {
    id: 'g-2',
    name: 'Tariq Khan',
    phone: '+92 321 9999999',
    relation: 'Father / Wali',
    status: 'ACCEPTED',
    permissions: {
      view_profile: true,
      view_family_info: true,
      suggest_matches: true,
      review_proposals: true,
      chaperone_chat: false
    }
  }
];

export default function FamilyWorkspacePage() {
  const [guardians, setGuardians] = useState<GuardianItem[]>(DEFAULT_GUARDIANS);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRelation, setInviteRelation] = useState('Father');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewGuardian, setPreviewGuardian] = useState<GuardianItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wasl_family_guardians');
    if (saved) {
      try {
        setGuardians(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveGuardians = (updated: GuardianItem[]) => {
    setGuardians(updated);
    localStorage.setItem('wasl_family_guardians', JSON.stringify(updated));
  };

  const togglePermission = (guardianId: string, permKey: keyof GuardianItem['permissions']) => {
    const updated = guardians.map(g => {
      if (g.id === guardianId) {
        return {
          ...g,
          permissions: {
            ...g.permissions,
            [permKey]: !g.permissions[permKey]
          }
        };
      }
      return g;
    });
    saveGuardians(updated);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !invitePhone) return;

    const newGuardian: GuardianItem = {
      id: `g-${Date.now()}`,
      name: inviteName,
      phone: invitePhone,
      relation: inviteRelation,
      status: 'PENDING',
      permissions: {
        view_profile: true,
        view_family_info: true,
        suggest_matches: true,
        review_proposals: true,
        chaperone_chat: false
      }
    };

    const updated = [...guardians, newGuardian];
    saveGuardians(updated);

    // Trigger Notification Hub Alert
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/notifications/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'GUARDIAN',
          title: `Guardian Invite Dispatched`,
          message: `SMS invitation link sent to ${inviteName} (${inviteRelation}) at ${invitePhone}.`,
          actionUrl: '/family'
        })
      });
    } catch {}

    setToastMessage(`SMS Invite sent to ${inviteName} (${invitePhone})! Guardian seat added.`);
    setTimeout(() => setToastMessage(null), 4500);

    setInviteName('');
    setInvitePhone('');
    setShowInviteModal(false);
  };

  const handleRemoveGuardian = (id: string, name: string) => {
    const updated = guardians.filter(g => g.id !== id);
    saveGuardians(updated);
    setToastMessage(`Removed ${name} from Family Workspace.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Users className="w-3.5 h-3.5" />
            Islamic Wali & Family Chaperone Mode Active
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Family Mode & Guardian Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Invite trusted parents or siblings with granular, instantly revokable permissions. You retain sovereign account ownership.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-2 shadow-md hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" /> Add / Invite Family Member
          </button>
        </div>
      </div>

      {/* Guardians List */}
      <div className="space-y-6">
        {guardians.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No family members linked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your father, mother, or guardian to enable Islamic Wali supervision and proposal review.
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="mt-2 px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl"
            >
              Invite Family Member
            </button>
          </div>
        ) : (
          guardians.map(g => (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-base border border-emerald-300 shadow-sm">
                    {g.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{g.name}</h2>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {g.relation}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{g.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {g.status === 'ACCEPTED' ? 'Active Wali Seat ✓' : 'SMS Invite Dispatched'}
                  </div>

                  {/* Guardian View Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewGuardian(g)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                    title="Preview Guardian Workspace View"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveGuardian(g.id, g.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove Family Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Granular Permission Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Scoped Permissions (Instantly Revokable by Candidate)
                  </h3>
                  <span className="text-[11px] text-slate-400">Click any card to toggle permission</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'view_profile', label: 'View Verified Profile', desc: 'Can view candidate profile data and badges' },
                    { key: 'view_family_info', label: 'View Family Details', desc: 'Can inspect matches family structure' },
                    { key: 'suggest_matches', label: 'Suggest Candidates', desc: 'Can recommend profiles into candidate inbox' },
                    { key: 'review_proposals', label: 'Review Proposals', desc: 'Can add family feedback notes on proposals' },
                    { key: 'chaperone_chat', label: 'Chaperone Supervised Chat', desc: 'Read-only access to candidate chat thread' }
                  ].map(item => {
                    const permKey = item.key as keyof GuardianItem['permissions'];
                    const isGranted = g.permissions[permKey];
                    return (
                      <div
                        key={item.key}
                        onClick={() => togglePermission(g.id, permKey)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 select-none ${
                          isGranted
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold transition ${
                            isGranted ? 'bg-emerald-700' : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          {isGranted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* GUARDIAN WORKSPACE PREVIEW MODAL */}
      {previewGuardian && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Guardian Perspective Preview</h3>
                  <p className="text-xs text-slate-500">How {previewGuardian.name} ({previewGuardian.relation}) views your portal</p>
                </div>
              </div>
              <button onClick={() => setPreviewGuardian(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Active Guardian Capabilities:</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={previewGuardian.permissions.view_profile ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {previewGuardian.permissions.view_profile ? '✓' : '✗'} View Full Candidate Profile & Badges
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={previewGuardian.permissions.view_family_info ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {previewGuardian.permissions.view_family_info ? '✓' : '✗'} View Match Family Background & Values
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={previewGuardian.permissions.suggest_matches ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {previewGuardian.permissions.suggest_matches ? '✓' : '✗'} Suggest Recommendations with Family Notes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={previewGuardian.permissions.review_proposals ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {previewGuardian.permissions.review_proposals ? '✓' : '✗'} Co-Review Active Match Proposals
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={previewGuardian.permissions.chaperone_chat ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {previewGuardian.permissions.chaperone_chat ? '✓' : '✗'} Read-Only Supervised Chat Chaperone
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewGuardian(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add Family Member / Wali</h2>
                <p className="text-xs text-slate-500 mt-0.5">They will receive an invitation to join your workspace</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Tariq Khan / Mrs. Parveen Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship <span className="text-rose-500">*</span>
                </label>
                <select
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Father / Wali">Father / Wali</option>
                  <option value="Mother">Mother</option>
                  <option value="Elder Brother">Elder Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Uncle (Paternal/Maternal)">Uncle (Paternal/Maternal)</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Other Guardian">Other Family Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for SMS Verification Link) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+92 300 1234567 or +44 7123 456789"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Invitation & Add Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
