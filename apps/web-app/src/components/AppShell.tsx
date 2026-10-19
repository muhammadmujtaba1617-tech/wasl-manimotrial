'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Users, MessageSquare, Compass, User, LogOut } from 'lucide-react';
import TopNavbar from './TopNavbar';
import UserNavProfile from './UserNavProfile';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar and top navbar on authentication and onboarding wizard flows
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/onboarding' ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/onboarding');

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex flex-col justify-center items-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              وصل
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">WASL</span>
              <span className="text-[10px] text-emerald-800 font-semibold tracking-wider uppercase">Workspace</span>
            </div>
          </Link>

          <nav className="space-y-1.5 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition font-semibold ${
                pathname === '/dashboard'
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Compass className="w-5 h-5 text-emerald-700" />
              Discovery Feed
            </Link>
            <Link
              href="/proposals"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                pathname === '/proposals'
                  ? 'bg-rose-50 text-rose-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Heart className="w-5 h-5 text-rose-500" />
              Proposals & Matches
            </Link>
            <Link
              href="/chat"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                pathname?.startsWith('/chat')
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              Direct Messages & Chat
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                pathname === '/profile'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-5 h-5 text-emerald-700" />
              My Profile
            </Link>
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <UserNavProfile layoutVariant="SIDEBAR" />
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Content Body with Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
