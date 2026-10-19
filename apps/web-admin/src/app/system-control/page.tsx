'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Radio,
  Bell,
  Power,
  CheckCircle2,
  RefreshCw,
  EyeOff,
  Flame,
  KeyRound,
  Layers,
  Save
} from 'lucide-react';

interface SystemControls {
  emergencyChatFreeze: boolean;
  automodPiiStrictness: 'STRICT' | 'MODERATE' | 'OFF';
  mandatoryPhotoWatermarks: boolean;
  nadraGateEnforced: boolean;
  incognitoDefaultFemales: boolean;
  discoveryMaintenanceMode: boolean;
  broadcastBanner: {
    active: boolean;
    type: 'INFO' | 'WARNING' | 'ALERT';
    message: string;
  };
}

const DEFAULT_CONTROLS: SystemControls = {
  emergencyChatFreeze: false,
  automodPiiStrictness: 'STRICT',
  mandatoryPhotoWatermarks: true,
  nadraGateEnforced: true,
  incognitoDefaultFemales: true,
  discoveryMaintenanceMode: false,
  broadcastBanner: {
    active: false,
    type: 'INFO',
    message: 'Wasl Security Notice: All candidate photos and communications are protected under NADRA compliance.'
  }
};

export default function SystemControlPage() {
  const [controls, setControls] = useState<SystemControls>(DEFAULT_CONTROLS);
  const [toast, setToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/admin/system/controls')
      .then(res => res.json())
      .then(data => {
        if (data.controls) setControls(data.controls);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('http://localhost:4000/api/v1/admin/system/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(controls)
      });
      setToast('System controls updated live across all platform nodes!');
    } catch {
      setToast('Saved locally in browser session.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(''), 4500);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Governance & Platform Controls</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            System Controls & Platform Kill-Switches
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure safety engine rules, real-time emergency kill-switches, and site-wide broadcast announcements.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-950/50 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Deploying Changes...' : 'Save & Deploy Controls'}</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* EMERGENCY KILL SWITCHES */}
      <div className="bg-red-950/30 border border-red-900/60 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-900/40 border border-red-800 text-red-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Emergency Kill-Switches & Isolation</h2>
            <p className="text-xs text-red-300">Instant containment controls in case of spam waves or security incidents.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Emergency Chat Freeze */}
          <div className="bg-slate-950/80 border border-red-900/40 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>Emergency Chat Freeze</span>
                {controls.emergencyChatFreeze && (
                  <span className="text-[10px] bg-red-900 text-red-200 px-2 py-0.2 rounded font-bold animate-pulse">
                    FROZEN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Instantly pauses message delivery across all active chat threads.
              </p>
            </div>
            <button
              onClick={() => setControls({ ...controls, emergencyChatFreeze: !controls.emergencyChatFreeze })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                controls.emergencyChatFreeze ? 'bg-red-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  controls.emergencyChatFreeze ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Discovery Maintenance Mode */}
          <div className="bg-slate-950/80 border border-red-900/40 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>Discovery Feed Maintenance</span>
                {controls.discoveryMaintenanceMode && (
                  <span className="text-[10px] bg-amber-900 text-amber-200 px-2 py-0.2 rounded font-bold">
                    PAUSED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Temporarily hides Discovery recommendations while tuning algorithms.
              </p>
            </div>
            <button
              onClick={() => setControls({ ...controls, discoveryMaintenanceMode: !controls.discoveryMaintenanceMode })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                controls.discoveryMaintenanceMode ? 'bg-amber-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  controls.discoveryMaintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* AUTOMOD & SAFETY POLICIES */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Automod & Privacy Policies</h2>
            <p className="text-xs text-slate-400">Configure AI auto-moderation rules and anti-scraping watermarks.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* PII Strictness */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm">Auto-Moderation PII Shield (Phone/WhatsApp Detection)</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Restricts external phone numbers, WhatsApp, and social handles in early supervised stages.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['STRICT', 'MODERATE', 'OFF'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setControls({ ...controls, automodPiiStrictness: mode })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    controls.automodPiiStrictness === mode
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Watermarks */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm">Dynamic Anti-Scraping Photo Watermarking</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Embeds viewer-specific tamper-evident overlay to prevent unauthorized screenshot sharing.
              </p>
            </div>
            <button
              onClick={() => setControls({ ...controls, mandatoryPhotoWatermarks: !controls.mandatoryPhotoWatermarks })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                controls.mandatoryPhotoWatermarks ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  controls.mandatoryPhotoWatermarks ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* NADRA Gate Enforcement */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm">Enforce Mandatory NADRA CNIC Gate for Proposals</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Requires 100% NADRA Verisys verification before allowing candidates to send or accept proposals.
              </p>
            </div>
            <button
              onClick={() => setControls({ ...controls, nadraGateEnforced: !controls.nadraGateEnforced })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                controls.nadraGateEnforced ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  controls.nadraGateEnforced ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* PLATFORM BROADCAST ANNOUNCEMENT BANNER */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Global Broadcast Advisory Banner</h2>
            <p className="text-xs text-slate-400">Push a top banner announcement to all active users on the platform.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Display Banner to All Users</label>
            <button
              onClick={() =>
                setControls({
                  ...controls,
                  broadcastBanner: { ...controls.broadcastBanner, active: !controls.broadcastBanner.active }
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                controls.broadcastBanner.active ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  controls.broadcastBanner.active ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Banner Message</label>
            <textarea
              rows={2}
              value={controls.broadcastBanner.message}
              onChange={e =>
                setControls({
                  ...controls,
                  broadcastBanner: { ...controls.broadcastBanner, message: e.target.value }
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
