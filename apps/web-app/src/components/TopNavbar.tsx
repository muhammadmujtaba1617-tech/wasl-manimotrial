'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Heart,
  Users,
  MessageSquare,
  ShieldCheck,
  User,
  Search,
  Sliders,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import NotificationHub from './NotificationHub';
import UserNavProfile from './UserNavProfile';

export default function TopNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide top navbar on onboarding or login pages
  if (pathname === '/onboarding' || pathname === '/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left Branding / Search / Breadcrumb */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800 font-bold text-sm text-white shadow-sm">
            وصل
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900">WASL</span>
        </Link>

        {/* Global Search Bar with Hydration Suppression */}
        <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-600 transition">
          <Search className="mr-2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            suppressHydrationWarning
            placeholder="Search by city, education, or profession..."
            className="w-48 md:w-64 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <span className="ml-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Actions: Notification Hub & User Status */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Real-time Notification Dropdown */}
        <NotificationHub />

        {/* User Profile Quick Status */}
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200">
          <UserNavProfile layoutVariant="NAVBAR" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 border-b border-slate-200 bg-white p-4 shadow-xl md:hidden animate-in slide-in-from-top-2">
          <nav className="space-y-1 text-sm font-semibold">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-700 hover:bg-slate-100"
            >
              <Compass className="h-4 w-4 text-emerald-700" /> Discovery Feed
            </Link>
            <Link
              href="/proposals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-700 hover:bg-slate-100"
            >
              <Heart className="h-4 w-4 text-rose-500" /> Proposals & Matches
            </Link>
            <Link
              href="/chat/thread-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-700 hover:bg-slate-100"
            >
              <MessageSquare className="h-4 w-4 text-slate-500" /> Direct Messages & Chat
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4 text-slate-500" /> My Profile & Badges
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
