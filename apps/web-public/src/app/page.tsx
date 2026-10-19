import Link from 'next/link';
import { ShieldCheck, Users, Sparkles, CheckCircle2, ArrowRight, Lock, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          No Casual Swipes • 100% Verified Profiles • Family Supervised
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Where Verified Trust Meets <span className="text-emerald-800">Family Participation</span> & Explainable AI.
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Wasl is engineered specifically for Pakistani Muslim professionals aged 22–35. We replace superficial swipe apps with verifiable credentials, permissioned family guardians, and transparent compatibility reasoning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="http://localhost:3001/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition shadow-lg flex items-center justify-center gap-2"
          >
            Create Verified Profile <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            View Family Plans
          </Link>
        </div>

        {/* Trust Badges Live Demonstration Preview */}
        <div className="pt-10 max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">CNIC</div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Identity & Liveness</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> NADRA Verified</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">EDU</div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Degree Attainment</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified LUMS/NUST</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">WALI</div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Family Representative</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active Chaperone</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Built Different by Engineering Design</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Traditional platforms either offer unaudited public listings or casual dating mechanics. Wasl re-architects matrimonial matchmaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Verified Trust Badges</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No single opaque &ldquo;trust score&rdquo;. Candidates receive itemized badges for Phone, Email, CNIC/Selfie Match, Higher Education Degrees, and Employment. Documents are encrypted at rest and never shared with other users.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. Structured Family Mode</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Candidates can invite parents or siblings with granular, revokable permissions: view family details, suggest matches, review proposals, and participate in chaperoned conversations without surrendering account ownership.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Explainable Compatibility</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A 100-point deterministic engine calculates alignment across 6 dimensions: Location, Family Structure, Career Expectations, Religion, Education, and Lifestyle—generating auditable insights and conversation starters.
            </p>
          </div>
        </div>
      </section>

      {/* Proposal State Machine Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">The 8-Stage Relationship Funnel</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Every match follows a deliberate, respectful progression from initial discovery to formal family introduction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { step: '1', name: 'Discovered', desc: 'Verified Feed' },
              { step: '2', name: 'Interested', desc: 'Mutual Expression' },
              { step: '3', name: 'Family Interest', desc: 'Guardian Review' },
              { step: '4', name: 'Intro Requested', desc: 'Consent Check' },
              { step: '5', name: 'Supervised Chat', desc: 'Chaperoned Thread' },
              { step: '6', name: 'Voice / Video', desc: 'Direct Dialogue' },
              { step: '7', name: 'Family Meeting', desc: 'Elder Coordination' },
              { step: '8', name: 'Engaged', desc: 'Formal Union' }
            ].map(item => (
              <div key={item.step} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-2">
                <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-xs font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <div className="text-xs font-semibold text-white">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
