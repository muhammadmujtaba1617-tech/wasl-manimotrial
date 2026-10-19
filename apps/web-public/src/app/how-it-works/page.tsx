import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = generateSeoMetadata({
  title: 'How It Works | Trust, Family Mode & AI Matching',
  description: 'Learn how Wasl verifies matrimonial profiles, enables structured family guardian participation, and calculates explainable compatibility.',
  canonicalPath: '/how-it-works'
});

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How Wasl Works</h1>
        <p className="text-lg text-slate-600">
          A matrimonial process engineered around privacy, verified trust, and transparent compatibility reasoning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            1
          </div>
          <h2 className="text-xl font-bold text-slate-900">Step 1: Verification</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Register via phone OTP. Upload your CNIC and perform a selfie liveness check. Submit education degrees from accredited universities for discrete badge issuance. Your raw documents are KMS-encrypted and never visible to other users.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            2
          </div>
          <h2 className="text-xl font-bold text-slate-900">Step 2: Family Invitation</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Invite your parents or siblings to your Family Workspace. Grant scoped permissions to suggest matches, review proposals, and participate in chaperoned chats. You retain sovereign account ownership and can revoke permissions at any moment.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            3
          </div>
          <h2 className="text-xl font-bold text-slate-900">Step 3: Explainable Matching</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Receive personalized recommendations scored across 6 dimensions on a 100-point scale. Understand exactly why two profiles match with concrete alignment highlights and constructive discussion points.
          </p>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition shadow-md"
        >
          Explore Membership Plans <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
