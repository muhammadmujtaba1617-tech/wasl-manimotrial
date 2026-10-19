import type { Metadata } from 'next';
import './globals.css';
import { generateSeoMetadata } from '../lib/seo/metadata';
import { buildOrganizationJsonLd } from '../lib/seo/jsonld';
import Link from 'next/link';
import { ShieldCheck, Users, Sparkles, Lock } from 'lucide-react';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Wasl | Verified Matrimonial & Family-Involved Rishta Platform',
  description: 'Pakistan’s premier verified matrimonial platform. CNIC & education verification, family guardian participation, and explainable AI compatibility.',
  canonicalPath: '/'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
                وصل
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900">WASL</span>
                <span className="text-xs text-emerald-800 font-medium">Verified Matrimonial</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="/how-it-works" className="hover:text-emerald-800 transition">How It Works</Link>
              <Link href="/pricing" className="hover:text-emerald-800 transition">Pricing</Link>
              <Link href="/city/lahore" className="hover:text-emerald-800 transition">Lahore</Link>
              <Link href="/city/islamabad" className="hover:text-emerald-800 transition">Islamabad</Link>
              <Link href="/city/karachi" className="hover:text-emerald-800 transition">Karachi</Link>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3002/kyc-queue"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Admin Console
              </a>
              <a
                href="http://localhost:4000/docs"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                API Docs
              </a>
              <a
                href="http://localhost:3001/login?mode=signin"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-800 text-xs font-bold transition"
              >
                Sign In
              </a>
              <a
                href="http://localhost:3001/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition shadow-sm"
              >
                Create Profile
              </a>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  وصل
                </div>
                <span className="text-xl font-bold text-white">WASL</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Pakistan’s verified matrimonial platform built on verified trust, family participation, and explainable AI compatibility.
              </p>
              <div className="text-xs text-slate-500">
                © {new Date().getFullYear()} Wasl Matrimonial. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore Cities</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/city/lahore" className="hover:text-white transition">Rishta in Lahore</Link></li>
                <li><Link href="/city/islamabad" className="hover:text-white transition">Rishta in Islamabad</Link></li>
                <li><Link href="/city/karachi" className="hover:text-white transition">Rishta in Karachi</Link></li>
                <li><Link href="/city/faisalabad" className="hover:text-white transition">Rishta in Faisalabad</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Pillars</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Discrete Verified Badges</li>
                <li className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Permissioned Family Mode</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /> Explainable Matching Engine</li>
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400" /> Photo Privacy & Anti-Scrape</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Trust & Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/how-it-works" className="hover:text-white transition">Verification Process</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Transparent Pricing</Link></li>
                <li><span className="text-slate-500">PECA 2016 Compliant Data Storage</span></li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
