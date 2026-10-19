'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  CheckCheck,
  Search,
  ShieldCheck,
  Info,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Lock,
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getMatchStates, setCandidateMatchStatus, MatchStatus } from '../../../utils/matchStore';

interface ChatMessage {
  id: string;
  sender: 'ME' | 'OTHER';
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  avatarInitials: string;
  photoUrl?: string;
  city: string;
  age: number;
  profession: string;
  education: string;
  status: string;
  isOnline: boolean;
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
  replies: string[];
}

const ALL_CONTACTS: Record<string, Contact> = {
  'cand-female-1': {
    id: 'cand-female-1',
    name: 'Fatima Zahra',
    avatarInitials: 'FZ',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Lahore (DHA Phase 5)',
    age: 28,
    profession: 'Marketing & Brand Strategy Lead',
    education: 'MBA Marketing, LUMS',
    status: 'Active now',
    isOnline: true,
    unread: 0,
    lastMessage: 'It was great! Completed my MBA in 2020. Currently leading the marketing team at a fintech firm.',
    lastMessageTime: '10:35 AM',
    messages: [
      {
        id: 'fz-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum Bilal! I reviewed your profile and noticed our shared preference for living in Lahore.',
        time: '10:30 AM'
      },
      {
        id: 'fz-2',
        sender: 'ME',
        text: 'Walaikum Assalam Fatima! Yes, both our families are based in Lahore. How was your experience at LUMS?',
        time: '10:32 AM'
      },
      {
        id: 'fz-3',
        sender: 'OTHER',
        text: 'It was great! Completed my MBA in 2020. Currently leading the marketing team at a fintech firm.',
        time: '10:35 AM'
      }
    ],
    replies: [
      'Alhamdulillah! Family values and work-life balance are very important to me.',
      'That sounds great! My mother also reviewed your family background and was very pleased.',
      'Yes, InshaAllah! Would you like our family chaperones to arrange a virtual call this weekend?',
      'I completely agree with you. Clear communication and shared values make all the difference.'
    ]
  },
  'cand-male-1': {
    id: 'cand-male-1',
    name: 'Hamza Malik',
    avatarInitials: 'HM',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Lahore (Gulberg III)',
    age: 29,
    profession: 'Senior Software Architect',
    education: 'MS Computer Science, FAST-NUCES',
    status: 'Active 10m ago',
    isOnline: true,
    unread: 1,
    lastMessage: 'Assalam o Alaikum! Great to connect with someone from the tech ecosystem.',
    lastMessageTime: '11:15 AM',
    messages: [
      {
        id: 'hm-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum! Great to connect with someone from the tech ecosystem. How is your project going in Lahore?',
        time: '11:15 AM'
      }
    ],
    replies: [
      'Walaikum Assalam! Distributed cloud architecture is my main focus these days.',
      'Both my parents are in Lahore as well. Let us coordinate a family intro when convenient.',
      'Looking forward to connecting with the family chaperones present.'
    ]
  },
  'cand-female-2': {
    id: 'cand-female-2',
    name: 'Dr. Zainab Bibi',
    avatarInitials: 'ZB',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    city: 'Islamabad (Sector F-7)',
    age: 27,
    profession: 'Senior Health Informatics & Data Scientist',
    education: 'MBBS & MS Data Science, NUST',
    status: 'Active now',
    isOnline: true,
    unread: 1,
    lastMessage: 'Assalam o Alaikum! I saw your interest in tech and healthcare.',
    lastMessageTime: '09:15 AM',
    messages: [
      {
        id: 'zb-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum Bilal! I saw your interest in tech innovation and healthcare algorithms.',
        time: '09:00 AM'
      },
      {
        id: 'zb-2',
        sender: 'ME',
        text: 'Walaikum Assalam Dr. Zainab! Much respect for your data science transition from clinical medicine.',
        time: '09:08 AM'
      },
      {
        id: 'zb-3',
        sender: 'OTHER',
        text: 'Assalam o Alaikum! Our family would love to connect this Sunday InshaAllah.',
        time: '09:15 AM'
      }
    ],
    replies: [
      'Thank you! My father mentioned he would be happy to coordinate with your family.',
      'InshaAllah, we can set up a convenient time on Sunday evening.',
      'Shared values and mutual respect are our family\'s top priority.'
    ]
  },
  'cand-male-2': {
    id: 'cand-male-2',
    name: 'Dr. Bilal Ahmed Syed',
    avatarInitials: 'BS',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    city: 'Islamabad (Sector F-8)',
    age: 31,
    profession: 'Consultant Orthopedic Surgeon',
    education: 'MBBS, FCPS Orthopedic Surgery, AKUH',
    status: 'Active 1h ago',
    isOnline: false,
    unread: 0,
    lastMessage: 'Assalam o Alaikum! Thank you for reviewing our family background.',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'bs-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum! Thank you for reviewing our family background. We look forward to connecting.',
        time: 'Yesterday'
      }
    ],
    replies: [
      'Walaikum Assalam! Our elders are coordinating the next steps.',
      'May Allah put barakah in this process for both families.'
    ]
  },
  'cand-female-3': {
    id: 'cand-female-3',
    name: 'Maryam Qureshi',
    avatarInitials: 'MQ',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    city: 'London, UK / Lahore',
    age: 26,
    profession: 'Chartered Financial Consultant',
    education: 'BSc Economics & Finance, LSE',
    status: 'Active now',
    isOnline: true,
    unread: 0,
    lastMessage: 'London weather is chilly today, but excited to connect!',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'mq-1',
        sender: 'OTHER',
        text: 'Hello Bilal! I noticed we both share a passion for travel and sustainable investments.',
        time: 'Yesterday'
      },
      {
        id: 'mq-2',
        sender: 'ME',
        text: 'Assalam o Alaikum Maryam! Yes, LSE economics has a great curriculum. How is London treating you?',
        time: 'Yesterday'
      },
      {
        id: 'mq-3',
        sender: 'OTHER',
        text: 'London weather is chilly today, but excited to connect!',
        time: 'Yesterday'
      }
    ],
    replies: [
      'I visit Lahore every winter to spend time with family in Gulberg.',
      'Both my parents maintain close ties with Pakistan and value traditional rishta etiquette.',
      'InshaAllah looking forward to speaking with family present.'
    ]
  },
  'cand-female-4': {
    id: 'cand-female-4',
    name: 'Ayesha Arain',
    avatarInitials: 'AA',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    city: 'Lahore (Model Town)',
    age: 25,
    profession: 'Civil Services Officer (PAS)',
    education: 'BSc Economics & Politics, LUMS',
    status: 'Active 20m ago',
    isOnline: true,
    unread: 1,
    lastMessage: 'Assalam o Alaikum! Shared our profile with my father.',
    lastMessageTime: '08:30 AM',
    messages: [
      {
        id: 'aa-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum Bilal! I have reviewed your profile and shared it with my parents in Model Town.',
        time: '08:30 AM'
      }
    ],
    replies: [
      'Walaikum Assalam! Public service in Punjab keeps me busy, but family remains priority.',
      'My father mentioned he would be pleased to speak with your family chaperone.'
    ]
  },
  'cand-male-3': {
    id: 'cand-male-3',
    name: 'Daniyal Sheikh',
    avatarInitials: 'DS',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    city: 'London, UK / Karachi',
    age: 28,
    profession: 'Senior Portfolio Manager',
    education: "MSc Financial Analytics, King's College",
    status: 'Active 2h ago',
    isOnline: false,
    unread: 0,
    lastMessage: 'Assalam o Alaikum! Connecting from London Canary Wharf.',
    lastMessageTime: 'Oct 7',
    messages: [
      {
        id: 'ds-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum! Connecting from London Canary Wharf. Looking forward to our introduction.',
        time: 'Oct 7'
      }
    ],
    replies: [
      'Walaikum Assalam! Ethical asset management is my core field.',
      'Our family is based in Karachi and London.'
    ]
  },
  'cand-male-4': {
    id: 'cand-male-4',
    name: 'Usman Mughal',
    avatarInitials: 'UM',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    city: 'Lahore (Cantt)',
    age: 30,
    profession: 'Lead Urban Architect & Designer',
    education: 'B.Arch Architecture, NCA Lahore',
    status: 'Active 30m ago',
    isOnline: true,
    unread: 0,
    lastMessage: 'Assalam o Alaikum! Appreciate your interest in architectural heritage.',
    lastMessageTime: 'Oct 6',
    messages: [
      {
        id: 'um-1',
        sender: 'OTHER',
        text: 'Assalam o Alaikum! Appreciate your interest in architectural heritage and Lahore culture.',
        time: 'Oct 6'
      }
    ],
    replies: [
      'Walaikum Assalam! Restoring historic havelis in old Lahore is a passion of mine.',
      'Looking forward to a respectful family introduction InshaAllah.'
    ]
  },
  'ammi-khan': {
    id: 'ammi-khan',
    name: 'Ammi (Mrs. Parveen Khan)',
    avatarInitials: 'PK',
    city: 'Lahore, Model Town',
    age: 56,
    profession: 'Guardian / Mother',
    education: 'M.A., Punjab University',
    status: 'Active now',
    isOnline: true,
    unread: 0,
    lastMessage: 'Bilal beta, I reviewed Fatima’s family profile.',
    lastMessageTime: '08:45 AM',
    messages: [
      {
        id: 'pk-1',
        sender: 'OTHER',
        text: 'Bilal beta, I reviewed Fatima Zahra’s family profile and verified their background.',
        time: '08:45 AM'
      },
      {
        id: 'pk-2',
        sender: 'OTHER',
        text: 'Her family is very respectable. Let me know when you want to schedule a family meeting.',
        time: '08:46 AM'
      }
    ],
    replies: [
      'JazakAllah khair beta! Keep your intentions pure.',
      'I will talk to your father this evening about this proposal.'
    ]
  }
};

function resolveContactId(rawId?: string): string {
  if (!rawId) return 'cand-female-1';
  const clean = rawId.toLowerCase().trim().replace(/^thread-/, '');

  if (ALL_CONTACTS[clean]) return clean;
  if (ALL_CONTACTS[rawId]) return rawId;

  if (clean.includes('female-1') || clean.includes('fatima') || clean === 'demo') return 'cand-female-1';
  if (clean.includes('male-1') || clean.includes('hamza')) return 'cand-male-1';
  if (clean.includes('female-2') || clean.includes('zainab')) return 'cand-female-2';
  if (clean.includes('male-2') || clean.includes('bilal-ahmed') || clean.includes('syed')) return 'cand-male-2';
  if (clean.includes('female-3') || clean.includes('maryam') || clean.includes('qureshi')) return 'cand-female-3';
  if (clean.includes('female-4') || clean.includes('arain') || clean.includes('ayesha')) return 'cand-female-4';
  if (clean.includes('male-3') || clean.includes('daniyal')) return 'cand-male-3';
  if (clean.includes('male-4') || clean.includes('usman') || clean.includes('mughal')) return 'cand-male-4';
  if (clean.includes('ammi') || clean.includes('parveen') || clean.includes('guardian') || clean.includes('family')) return 'ammi-khan';

  return 'cand-female-1';
}

export default function DirectMessageChatPage() {
  const params = useParams();
  const rawThreadId = params?.threadId as string | undefined;

  const [matchStates, setMatchStates] = useState<Record<string, MatchStatus>>(getMatchStates);
  const [contacts, setContacts] = useState<Record<string, Contact>>(ALL_CONTACTS);
  const [selectedId, setSelectedId] = useState<string>(() => resolveContactId(rawThreadId));
  const [search, setSearch] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync match states
  useEffect(() => {
    const sync = () => {
      setMatchStates(getMatchStates());
    };
    sync();
    window.addEventListener('wasl_match_state_updated', sync);
    return () => window.removeEventListener('wasl_match_state_updated', sync);
  }, []);

  // Sync when route param changes
  useEffect(() => {
    if (rawThreadId) {
      const match = resolveContactId(rawThreadId);
      if (match && (!matchStates[match] || matchStates[match] === 'NOT_CONNECTED')) {
        // Automatically add contact to pending proposals if navigated directly from profile interest
        setCandidateMatchStatus(match, 'SENT_PENDING');
        setMatchStates(getMatchStates());
      }
      setSelectedId(match);
      setContacts(prev => {
        if (prev[match]) {
          return {
            ...prev,
            [match]: { ...prev[match], unread: 0 }
          };
        }
        return prev;
      });
    }
  }, [rawThreadId]);

  // Filter contacts to only include candidates with active proposals sent or received
  const activeContactsList = Object.values(contacts).filter(c => {
    const status = matchStates[c.id];
    return (
      status === 'SENT_PENDING' ||
      status === 'RECEIVED_PENDING' ||
      status === 'MUTUAL_MATCH'
    );
  });

  const filteredContacts = activeContactsList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.profession.toLowerCase().includes(search.toLowerCase())
  );

  const currentContact = contacts[selectedId] || (activeContactsList.length > 0 ? activeContactsList[0] : null);
  const currentMatchStatus: MatchStatus = currentContact ? (matchStates[currentContact.id] || 'NOT_CONNECTED') : 'NOT_CONNECTED';
  const isChatUnlocked = currentMatchStatus === 'MUTUAL_MATCH';

  useEffect(() => {
    if (isChatUnlocked) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentContact?.messages, isTyping, isChatUnlocked]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setContacts(prev => ({
      ...prev,
      [id]: { ...prev[id], unread: 0 }
    }));
    setInputMessage('');
    window.history.replaceState(null, '', `/chat/${id}`);
  };

  const handleAcceptProposal = (id: string) => {
    setCandidateMatchStatus(id, 'MUTUAL_MATCH');
    setMatchStates(getMatchStates());
  };

  const handleSendProposal = (id: string) => {
    setCandidateMatchStatus(id, 'SENT_PENDING');
    setMatchStates(getMatchStates());
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentContact) return;
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'ME',
      text: trimmed,
      time: newTime
    };

    setContacts(prev => {
      const active = prev[currentContact.id];
      return {
        ...prev,
        [currentContact.id]: {
          ...active,
          messages: [...active.messages, userMsg],
          lastMessage: `You: ${trimmed}`,
          lastMessageTime: newTime
        }
      };
    });

    setInputMessage('');

    // Simulate other person typing and sending response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const pool = currentContact.replies || [];
        const replyText = pool[Math.floor(Math.random() * pool.length)] || 'Thank you for your message! Looking forward to connecting.';
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'OTHER',
          text: replyText,
          time: replyTime
        };

        setContacts(prev => {
          const active = prev[currentContact.id];
          return {
            ...prev,
            [currentContact.id]: {
              ...active,
              messages: [...active.messages, replyMsg],
              lastMessage: replyText,
              lastMessageTime: replyTime
            }
          };
        });
      }, 1400);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-5.5rem)] flex p-2 sm:p-4">
      {/* Main Direct Message Shell */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">

        {/* LEFT PANEL: DIRECT MESSAGES LIST */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-slate-900">Direct Messages</h1>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Consent-First Messaging</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {activeContactsList.length} Chats
            </span>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-700 transition"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 flex flex-col">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No active chats yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                  Only candidates who send you a proposal or candidates you express interest to will appear here.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition shadow-xs"
                >
                  Find Candidates <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              filteredContacts.map(contact => {
                const isActive = currentContact && contact.id === currentContact.id;
                const status = matchStates[contact.id] || 'NOT_CONNECTED';
                const isLocked = status !== 'MUTUAL_MATCH';

                return (
                  <button
                    key={contact.id}
                    onClick={() => handleSelect(contact.id)}
                    className={`w-full p-3.5 flex items-center gap-3 transition text-left ${
                      isActive ? 'bg-emerald-50/90 border-l-4 border-emerald-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden shadow-xs">
                        {contact.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={contact.photoUrl} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          contact.avatarInitials
                        )}
                      </div>
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <h2 className="text-xs font-bold text-slate-900 truncate">
                            {contact.name}
                          </h2>
                          {isLocked && <Lock className="w-3 h-3 text-amber-600 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {contact.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 truncate">
                          {status === 'MUTUAL_MATCH'
                            ? contact.lastMessage
                            : status === 'RECEIVED_PENDING'
                            ? '⭐ Sent you a proposal'
                            : 'Proposal pending mutual consent'}
                        </p>
                        {status === 'RECEIVED_PENDING' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                            Proposal
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: ACTIVE DIRECT MESSAGE CONVERSATION OR CONSENT-FIRST GATE */}
        {!currentContact ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/60 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">Consent-First Direct Messaging</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                In Wasl, direct messages unlock only after both candidates accept mutual interest.
                Browse candidates in the Discovery Feed and express interest or send a proposal to start chatting!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl w-full text-left">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Step 1</span>
                <div className="text-xs font-bold text-slate-900">Browse Profiles</div>
                <p className="text-[11px] text-slate-500">Explore verified candidates in Discovery Feed.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase">Step 2</span>
                <div className="text-xs font-bold text-slate-900">Send / Accept Proposal</div>
                <p className="text-[11px] text-slate-500">Express interest or accept incoming proposal.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Step 3</span>
                <div className="text-xs font-bold text-slate-900">Direct Chat Unlocks</div>
                <p className="text-[11px] text-slate-500">Enjoy end-to-end encrypted direct messaging!</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition shadow-md"
            >
              <Sparkles className="w-4 h-4" /> Explore Candidates in Discovery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden relative">
          
          {/* Top Bar */}
          <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                  {currentContact.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentContact.photoUrl} alt={currentContact.name} className="w-full h-full object-cover" />
                  ) : (
                    currentContact.avatarInitials
                  )}
                </div>
                {currentContact.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-slate-900">{currentContact.name}</h2>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <p className="text-[11px] text-slate-500">
                  {isChatUnlocked ? (
                    isTyping ? (
                      <span className="text-emerald-700 font-semibold animate-pulse">Typing...</span>
                    ) : (
                      currentContact.status
                    )
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Mutual Match Gate Active
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`p-2 rounded-full transition ${
                  showProfile ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
                title="Profile details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN CHAT BODY: LOCKED GATE OR ACTIVE STREAM */}
          {!isChatUnlocked ? (
            /* CONSENT-FIRST GATE LOCK SCREEN */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white space-y-5">
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-700 shadow-sm animate-pulse">
                <Lock className="w-9 h-9" />
              </div>

              <div className="max-w-md space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                  Mutual Consent Required
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Direct Chat with {currentContact.name} is Locked
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentMatchStatus === 'RECEIVED_PENDING' ? (
                    <>
                      <strong>{currentContact.name}</strong> has expressed interest in your profile! Accept their proposal below to unlock direct chat and exchange messages.
                    </>
                  ) : currentMatchStatus === 'SENT_PENDING' ? (
                    <>
                      You have sent a proposal to <strong>{currentContact.name}</strong>. To safeguard candidate privacy, direct chat will unlock automatically once they accept.
                    </>
                  ) : (
                    <>
                      To protect candidate privacy and eliminate unsolicited messages, users cannot DM candidates out of the blue. Express interest to request a mutual match!
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {currentMatchStatus === 'RECEIVED_PENDING' ? (
                  <button
                    onClick={() => handleAcceptProposal(currentContact.id)}
                    className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:scale-102"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Proposal & Unlock Chat
                  </button>
                ) : currentMatchStatus === 'SENT_PENDING' ? (
                  <div className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Candidate Acceptance
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendProposal(currentContact.id)}
                    className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-md hover:scale-102"
                  >
                    <Heart className="w-4 h-4" /> Express Interest & Request Chat
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* UNLOCKED ACTIVE MESSAGES STREAM */
            <>
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {currentContact.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'ME' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        msg.sender === 'ME'
                          ? 'bg-emerald-800 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{msg.time}</span>
                      {msg.sender === 'ME' && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3.5 py-2 w-fit shadow-2xs">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Type a respectful message..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 transition"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-40 transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>

        {/* OPTIONAL PROFILE DETAILS SIDEBAR */}
        {currentContact && showProfile && (
          <div className="w-72 border-l border-slate-200 bg-white p-5 flex flex-col shrink-0 animate-fadeIn overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800">Candidate Info</h3>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-5 flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-lg overflow-hidden shadow-xs">
                {currentContact.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentContact.photoUrl} alt={currentContact.name} className="w-full h-full object-cover" />
                ) : (
                  currentContact.avatarInitials
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-900">{currentContact.name}</h4>
              <p className="text-xs text-slate-500">{currentContact.age} years old</p>
            </div>

            <div className="pt-6 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{currentContact.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{currentContact.profession}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{currentContact.education}</span>
              </div>
            </div>

            {/* Match Status in Sidebar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Consent Status
              </div>
              {currentMatchStatus === 'MUTUAL_MATCH' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Mutual Match Verified
                </div>
              ) : currentMatchStatus === 'RECEIVED_PENDING' ? (
                <button
                  onClick={() => handleAcceptProposal(currentContact.id)}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept Proposal
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" /> Direct Chat Locked
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )}

      </div>
    </div>
  );
}
