'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface UserNavProfileProps {
  layoutVariant?: 'SIDEBAR' | 'NAVBAR';
}

export default function UserNavProfile({ layoutVariant = 'NAVBAR' }: UserNavProfileProps) {
  const [userName, setUserName] = useState<string>('My Profile');
  const [userInitials, setUserInitials] = useState<string>('ME');
  const [userRole, setUserRole] = useState<string>('CNIC Verified');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('wasl_user_name');
    const storedRole = localStorage.getItem('wasl_user_role') || 'CANDIDATE';
    const storedPhone = localStorage.getItem('wasl_user_phone');
    const storedEmail = localStorage.getItem('wasl_user_email');

    if (storedName) {
      setUserName(storedName);
      const parts = storedName.trim().split(' ');
      if (parts.length >= 2) {
        setUserInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
      } else if (parts[0]) {
        setUserInitials(parts[0].slice(0, 2).toUpperCase());
      }
    } else if (storedPhone) {
      setUserName(`User (${storedPhone.slice(-4)})`);
      setUserInitials('US');
    } else if (storedEmail) {
      setUserName(storedEmail.split('@')[0]);
      setUserInitials('US');
    }

    if (storedRole === 'ADMIN') {
      setUserRole('Administrator');
    }
  }, []);

  if (!mounted) {
    if (layoutVariant === 'SIDEBAR') {
      return (
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm">
            ME
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">My Profile</span>
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> CNIC Verified
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 font-bold text-xs text-emerald-800">
          ME
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900">My Profile</span>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> CNIC Verified
          </span>
        </div>
      </div>
    );
  }

  if (layoutVariant === 'SIDEBAR') {
    return (
      <Link href="/profile" className="flex items-center gap-3 px-2 group">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm group-hover:scale-105 transition">
          {userInitials}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition truncate max-w-[130px]">
            {userName}
          </span>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3" /> {userRole}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/profile" className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 font-bold text-xs text-emerald-800 group-hover:scale-105 transition">
        {userInitials}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition truncate max-w-[120px]">
          {userName}
        </span>
        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> {userRole}
        </span>
      </div>
    </Link>
  );
}
