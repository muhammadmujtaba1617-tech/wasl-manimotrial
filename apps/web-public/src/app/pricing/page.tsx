import { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Transparent Pricing & Plans | Free, Premium & Family',
  description: 'Simple, transparent pricing for individuals and families on Wasl Matrimonial. Pay via JazzCash, EasyPaisa, or Cards.',
  canonicalPath: '/pricing'
});

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Starter',
      price: 'PKR 0',
      period: 'Forever',
      description: 'Ideal for creating your verified profile and exploring compatibility.',
      features: [
        'Phone & Email verification',
        'CNIC identity check badge',
        'Receive candidate recommendations',
        'Basic compatibility score view',
        '1 Family Guardian seat'
      ],
      popular: false,
      cta: 'Get Started Free'
    },
    {
      name: 'Premium Individual',
      price: 'PKR 3,500',
      period: 'per month',
      description: 'For active professionals seeking direct proposals and chat introductions.',
      features: [
        'All Free Starter features',
        'Unlimited proposal initiations',
        'Full 6-dimension score breakdowns',
        'AI conversation starter suggestions',
        'Verified Education & Employment badges',
        '2 Family Guardian seats'
      ],
      popular: true,
      cta: 'Select Premium'
    },
    {
      name: 'Family Premium',
      price: 'PKR 8,500',
      period: '3 months',
      description: 'Complete family workspace with multiple guardian seats and chaperone tools.',
      features: [
        'All Premium Individual features',
        'Up to 5 Family Guardian seats',
        'Guardian match suggestions & notes',
        'Dedicated Chaperone chat view',
        'Priority verification queue review',
        'Discreet profile browsing mode'
      ],
      popular: false,
      cta: 'Select Family Plan'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Transparent, Fair Pricing</h1>
        <p className="text-lg text-slate-600">
          No hidden fees or recurring traps. Pay seamlessly via JazzCash, EasyPaisa, or local Pakistani bank cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`rounded-3xl p-8 border flex flex-col justify-between ${
              plan.popular
                ? 'border-emerald-700 bg-white shadow-xl relative ring-2 ring-emerald-700/20'
                : 'border-slate-200 bg-white shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-xs text-slate-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-600">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/how-it-works"
                className={`w-full py-3 px-4 rounded-xl font-semibold text-center block transition ${
                  plan.popular
                    ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-md'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
