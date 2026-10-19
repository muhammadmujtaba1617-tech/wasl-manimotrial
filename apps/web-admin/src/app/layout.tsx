import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Users, Shield, LogOut, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wasl Admin • User Management',
  description: 'Simple Admin Panel to Suspend, Block, and Remove users.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-slate-900 text-slate-100 antialiased">
        {/* Simple Admin Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                وصل
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white">WASL ADMIN</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">User Control Panel</span>
              </div>
            </div>

            <nav className="space-y-2 text-xs font-semibold">
              <Link
                href="/users"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 shadow-sm transition"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>User Management</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-900">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Super Admin</span>
                <span className="text-[10px] text-emerald-400 font-medium">Full Access</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 px-2 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> Secure Admin Session
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-900 min-w-0">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
