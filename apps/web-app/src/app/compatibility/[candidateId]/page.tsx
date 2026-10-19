import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, MessageCircle, Heart } from 'lucide-react';

export default async function CompatibilityDetailPage({
  params
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;

  const dimensions = [
    { name: 'Family Structure', score: 20, max: 20, desc: 'Both prefer nuclear setup in Lahore' },
    { name: 'Career & Financial', score: 20, max: 20, desc: 'Mutual support for professional growth' },
    { name: 'Location & Relocation', score: 18, max: 20, desc: 'Both residing in Lahore with global flexibility' },
    { name: 'Education Attainment', score: 15, max: 15, desc: 'Master’s degree alignment (LUMS / MBA)' },
    { name: 'Religious Values', score: 12, max: 15, desc: 'Moderate practice with shared Islamic fundamentals' },
    { name: 'Lifestyle & Hobbies', score: 8, max: 10, desc: 'Shared interests in reading and traveling' }
  ];

  const alignments = [
    'Identical family structure preference (Nuclear household)',
    'Mutually supportive career expectations in Lahore',
    'Matched educational level (Master’s degrees)',
    'Comfortable with joint/flexible travel and leisure goals'
  ];

  const discussionPoints = [
    'Preferred long-term home ownership timeline in Lahore',
    'Balancing demanding tech/marketing work schedules'
  ];

  const starters = [
    'How do you envision structuring work-life balance around career ambitions?',
    'What are some family traditions that are most meaningful to you?'
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
            Compatibility Analysis: Fatima Zahra
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculated across 6 weighted dimensions based on your explicit preferences.
          </p>
        </div>

        <div className="bg-emerald-800 text-white rounded-2xl p-6 text-center shadow-lg shrink-0">
          <div className="text-4xl font-black">93 / 100</div>
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

      {/* AI Conversation Starters */}
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
