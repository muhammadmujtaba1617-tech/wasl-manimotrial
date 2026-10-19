'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Users,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  ExternalLink,
  X,
  Play,
  Check,
  ChevronRight,
  Info,
  MessageSquare
} from 'lucide-react';
import { getApiBaseUrl } from '../utils/apiConfig';

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'MESSAGE' | 'MATCH' | 'PROPOSAL' | 'VERIFICATION' | 'SYSTEM';
  title: string;
  message: string;
  actionUrl: string;
  read: boolean;
  createdAt: string;
}

const INITIAL_FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'default-user',
    type: 'MATCH',
    title: 'New High Compatibility Match',
    message: 'You have a new 94% compatibility match (Fatima Zahra) in Lahore!',
    actionUrl: '/dashboard',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'default-user',
    type: 'PROPOSAL',
    title: 'Interest Expressed',
    message: 'Zara Khan expressed interest in your matrimonial profile.',
    actionUrl: '/proposals',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'notif-3',
    userId: 'default-user',
    type: 'MESSAGE',
    title: 'New Direct Message',
    message: 'Fatima sent you a message: "Salam! Would love to connect regarding your profile."',
    actionUrl: '/chat/thread-demo',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'notif-4',
    userId: 'default-user',
    type: 'VERIFICATION',
    title: 'Badge Approved',
    message: 'Your Higher Education Degree Badge was approved by Trust & Safety.',
    actionUrl: '/profile',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export default function NotificationHub() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_FALLBACK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MATCH' | 'MESSAGE' | 'PROPOSAL' | 'VERIFICATION'>('ALL');
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/notifications/me`);
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      }
    } catch {
      // Fallback in-memory remains
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string, actionUrl?: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/notifications/${id}/read`, {
        method: 'PATCH'
      });
    } catch {}

    if (actionUrl) {
      setIsOpen(false);
      router.push(actionUrl);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/notifications/mark-all-read`, {
        method: 'POST'
      });
    } catch {}
  };

  const simulateNotification = async (type: 'MESSAGE' | 'MATCH' | 'PROPOSAL' | 'VERIFICATION') => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/notifications/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          setNotifications(prev => [data.notification, ...prev]);
          setToastNotification(data.notification);
          setTimeout(() => {
            setToastNotification(null);
          }, 4500);
        }
      }
    } catch {
      // Offline fallback
      let title = 'New Notification';
      let message = 'You have a new update';
      let actionUrl = '/dashboard';

      if (type === 'MESSAGE') {
        title = 'New Direct Message';
        message = 'Fatima sent you a message in direct chat.';
        actionUrl = '/chat/thread-demo';
      } else if (type === 'MATCH') {
        title = 'High Compatibility Match';
        message = 'You have a new 94% compatibility match in Lahore!';
        actionUrl = '/dashboard';
      } else if (type === 'PROPOSAL') {
        title = 'Interest Expressed';
        message = 'Zara Khan expressed interest in your matrimonial proposal.';
        actionUrl = '/proposals';
      } else if (type === 'VERIFICATION') {
        title = 'Trust & Safety Approval';
        message = 'Your Higher Education Degree Badge was approved by Trust & Safety.';
        actionUrl = '/profile';
      }

      const mock: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: 'default-user',
        type,
        title,
        message,
        actionUrl,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [mock, ...prev]);
      setToastNotification(mock);
      setTimeout(() => setToastNotification(null), 4500);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    if (!mounted) return 'Recently';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'ALL') return true;
    return n.type === activeTab;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'MESSAGE':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-700">
            <MessageSquare className="h-4 w-4" />
          </div>
        );
      case 'MATCH':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
            <Sparkles className="h-4 w-4" />
          </div>
        );
      case 'PROPOSAL':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700">
            <Heart className="h-4 w-4" />
          </div>
        );
      case 'VERIFICATION':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/15 text-slate-700">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toast Alert Popup for Real-Time Event Alerts */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-300 bg-white p-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="shrink-0">{getNotificationIcon(toastNotification.type)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-900">{toastNotification.title}</h5>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">{toastNotification.message}</p>
            <div className="pt-1">
              <Link
                href={toastNotification.actionUrl}
                onClick={() => setToastNotification(null)}
                className="inline-flex items-center text-[11px] font-bold text-emerald-800 hover:text-emerald-950"
              >
                View Now <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md">
              {unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 h-5 w-5 animate-ping rounded-full bg-rose-400 opacity-75" />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-w-[92vw] rounded-3xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-slate-900">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 bg-white px-3 py-2 text-[11px] font-bold">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'MATCH', label: 'Matches' },
              { id: 'MESSAGE', label: 'Messages' },
              { id: 'PROPOSAL', label: 'Proposals' },
              { id: 'VERIFICATION', label: 'Trust' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 rounded-lg py-1.5 transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] divide-y divide-slate-100 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Bell className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-700">No notifications in this category</p>
                <p className="text-[11px] text-slate-400 mt-0.5">You are all up to date.</p>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id, notif.actionUrl)}
                  className={`group flex cursor-pointer items-start gap-3 p-4 transition ${
                    notif.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{getNotificationIcon(notif.type)}</div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 group-hover:underline">
                        View details <ChevronRight className="h-3 w-3" />
                      </span>

                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 shadow-sm" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Real-Time Live Simulator Tray */}
          <div className="border-t border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3 text-emerald-700" /> Live Event Simulator
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Test real-time triggers</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => simulateNotification('MESSAGE')}
                className="truncate rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-800 transition"
              >
                💬 New Direct Message
              </button>
              <button
                type="button"
                onClick={() => simulateNotification('MATCH')}
                className="truncate rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 hover:border-rose-500 hover:text-rose-700 transition"
              >
                🔔 94% Match in Lahore
              </button>
              <button
                type="button"
                onClick={() => simulateNotification('PROPOSAL')}
                className="truncate rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 hover:border-purple-500 hover:text-purple-700 transition"
              >
                🔔 Zara Expressed Interest
              </button>
              <button
                type="button"
                onClick={() => simulateNotification('VERIFICATION')}
                className="truncate rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 hover:border-amber-500 hover:text-amber-700 transition"
              >
                🔔 Degree Badge Approved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
