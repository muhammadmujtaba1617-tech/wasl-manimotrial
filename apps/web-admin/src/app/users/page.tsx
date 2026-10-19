'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  PauseCircle,
  PlayCircle,
  Ban,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  X,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock
} from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  registeredDate: string;
}

const INITIAL_USERS: AppUser[] = [
  {
    id: 'cand-female-1',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@lums.edu.pk',
    phone: '+92 300 1234567',
    city: 'Lahore (DHA Phase 5)',
    profession: 'Marketing Lead',
    status: 'ACTIVE',
    registeredDate: 'Aug 15, 2026'
  },
  {
    id: 'cand-male-1',
    name: 'Hamza Malik',
    email: 'hamza.malik@fast.edu.pk',
    phone: '+92 321 9876543',
    city: 'Lahore (Gulberg III)',
    profession: 'Senior Software Architect',
    status: 'ACTIVE',
    registeredDate: 'Aug 20, 2026'
  },
  {
    id: 'cand-scam-101',
    name: 'Raza Qureshi (Suspicious)',
    email: 'cheap.deals99@tempmail.com',
    phone: '+92 345 0001122',
    city: 'Rawalpindi',
    profession: 'Forex Consultant',
    status: 'SUSPENDED',
    registeredDate: 'Oct 05, 2026'
  },
  {
    id: 'cand-female-2',
    name: 'Dr. Zainab Bibi',
    email: 'zainab.bibi@nust.edu.pk',
    phone: '+92 333 4455667',
    city: 'Islamabad (Sector F-7)',
    profession: 'Data Scientist',
    status: 'ACTIVE',
    registeredDate: 'Aug 10, 2026'
  },
  {
    id: 'cand-fake-202',
    name: 'Ali Shafi (Reported Scammer)',
    email: 'crypto.invest.pk@gmail.com',
    phone: '+92 312 8887766',
    city: 'Karachi',
    profession: 'Crypto Forex Trader',
    status: 'BLOCKED',
    registeredDate: 'Oct 01, 2026'
  },
  {
    id: 'cand-female-4',
    name: 'Ayesha Arain',
    email: 'ayesha.arain@punjab.gov.pk',
    phone: '+92 301 5566778',
    city: 'Lahore (Model Town)',
    profession: 'Civil Services PAS',
    status: 'ACTIVE',
    registeredDate: 'Sep 01, 2026'
  }
];

export default function SimpleAdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'>('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: 'SUSPEND' | 'UNSUSPEND' | 'BLOCK' | 'UNBLOCK' | 'REMOVE';
    user: AppUser | null;
  }>({ open: false, action: 'SUSPEND', user: null });

  // 1. SUSPEND CONTROL
  const handleToggleSuspend = (user: AppUser) => {
    const isSuspended = user.status === 'SUSPENDED';
    const newStatus = isSuspended ? 'ACTIVE' : 'SUSPENDED';
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
    setToastMessage(
      isSuspended
        ? `Account for ${user.name} has been Reactivated.`
        : `Account for ${user.name} has been Suspended.`
    );
    setConfirmModal({ open: false, action: 'SUSPEND', user: null });
    setTimeout(() => setToastMessage(''), 4000);
  };

  // 2. BLOCK CONTROL
  const handleToggleBlock = (user: AppUser) => {
    const isBlocked = user.status === 'BLOCKED';
    const newStatus = isBlocked ? 'ACTIVE' : 'BLOCKED';
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
    setToastMessage(
      isBlocked
        ? `User ${user.name} has been Unblocked.`
        : `User ${user.name} has been Blocked from logging into the app.`
    );
    setConfirmModal({ open: false, action: 'BLOCK', user: null });
    setTimeout(() => setToastMessage(''), 4000);
  };

  // 3. REMOVE CONTROL
  const handleRemoveUser = (user: AppUser) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setToastMessage(`User ${user.name} has been permanently Removed and Deleted from the app.`);
    setConfirmModal({ open: false, action: 'REMOVE', user: null });
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExecuteModalAction = () => {
    if (!confirmModal.user) return;
    if (confirmModal.action === 'SUSPEND' || confirmModal.action === 'UNSUSPEND') {
      handleToggleSuspend(confirmModal.user);
    } else if (confirmModal.action === 'BLOCK' || confirmModal.action === 'UNBLOCK') {
      handleToggleBlock(confirmModal.user);
    } else if (confirmModal.action === 'REMOVE') {
      handleRemoveUser(confirmModal.user);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            User Control Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage app users with 3 simple controls: <strong>Suspend</strong>, <strong>Block</strong>, or <strong>Remove</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
            {users.length} Total Users
          </span>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Active Users</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {users.filter(u => u.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Suspended</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {users.filter(u => u.status === 'SUSPENDED').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center">
            <PauseCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Blocked / Scammers</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {users.filter(u => u.status === 'BLOCKED').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center">
            <Ban className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'ACTIVE', 'SUSPENDED', 'BLOCKED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 font-bold">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">City / Profession</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">3 Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition">
                    {/* Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-slate-500 text-[10px]">Registered: {user.registeredDate}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <div className="text-slate-300 font-medium">{user.email}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{user.phone}</div>
                    </td>

                    {/* City / Profession */}
                    <td className="p-4">
                      <div className="text-slate-200 font-medium">{user.city}</div>
                      <div className="text-slate-400 text-[11px]">{user.profession}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : user.status === 'SUSPENDED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-400'
                            : user.status === 'SUSPENDED'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                        }`}></span>
                        {user.status}
                      </span>
                    </td>

                    {/* 3 ACTIONS: SUSPEND, BLOCK, REMOVE */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. SUSPEND BUTTON */}
                        <button
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: user.status === 'SUSPENDED' ? 'UNSUSPEND' : 'SUSPEND',
                              user
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                            user.status === 'SUSPENDED'
                              ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                              : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800'
                          }`}
                          title="Temporarily suspend or re-activate this user"
                        >
                          {user.status === 'SUSPENDED' ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5" /> Unsuspend
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5" /> Suspend
                            </>
                          )}
                        </button>

                        {/* 2. BLOCK BUTTON */}
                        <button
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: user.status === 'BLOCKED' ? 'UNBLOCK' : 'BLOCK',
                              user
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                            user.status === 'BLOCKED'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              : 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800'
                          }`}
                          title="Block this user from accessing the app"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{user.status === 'BLOCKED' ? 'Unblock' : 'Block'}</span>
                        </button>

                        {/* 3. REMOVE BUTTON */}
                        <button
                          onClick={() => setConfirmModal({ open: true, action: 'REMOVE', user })}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800 text-xs font-bold transition flex items-center gap-1"
                          title="Permanently remove and delete this user from the app"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTION CONFIRMATION MODAL */}
      {confirmModal.open && confirmModal.user && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-slate-100 animate-scaleUp text-center">
            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-md ${
              confirmModal.action === 'REMOVE'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : confirmModal.action === 'BLOCK'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : confirmModal.action === 'SUSPEND'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {confirmModal.action === 'REMOVE' && <Trash2 className="w-7 h-7" />}
              {confirmModal.action === 'BLOCK' && <Ban className="w-7 h-7" />}
              {confirmModal.action === 'UNBLOCK' && <CheckCircle2 className="w-7 h-7" />}
              {confirmModal.action === 'SUSPEND' && <PauseCircle className="w-7 h-7" />}
              {confirmModal.action === 'UNSUSPEND' && <PlayCircle className="w-7 h-7" />}
            </div>

            <div>
              <h3 className="font-extrabold text-white text-base">
                {confirmModal.action === 'SUSPEND' && `Suspend ${confirmModal.user.name}?`}
                {confirmModal.action === 'UNSUSPEND' && `Unsuspend ${confirmModal.user.name}?`}
                {confirmModal.action === 'BLOCK' && `Block ${confirmModal.user.name}?`}
                {confirmModal.action === 'UNBLOCK' && `Unblock ${confirmModal.user.name}?`}
                {confirmModal.action === 'REMOVE' && `Permanently Remove ${confirmModal.user.name}?`}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {confirmModal.action === 'SUSPEND' &&
                  'The user will be temporarily suspended and unable to interact with other candidates.'}
                {confirmModal.action === 'UNSUSPEND' &&
                  'The user account will be reactivated to full standing.'}
                {confirmModal.action === 'BLOCK' &&
                  'The user will be blocked from logging into the app and removed from matching discovery.'}
                {confirmModal.action === 'UNBLOCK' &&
                  'The block will be lifted and the user will regain access.'}
                {confirmModal.action === 'REMOVE' &&
                  'This will completely delete this user and all their data permanently from the app.'}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModal({ open: false, action: 'SUSPEND', user: null })}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteModalAction}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-sm ${
                  confirmModal.action === 'REMOVE' || confirmModal.action === 'BLOCK'
                    ? 'bg-red-700 hover:bg-red-800'
                    : confirmModal.action === 'SUSPEND'
                    ? 'bg-amber-700 hover:bg-amber-800'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
