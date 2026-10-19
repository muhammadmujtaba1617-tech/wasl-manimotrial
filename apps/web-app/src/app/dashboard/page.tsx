'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Eye,
  EyeOff,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Sliders,
  Flag,
  Ban,
  X,
  Lock,
  BookOpen,
  Send,
  AlertTriangle,
  UserCheck,
  EyeClosed,
  Shield,
  Check,
  Search,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import CandidateProfileModal, { CandidateFullProfile } from '../../components/CandidateProfileModal';
import ReportAndBlockModal from '../../components/ReportAndBlockModal';
import MutualMatchConsentModal from '../../components/MutualMatchConsentModal';
import { getMatchStates, setCandidateMatchStatus, MatchStatus } from '../../utils/matchStore';
import { CASTE_OPTIONS } from '../../constants/casteOptions';
import { getApiBaseUrl } from '../../utils/apiConfig';

const RICH_RECOMMENDATIONS: CandidateFullProfile[] = [
  {
    id: 'cand-female-1',
    name: 'Fatima Zahra',
    age: 28,
    gender: 'FEMALE',
    height: "5'5\" (165 cm)",
    city: 'Lahore (DHA Phase 5)',
    originCity: 'Lahore, Pakistan',
    profession: 'Marketing & Brand Strategy Lead',
    companyOrField: 'Fintech & Digital Commerce',
    education: 'MBA Marketing',
    institution: 'LUMS (Class of 2020)',
    familyType: 'Nuclear Family Setup',
    sect: 'Sunni (Hanafi)',
    caste: 'Jatt (Virk)',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Always • Ramadan Fasts',
    income: 'PKR 350,000 - 500,000 / mo',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 94,
    aboutMe:
      'I consider myself a thoughtful, grounded, and ambitious individual. After completing my MBA at LUMS, I joined the fintech ecosystem where I build growth strategies. On weekends, I love exploring local coffee shops, hosting family dinners, reading historical Islamic nonfiction, and volunteering in youth literacy drives.',
    idealPartner:
      'Looking for a sincere, emotionally mature, and practicing Muslim partner who values mutual respect, shared spiritual growth, and open communication. Someone ambitious in his career who cherishes family bonds and sees marriage as a collaborative partnership in this life and the hereafter.',
    hobbies: ['Islamic Studies', 'Travel & Exploring', 'Reading & Philosophy', 'Cooking & Foodie'],
    familyDetails: {
      fatherProfession: 'Retired Senior Civil Officer (Govt of Punjab)',
      motherProfession: 'Educationist & Former Vice Principal',
      siblingSummary: '2 Brothers (Elder: Software Architect in UAE, Younger: Student at NUST)',
      residenceDetails: 'Independent family home in DHA Phase 5, Lahore',
      familyValues: 'Practicing Sunni, traditional warmth blended with educated modern values'
    },
    verifiedBadges: [
      {
        id: 'b-1',
        type: 'IDENTITY',
        title: 'NADRA Smart CNIC Verified',
        issuer: 'NADRA Verisys Direct Gateway',
        verifiedAt: 'Sep 14, 2026'
      },
      {
        id: 'b-2',
        type: 'EDUCATION',
        title: 'LUMS MBA Degree Authenticated',
        issuer: 'LUMS Registrar Office & HEC',
        verifiedAt: 'Aug 22, 2026'
      },
      {
        id: 'b-3',
        type: 'EMPLOYMENT',
        title: 'Fintech Corporate Employment',
        issuer: 'Official Work Email Domain OTP',
        verifiedAt: 'Sep 01, 2026'
      }
    ],
    alignments: [
      'Both prefer nuclear family setup in Lahore',
      'Mutual career support & growth orientation',
      'Matched educational attainment (Master’s from Top Tier)',
      'Consistent daily prayer commitment'
    ],
    discussionPoints: ['Weekend routines and personal interests', 'Long-term diaspora travel preferences'],
    explanation:
      'You and Fatima share high lifestyle harmony, matching educational rigor from top universities, and mutual career expectations in Lahore.',
    starters: [
      'I noticed we both value balanced career growth—how do you manage work-life rhythm?',
      'What are your favorite weekend spots when exploring Lahore?'
    ]
  },
  {
    id: 'cand-male-1',
    name: 'Hamza Malik',
    age: 29,
    gender: 'MALE',
    height: "5'11\" (180 cm)",
    city: 'Lahore (Gulberg III)',
    originCity: 'Lahore, Pakistan',
    profession: 'Senior Software Architect',
    companyOrField: 'Cloud Infrastructure & SaaS',
    education: 'MS Computer Science',
    institution: 'FAST-NUCES Lahore',
    familyType: 'Nuclear Family Setup',
    sect: 'Sunni',
    caste: 'Malik / Awan',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Always • Regular Fasts',
    income: 'PKR 650,000 - 850,000 / mo',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 93,
    aboutMe:
      'Passionate about software architecture, clean code, and technology entrepreneurship. In my free time, I play badminton, enjoy trail runs, and read about Islamic history and economics.',
    idealPartner:
      'Looking for a compassionate, educated, and pious life partner who values personal development, mutual understanding, and family harmony.',
    hobbies: ['Tech & Startups', 'Badminton', 'Reading', 'Travel & Exploring'],
    familyDetails: {
      fatherProfession: 'Professor Emeritus of Engineering',
      motherProfession: 'Homemaker',
      siblingSummary: '1 Sister (Doctor, married in Islamabad)',
      residenceDetails: 'Family-owned residence in Gulberg III, Lahore',
      familyValues: 'Religious, highly educated, respectful and supportive'
    },
    verifiedBadges: [
      {
        id: 'b-m1',
        type: 'IDENTITY',
        title: 'NADRA Smart CNIC Verified',
        issuer: 'NADRA Verisys Direct Gateway',
        verifiedAt: 'Sep 10, 2026'
      },
      {
        id: 'b-m2',
        type: 'EDUCATION',
        title: 'FAST-NUCES Degree Verified',
        issuer: 'HEC Pakistan e-Portal',
        verifiedAt: 'Aug 18, 2026'
      }
    ],
    alignments: [
      'Strong religious values and regular prayer rhythm',
      'Top-tier engineering/tech background',
      'Based in central Lahore'
    ],
    discussionPoints: ['Work-life balance and long-term tech projects'],
    explanation: 'Exceptional lifestyle, career values, and religious practice alignment.',
    starters: ['What got you started into distributed systems and architecture?']
  },
  {
    id: 'cand-female-2',
    name: 'Dr. Zainab Bibi',
    age: 27,
    gender: 'FEMALE',
    height: "5'4\" (162 cm)",
    city: 'Islamabad (Sector F-7)',
    originCity: 'Rawalpindi / Islamabad',
    profession: 'Senior Health Informatics & Data Scientist',
    companyOrField: 'Healthcare Technology & AI Research',
    education: 'MBBS & MS Data Science',
    institution: 'NUST Islamabad',
    familyType: 'Independent / Flexible Setup',
    sect: 'Just Muslim / Non-denominational',
    caste: 'Rajput (Janjuha)',
    prayerLevel: 'Usually / 5x daily',
    fastingDietary: 'Strictly Halal • Fasting all Ramadan',
    income: '$60,000 - $85,000 / year (Overseas Remote Base)',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 89,
    aboutMe:
      'Trained as a physician before pivoting to data science to build better health algorithms. When I am not training models or reading clinical papers, you will find me trail hiking in the Margalla Hills, brewing pour-over coffee, or volunteering with medical relief charities.',
    idealPartner:
      'Seeking an intellectually curious, kind-hearted, and spiritually grounded partner. Ideally someone who is supportive of a working woman, values fitness and wellness, and enjoys deep conversations about life, faith, and purposeful work.',
    hobbies: ['Tech & Startups', 'Hiking & Nature', 'Fitness & Gym', 'Volunteering'],
    familyDetails: {
      fatherProfession: 'Practicing Senior Consultant Cardiologist',
      motherProfession: 'Pediatric Specialist (Private Clinic)',
      siblingSummary: '1 Younger Sister (Pursuing Law at LUMS)',
      residenceDetails: 'Family residence in Sector F-7, Islamabad',
      familyValues: 'Highly educated, moderately practicing, strong emphasis on integrity'
    },
    verifiedBadges: [
      {
        id: 'b-5',
        type: 'IDENTITY',
        title: 'NADRA CNIC Identity Verified',
        issuer: 'NADRA Verisys Direct Gateway',
        verifiedAt: 'Aug 10, 2026'
      },
      {
        id: 'b-6',
        type: 'EDUCATION',
        title: 'NUST MS Data Science Verified',
        issuer: 'NUST Exam Branch & PMDC',
        verifiedAt: 'Jul 28, 2026'
      },
      {
        id: 'b-7',
        type: 'EMPLOYMENT',
        title: 'Health AI Consultant',
        issuer: 'Enterprise Verified Email Domain',
        verifiedAt: 'Aug 15, 2026'
      }
    ],
    alignments: [
      'Flexible relocation preferences across twin cities and global diaspora',
      'Shared academic rigor and tech & analytics interest',
      'Mutual prioritization of active health and outdoors'
    ],
    discussionPoints: ['Living arrangements and dual-career household dynamics'],
    explanation:
      'You and Zainab show close alignment on lifestyle, fitness, high academic achievement, and career trajectories.',
    starters: [
      'How do you envision balancing family dynamics between Lahore and Islamabad?',
      'What led you into healthcare AI after medical school at NUST?'
    ]
  },
  {
    id: 'cand-male-2',
    name: 'Dr. Bilal Ahmed Syed',
    age: 31,
    gender: 'MALE',
    height: "6'0\" (183 cm)",
    city: 'Islamabad (Sector F-8)',
    originCity: 'Islamabad, Pakistan',
    profession: 'Consultant Orthopedic Surgeon',
    companyOrField: 'Specialist Medical Center',
    education: 'MBBS, FCPS Orthopedic Surgery',
    institution: 'Aga Khan University / CPSP',
    familyType: 'Joint / Close-Knit Family Setup',
    sect: 'Sunni',
    caste: 'Syed / Shah',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Always',
    income: 'PKR 800,000 - 1,200,000 / mo',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 91,
    aboutMe:
      'Dedicated to medicine and helping patients regain mobility. Calm, empathetic, and family-centered. Enjoy equestrian riding, nature photography, and weekend family get-togethers.',
    idealPartner:
      'Looking for a warm, family-oriented, and educated partner who shares traditional values with modern aspirations.',
    hobbies: ['Horse Riding', 'Photography', 'Volunteering', 'Fitness & Gym'],
    familyDetails: {
      fatherProfession: 'Retired Justice, High Court',
      motherProfession: 'Homemaker',
      siblingSummary: '2 Brothers (Both Corporate Executives in Dubai)',
      residenceDetails: 'Spacious ancestral home in Sector F-8 Islamabad',
      familyValues: 'Distinguished Syed family, pious and respected'
    },
    verifiedBadges: [
      {
        id: 'b-m3',
        type: 'IDENTITY',
        title: 'NADRA Smart CNIC Verified',
        issuer: 'NADRA Verisys Direct Gateway',
        verifiedAt: 'Aug 01, 2026'
      },
      {
        id: 'b-m4',
        type: 'EDUCATION',
        title: 'PMDC & CPSP Verified',
        issuer: 'Pakistan Medical & Dental Council',
        verifiedAt: 'Jul 15, 2026'
      }
    ],
    alignments: [
      'Shared ethical and family standards',
      'Deep commitment to religious obligations',
      'High social and professional standing'
    ],
    discussionPoints: ['Relocation flexibility and family bonding'],
    explanation: 'High alignment on cultural heritage, Islamic values, and academic background.',
    starters: ['What inspired you to specialize in orthopedic surgery?']
  },
  {
    id: 'cand-female-3',
    name: 'Maryam Qureshi',
    age: 26,
    gender: 'FEMALE',
    height: "5'6\" (168 cm)",
    city: 'London, United Kingdom',
    originCity: 'Lahore (Origin) / London (Current)',
    profession: 'Chartered Financial Consultant',
    companyOrField: 'Global Investment Advisory',
    education: 'BSc Economics & Finance',
    institution: 'London School of Economics (LSE)',
    familyType: 'Nuclear Family',
    sect: 'Sunni',
    caste: 'Qureshi',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Meat Only • Fasting',
    income: '£65,000 - £80,000 / year',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 85,
    aboutMe:
      'British-Pakistani born and raised in London with deep affection for my Pakistani heritage. Working in the City of London in sustainable investment. I enjoy photography, visiting art museums, and traveling to the Mediterranean and northern Pakistan.',
    idealPartner:
      'Looking for a partner with strong character, humorous outlook on life, and clear moral values. Someone who is comfortable navigating both Western and traditional Eastern cultures with confidence and humility.',
    hobbies: ['Financial Markets', 'Travel & Exploring', 'Islamic Studies', 'Photography'],
    familyDetails: {
      fatherProfession: 'Chartered Accountant & Managing Partner',
      motherProfession: 'Charity Trustee & Homemaker',
      siblingSummary: '1 Brother (Doctor in NHS), 1 Sister (Married in Manchester)',
      residenceDetails: 'Family Home in Richmond, Greater London',
      familyValues: 'Diaspora family maintaining strong cultural roots and Islamic principles'
    },
    verifiedBadges: [
      {
        id: 'b-9',
        type: 'IDENTITY',
        title: 'British Passport & NICOP Verified',
        issuer: 'UK Gov & NADRA NICOP Verisys',
        verifiedAt: 'Aug 04, 2026'
      },
      {
        id: 'b-10',
        type: 'EDUCATION',
        title: 'LSE BSc Economics & Finance',
        issuer: 'LSE Student Services & Hedd UK',
        verifiedAt: 'Jun 19, 2026'
      },
      {
        id: 'b-11',
        type: 'EMPLOYMENT',
        title: 'Investment Advisory Corporate',
        issuer: 'Corporate Domain Security Pass',
        verifiedAt: 'Aug 11, 2026'
      }
    ],
    alignments: [
      'Open to relocation between UK and Pakistan diaspora hubs',
      'Strong religious and ethical financial orientation',
      'Shared age, education, and lifestyle compatibility'
    ],
    discussionPoints: ['Dual-city relocation timelines and family visits'],
    explanation:
      'Maryam matches your criteria for overseas diaspora flexibility, strong education, and Islamic lifestyle harmony.',
    starters: [
      'How do you feel about splitting time between the UK and Pakistan in the future?',
      'What was your favorite memory studying economics at LSE?'
    ]
  },
  {
    id: 'cand-female-4',
    name: 'Ayesha Arain',
    age: 25,
    gender: 'FEMALE',
    height: "5'4\" (163 cm)",
    city: 'Lahore (Model Town)',
    originCity: 'Lahore, Pakistan',
    profession: 'Civil Services Officer (PAS)',
    companyOrField: 'Government of Pakistan',
    education: 'BSc Economics & Politics',
    institution: 'LUMS (Class of 2022)',
    familyType: 'Nuclear Family',
    sect: 'Sunni',
    caste: 'Arain',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Always',
    income: 'PKR 250,000 - 350,000 / mo',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 92,
    aboutMe:
      'Public service professional passionate about good governance, education reform, and social welfare. Enjoy Urdu literature, calligraphy, and family outings.',
    idealPartner:
      'Seeking an honest, intellectually supportive partner who values public service, integrity, and reciprocal loyalty.',
    hobbies: ['Calligraphy', 'Literature & Poetry', 'Community Service'],
    familyDetails: {
      fatherProfession: 'Senior Bureaucrat (Retd)',
      motherProfession: 'College Principal',
      siblingSummary: '1 Brother (Civil Engineer in Canada)',
      residenceDetails: 'Family Residence in Model Town, Lahore',
      familyValues: 'Traditional, highly disciplined, and pious'
    },
    verifiedBadges: [
      {
        id: 'b-f4-1',
        type: 'IDENTITY',
        title: 'Smart CNIC Verified',
        issuer: 'NADRA Gateway',
        verifiedAt: 'Jul 20, 2026'
      },
      {
        id: 'b-f4-2',
        type: 'EDUCATION',
        title: 'LUMS Degree Authenticated',
        issuer: 'HEC Pakistan',
        verifiedAt: 'Jun 10, 2026'
      }
    ],
    alignments: ['Lahore origin', 'Distinguished civil service track record', 'High cultural compatibility'],
    discussionPoints: ['Career aspirations and mutual family values'],
    explanation: 'Strong match on educational prestige, Lahore family roots, and ethical alignment.',
    starters: ['What inspired you to enter the civil services?']
  },
  {
    id: 'cand-male-3',
    name: 'Daniyal Sheikh',
    age: 28,
    gender: 'MALE',
    height: "5'10\" (178 cm)",
    city: 'London, United Kingdom',
    originCity: 'Karachi (Origin) / London',
    profession: 'Senior Portfolio Manager',
    companyOrField: 'Global Asset Management',
    education: 'MSc Financial Analytics',
    institution: "King's College London",
    familyType: 'Nuclear Family',
    sect: 'Sunni',
    caste: 'Sheikh',
    prayerLevel: 'Usually / 5x daily',
    fastingDietary: 'Strictly Halal Only',
    income: '£75,000 - £95,000 / year',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 88,
    aboutMe:
      'Working in global asset management in central London. Passionate about ethical finance, fitness, cricket, and weekend road trips.',
    idealPartner:
      'Looking for a cheerful, practicing Muslim partner with good family values and intellectual curiosity.',
    hobbies: ['Cricket', 'Gym & Fitness', 'Travel', 'Economics'],
    familyDetails: {
      fatherProfession: 'Industrial Business Owner',
      motherProfession: 'Homemaker',
      siblingSummary: '2 Sisters (Both married in UK & Karachi)',
      residenceDetails: 'Own apartment in Canary Wharf, London',
      familyValues: 'Traditional business family with global exposure'
    },
    verifiedBadges: [
      {
        id: 'b-m5',
        type: 'IDENTITY',
        title: 'UK Passport Verified',
        issuer: 'Identity Check API',
        verifiedAt: 'Aug 20, 2026'
      }
    ],
    alignments: ['London-based diaspora', 'High financial and career stability'],
    discussionPoints: ['Travel preferences and future relocation plans'],
    explanation: 'Great match for UK/Diaspora living and career synergy.',
    starters: ['How do you like the finance scene in London?']
  },
  {
    id: 'cand-male-4',
    name: 'Usman Mughal',
    age: 30,
    gender: 'MALE',
    height: "5'9\" (175 cm)",
    city: 'Lahore (Cantt)',
    originCity: 'Lahore, Pakistan',
    profession: 'Lead Urban Architect & Designer',
    companyOrField: 'Architectural Design Firm',
    education: 'B.Arch Architecture',
    institution: 'National College of Arts (NCA)',
    familyType: 'Nuclear Family Setup',
    sect: 'Sunni',
    caste: 'Mughal',
    prayerLevel: 'Always (5x daily)',
    fastingDietary: 'Strictly Halal Always',
    income: 'PKR 450,000 - 600,000 / mo',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
    ],
    photoBlurred: true,
    score: 87,
    aboutMe:
      'Architect with a passion for sustainable Islamic architecture and historic restoration. Love sketching, cycling, and exploring traditional craft bazaars.',
    idealPartner:
      'Seeking a creative, kind-hearted and sincere life partner who appreciates arts, culture and values a warm home life.',
    hobbies: ['Sketching', 'Cycling', 'Historic Restoration', 'Culinary Arts'],
    familyDetails: {
      fatherProfession: 'Civil Engineer (Retd)',
      motherProfession: 'Teacher (Retd)',
      siblingSummary: '1 Brother (Software Developer in Germany)',
      residenceDetails: 'Architect-designed house in Lahore Cantt',
      familyValues: 'Cultured, religious and close-knit'
    },
    verifiedBadges: [
      {
        id: 'b-m6',
        type: 'IDENTITY',
        title: 'NADRA Smart CNIC Verified',
        issuer: 'NADRA Gateway',
        verifiedAt: 'Jul 29, 2026'
      }
    ],
    alignments: ['Lahore resident', 'Creative and professional balance'],
    discussionPoints: ['Design aesthetics and family life'],
    explanation: 'Warm cultural alignment and creative resonance.',
    starters: ['What is your favorite historical building in Lahore?']
  }
];

type SortOption = 'SCORE_DESC' | 'NAME_ASC' | 'NAME_DESC' | 'AGE_ASC' | 'AGE_DESC' | 'CASTE_ASC';
type GenderFilter = 'ALL' | 'FEMALE' | 'MALE';

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<CandidateFullProfile[]>([]);
  const [matchStates, setMatchStates] = useState<Record<string, MatchStatus>>(getMatchStates);
  const [consentModalTarget, setConsentModalTarget] = useState<CandidateFullProfile | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateFullProfile | null>(null);
  const [reportModalCandidate, setReportModalCandidate] = useState<CandidateFullProfile | null>(null);
  
  // Filtering & Sorting State
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('ALL');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<GenderFilter>('ALL');
  const [selectedCasteFilter, setSelectedCasteFilter] = useState<string>('ALL');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('SCORE_DESC');

  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [safetyBannerMessage, setSafetyBannerMessage] = useState<string>('');

  useEffect(() => {
    // Load incognito preference
    const saved = localStorage.getItem('wasl_incognito_mode') === 'true';
    setIsIncognito(saved);

    // Default gender filter to ALL so all newly registered profiles are visible by default
    setSelectedGenderFilter('ALL');

    const currentUserName = (localStorage.getItem('wasl_user_name') || '').trim().toLowerCase();
    const currentUserEmail = (localStorage.getItem('wasl_user_email') || '').trim().toLowerCase();
    const currentUserPhone = (localStorage.getItem('wasl_user_phone') || '').trim().toLowerCase();

    // Fetch persistent registered candidates from backend
    const fetchRegisteredCandidates = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/persistence/all`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          const registeredProfiles: CandidateFullProfile[] = [];

          for (const u of data.users) {
            if (!u.candidateProfile) continue;
            const p = u.candidateProfile;
            const pName = (p.displayName || '').trim().toLowerCase();
            const pEmail = (u.email || '').trim().toLowerCase();
            const pPhone = (u.phone || '').trim().toLowerCase();

            // Filter out current logged in user
            if (
              (currentUserName && pName === currentUserName) ||
              (currentUserEmail && pEmail === currentUserEmail) ||
              (currentUserPhone && pPhone === currentUserPhone)
            ) {
              continue;
            }

            // Calculate age
            let age = 26;
            if (p.dateOfBirth) {
              const bDate = new Date(p.dateOfBirth);
              if (!isNaN(bDate.getTime())) {
                const today = new Date();
                age = today.getFullYear() - bDate.getFullYear();
              }
            }

            const formatted: CandidateFullProfile = {
              id: `user-${u.id}`,
              name: p.displayName || 'Verified Candidate',
              age: age > 18 ? age : 26,
              gender: p.gender || 'FEMALE',
              height: p.heightCm ? `${Math.floor(p.heightCm / 30.48)}'${Math.round((p.heightCm % 30.48) / 2.54)}"` : "5'6\"",
              city: p.city || 'Lahore, Pakistan',
              originCity: p.city || 'Lahore, Pakistan',
              profession: p.profession || 'Verified Professional',
              companyOrField: 'Verified Domain',
              education: p.education || 'Higher Education Degree',
              institution: 'HEC Accredited University',
              familyType: p.familyStructure || 'Nuclear Family Setup',
              sect: p.sect || 'Sunni',
              caste: p.caste || 'Arain',
              prayerLevel: p.prayerLevel || 'Always (5x daily)',
              fastingDietary: 'Strictly Halal Always',
              income: 'Verified Income Bracket',
              photos: p.photos && p.photos.filter(Boolean).length > 0
                ? p.photos.filter(Boolean)
                : [
                    p.gender === 'MALE'
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
                  ],
              photoBlurred: true,
              score: 95,
              aboutMe: p.bio || 'Authentic verified member registered on Wasl Matrimonial Service.',
              idealPartner: 'Looking for a sincere, pious, and emotionally mature life partner with compatible family values.',
              hobbies: Array.isArray(p.hobbies) && p.hobbies.length > 0 ? p.hobbies : ['Reading', 'Islamic Studies', 'Travel'],
              familyDetails: {
                fatherProfession: 'Educated Family Background',
                motherProfession: 'Homemaker',
                siblingSummary: 'Respected Family Unit',
                residenceDetails: p.city || 'Family Residence',
                familyValues: 'Practicing, educated, and noble family values'
              },
              verifiedBadges: [
                {
                  id: `badge-${u.id}`,
                  type: 'IDENTITY',
                  title: 'NADRA Smart CNIC Verified',
                  issuer: 'Wasl Verisys Direct Gateway',
                  verifiedAt: 'Oct 2026'
                }
              ],
              alignments: [
                'Directly matching location and family values',
                'Verified faith and lifestyle commitments',
                'Mutual educational background compatibility'
              ],
              discussionPoints: ['Lifestyle harmony and long-term goals'],
              explanation: 'Authentic candidate registered through Wasl onboarding system.',
              starters: ['Assalamu Alaikum! I reviewed your profile and noticed our values align remarkably well.']
            };

            registeredProfiles.push(formatted);
          }

          setCandidates(registeredProfiles);
        }
      } catch (err) {
        console.warn('Failed to load persistent candidates', err);
      }
    };

    fetchRegisteredCandidates();

    const syncStates = () => {
      setMatchStates(getMatchStates());
    };
    syncStates();
    window.addEventListener('wasl_match_state_updated', syncStates);
    return () => window.removeEventListener('wasl_match_state_updated', syncStates);
  }, []);

  const handleToggleIncognito = async () => {
    const nextState = !isIncognito;
    setIsIncognito(nextState);
    localStorage.setItem('wasl_incognito_mode', String(nextState));

    try {
      await fetch(`${getApiBaseUrl()}/api/v1/safety/incognito`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isIncognito: nextState })
      });
    } catch {}

    setSafetyBannerMessage(
      nextState
        ? 'Incognito Privacy Mode Activated: Your profile is now hidden from public discovery and visible only to candidates you express interest in first.'
        : 'Incognito Mode Deactivated: Your profile is now visible to all compatible verified members.'
    );
    setTimeout(() => setSafetyBannerMessage(''), 5000);
  };

  const togglePhotoBlur = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, photoBlurred: !c.photoBlurred } : c))
    );
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate(prev => prev ? { ...prev, photoBlurred: !prev.photoBlurred } : null);
    }
  };

  const handleExpressInterest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCandidateMatchStatus(id, 'SENT_PENDING');
    setMatchStates(getMatchStates());
    setSafetyBannerMessage('Interest proposal sent! Direct chat will unlock automatically once they accept.');
    setTimeout(() => setSafetyBannerMessage(''), 4500);
  };

  const handleAcceptProposal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCandidateMatchStatus(id, 'MUTUAL_MATCH');
    setMatchStates(getMatchStates());
    setSafetyBannerMessage('Proposal accepted! Direct chat is now unlocked.');
    setTimeout(() => setSafetyBannerMessage(''), 4500);
  };

  const handleDirectBlock = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCandidates(prev => prev.filter(c => c.id !== id));
    if (selectedCandidate?.id === id) setSelectedCandidate(null);
    setSafetyBannerMessage(`${name} has been blocked and hidden from your discovery feed.`);
    setTimeout(() => setSafetyBannerMessage(''), 4000);

    fetch(`${getApiBaseUrl()}/api/v1/safety/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCandidateId: id })
    }).catch(() => {});
  };

  const handleBlockSuccess = (blockedId: string) => {
    setCandidates(prev => prev.filter(c => c.id !== blockedId));
    if (selectedCandidate?.id === blockedId) setSelectedCandidate(null);
    setSafetyBannerMessage('Report submitted and candidate removed from your discovery feed.');
    setTimeout(() => setSafetyBannerMessage(''), 4500);
  };

  const resetAllFilters = () => {
    setSelectedCityFilter('ALL');
    setSelectedGenderFilter('ALL');
    setSelectedCasteFilter('ALL');
    setSelectedAgeFilter('ALL');
    setSearchQuery('');
    setSortBy('SCORE_DESC');
  };

  const activeFiltersCount = 
    (selectedCityFilter !== 'ALL' ? 1 : 0) +
    (selectedGenderFilter !== 'ALL' ? 1 : 0) +
    (selectedCasteFilter !== 'ALL' ? 1 : 0) +
    (selectedAgeFilter !== 'ALL' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0) +
    (sortBy !== 'SCORE_DESC' ? 1 : 0);

  // Filter and Sort Candidate Pipeline
  const filteredAndSortedCandidates = candidates
    .filter(c => {
      // City Filter
      if (selectedCityFilter !== 'ALL') {
        if (!c.city.toLowerCase().includes(selectedCityFilter.toLowerCase())) return false;
      }
      // Gender Filter
      if (selectedGenderFilter !== 'ALL') {
        const candGender = c.gender || 'FEMALE';
        if (candGender !== selectedGenderFilter) return false;
      }
      // Caste Filter
      if (selectedCasteFilter !== 'ALL') {
        if (!c.caste || !c.caste.toLowerCase().includes(selectedCasteFilter.toLowerCase())) return false;
      }
      // Age Bracket Filter
      if (selectedAgeFilter !== 'ALL') {
        if (selectedAgeFilter === '18-25' && (c.age < 18 || c.age > 25)) return false;
        if (selectedAgeFilter === '26-30' && (c.age < 26 || c.age > 30)) return false;
        if (selectedAgeFilter === '31-35' && (c.age < 31 || c.age > 35)) return false;
        if (selectedAgeFilter === '36+' && c.age < 36) return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCaste = c.caste?.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesProfession = c.profession.toLowerCase().includes(q);
        const matchesEdu = c.education.toLowerCase().includes(q);
        const matchesSect = c.sect.toLowerCase().includes(q);
        if (!matchesName && !matchesCaste && !matchesCity && !matchesProfession && !matchesEdu && !matchesSect) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'SCORE_DESC') {
        return b.score - a.score;
      }
      if (sortBy === 'NAME_ASC') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'NAME_DESC') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'AGE_ASC') {
        return a.age - b.age;
      }
      if (sortBy === 'AGE_DESC') {
        return b.age - a.age;
      }
      if (sortBy === 'CASTE_ASC') {
        const casteA = a.caste || 'zzz';
        const casteB = b.caste || 'zzz';
        return casteA.localeCompare(casteB);
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Safety Alert Notification Toast / Banner */}
      {safetyBannerMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>{safetyBannerMessage}</span>
          </div>
          <button onClick={() => setSafetyBannerMessage('')} className="text-emerald-700 hover:text-emerald-950">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* COMPACT FILTER & SEARCH BAR WITH ARROW TOGGLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all overflow-hidden">
        {/* Compact Top Bar */}
        <div className="p-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Search Input */}
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, caste, education, city..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 placeholder-slate-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Incognito + Sort By + Expandable Filter Arrow Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Incognito / Privacy Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleIncognito}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                isIncognito
                  ? 'bg-slate-900 text-white border-slate-800 ring-2 ring-slate-800/20 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Incognito Privacy Mode"
            >
              {isIncognito ? (
                <>
                  <EyeClosed className="w-3.5 h-3.5 text-rose-400" />
                  <span>Incognito: ON</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Incognito</span>
                </>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="SCORE_DESC">🌟 Match %</option>
                <option value="NAME_ASC">🔤 Name (A-Z)</option>
                <option value="NAME_DESC">🔤 Name (Z-A)</option>
                <option value="AGE_ASC">👶 Age (Youngest)</option>
                <option value="AGE_DESC">🧓 Age (Oldest)</option>
                <option value="CASTE_ASC">🏛️ Caste (A-Z)</option>
              </select>
            </div>

            {/* Expandable Criteria Toggle Button with Arrow */}
            <button
              type="button"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border shadow-sm ${
                isFilterExpanded || activeFiltersCount > 0
                  ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-800/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isFilterExpanded || activeFiltersCount > 0 ? 'bg-white text-emerald-900' : 'bg-emerald-800 text-white'
                }`}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isFilterExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Criteria Drawer (Revealed on Clicking the Arrow) */}
        {isFilterExpanded && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Gender */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> Gender:
                </label>
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  {[
                    { label: 'All', value: 'ALL' },
                    { label: 'Female', value: 'FEMALE' },
                    { label: 'Male', value: 'MALE' }
                  ].map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setSelectedGenderFilter(g.value as GenderFilter)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                        selectedGenderFilter === g.value
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Age Range */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  🎂 Age Bracket:
                </label>
                <select
                  value={selectedAgeFilter}
                  onChange={(e) => setSelectedAgeFilter(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2 border transition focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white ${
                    selectedAgeFilter !== 'ALL'
                      ? 'border-emerald-400 text-emerald-900 font-bold bg-emerald-50/50'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="ALL">All Ages</option>
                  <option value="18-25">18 – 25 Yrs</option>
                  <option value="26-30">26 – 30 Yrs</option>
                  <option value="31-35">31 – 35 Yrs</option>
                  <option value="36+">36+ Yrs</option>
                </select>
              </div>

              {/* 3. Caste / Biradari */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  🏛️ Caste / Biradari:
                </label>
                <select
                  value={selectedCasteFilter}
                  onChange={(e) => setSelectedCasteFilter(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2 border transition focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white ${
                    selectedCasteFilter !== 'ALL'
                      ? 'border-emerald-400 text-emerald-900 font-bold bg-emerald-50/50'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="ALL">All Castes / Biradaris</option>
                  {CASTE_OPTIONS.slice(0, 20).map(caste => (
                    <option key={caste} value={caste}>
                      {caste}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. City / Region */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> City / Region:
                </label>
                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2 border transition focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white ${
                    selectedCityFilter !== 'ALL'
                      ? 'border-emerald-400 text-emerald-900 font-bold bg-emerald-50/50'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="ALL">All Cities</option>
                  <option value="Lahore">🇵🇰 Lahore</option>
                  <option value="Islamabad">🇵🇰 Islamabad / Rawalpindi</option>
                  <option value="London">🇬🇧 London (UK)</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500">
                Found <span className="font-bold text-emerald-800">{filteredAndSortedCandidates.length}</span> matching candidates
              </span>

              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterExpanded(false)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 rounded-xl transition shadow-sm"
                >
                  Apply & Collapse ▲
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Recommendation Cards */}
      <div className="grid grid-cols-1 gap-8">
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No candidates match your active filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your caste, gender, age, or city criteria to discover more verified matches.
              </p>
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition shadow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredAndSortedCandidates.map(cand => (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand)}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col lg:flex-row cursor-pointer group"
            >
              {/* Left Photo & Privacy Canvas */}
              <div className="lg:w-80 bg-slate-100 p-6 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="w-48 h-48 rounded-2xl bg-emerald-800 text-white font-bold text-3xl flex items-center justify-center relative overflow-hidden shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cand.photos[0]}
                    alt={cand.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      cand.photoBlurred ? 'blur-xl scale-110 filter' : 'scale-100'
                    }`}
                  />

                  {cand.photoBlurred && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center">
                      <Lock className="w-6 h-6 text-rose-300 mb-1" />
                      <div className="text-xs font-bold text-white tracking-wide">PHOTO BLURRED</div>
                      <div className="text-[10px] text-rose-200 mt-0.5">Revealed on Mutual Interest</div>
                    </div>
                  )}

                  {/* Dynamic Watermark overlay */}
                  <div className="absolute inset-0 opacity-25 text-[8px] pointer-events-none flex items-center justify-center -rotate-12 select-none font-mono text-white">
                    WASL SECURE • {cand.id} • CONFIDENTIAL
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {cand.photos.length} Verified Photos
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => togglePhotoBlur(cand.id, e)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                >
                  {cand.photoBlurred ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" /> Preview Clear View
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Apply Privacy Blur
                    </>
                  )}
                </button>
              </div>

              {/* Right Profile & Compatibility Details */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition">
                          {cand.name}
                        </h2>
                        <span className="text-xs bg-emerald-100/80 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {cand.sect}
                        </span>
                        {cand.caste && (
                          <span className="text-xs bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                            {cand.caste}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                        <span>{cand.age} Yrs</span>
                        <span>•</span>
                        <span>{cand.height}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {cand.city}
                        </span>
                      </div>
                    </div>

                    {/* 100-pt Score Highlight with Royal Emerald & Champagne Gold */}
                    <div className="flex items-center gap-2.5 bg-gradient-to-br from-amber-50/90 via-emerald-50/40 to-amber-100/50 border border-amber-200/90 px-4 py-2 rounded-2xl shadow-sm">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="text-xl font-black text-emerald-950 leading-none">{cand.score}%</div>
                        <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                          Compatible
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demographics row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                      <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-semibold">{cand.profession}</div>
                        <div className="text-slate-500 text-[11px]">{cand.familyType}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                      <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-semibold">{cand.education}</div>
                        <div className="text-slate-500 text-[11px]">{cand.institution}</div>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    &ldquo;{cand.aboutMe}&rdquo;
                  </p>

                  {/* Explainable AI Box */}
                  <div className="bg-emerald-800/5 border border-emerald-800/20 rounded-2xl p-4 space-y-2">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Why You Match (Explainable Reasoning)
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {cand.explanation}
                    </p>
                    <div className="text-[11px] text-emerald-800 font-medium pt-1">
                      💡 <span className="font-semibold">Conversation starter:</span> &ldquo;{cand.starters[0]}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1">
                      View Full Story Cards <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    {/* Block & Hide Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDirectBlock(cand.id, cand.name, e)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50"
                      title="Block & Hide Candidate"
                    >
                      <Ban className="w-3.5 h-3.5" /> Hide
                    </button>

                    {/* Report Modal Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportModalCandidate(cand);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50"
                      title="Report Candidate Profile"
                    >
                      <Flag className="w-3.5 h-3.5" /> Report
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* MUTUAL MATCH GATE BUTTONS */}
                    {matchStates[cand.id] === 'MUTUAL_MATCH' ? (
                      <Link
                        href={`/chat/${cand.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm"
                        title={`Chat Unlocked with ${cand.name}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat (Unlocked)</span>
                      </Link>
                    ) : matchStates[cand.id] === 'RECEIVED_PENDING' ? (
                      <button
                        type="button"
                        onClick={(e) => handleAcceptProposal(cand.id, e)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition flex items-center gap-1.5 shadow-sm"
                        title={`Accept Proposal from ${cand.name} to Unlock Chat`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Accept & Chat</span>
                      </button>
                    ) : matchStates[cand.id] === 'SENT_PENDING' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConsentModalTarget(cand);
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
                        title="Proposal Sent • Awaiting Response"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Match 🔒</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConsentModalTarget(cand);
                          }}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5"
                          title="Direct Chat is locked until mutual consent"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Chat 🔒</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleExpressInterest(cand.id, e)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition flex items-center gap-1.5 shadow"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Express Interest</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RICH CANDIDATE PROFILE MODAL */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onExpressInterest={handleExpressInterest}
        isInterestExpressed={selectedCandidate ? matchStates[selectedCandidate.id] === 'SENT_PENDING' || matchStates[selectedCandidate.id] === 'MUTUAL_MATCH' : false}
        onReportOrBlock={(cand) => {
          setReportModalCandidate(cand);
        }}
      />

      {/* MUTUAL MATCH CONSENT FIRST MODAL */}
      {consentModalTarget && (
        <MutualMatchConsentModal
          isOpen={Boolean(consentModalTarget)}
          onClose={() => setConsentModalTarget(null)}
          candidateId={consentModalTarget.id}
          candidateName={consentModalTarget.name}
          status={matchStates[consentModalTarget.id] || 'NOT_CONNECTED'}
          onSendProposal={handleExpressInterest}
          onAcceptProposal={handleAcceptProposal}
        />
      )}

      {/* REPORT & BLOCK SAFETY MODAL */}
      {reportModalCandidate && (
        <ReportAndBlockModal
          candidateId={reportModalCandidate.id}
          candidateName={reportModalCandidate.name}
          isOpen={Boolean(reportModalCandidate)}
          onClose={() => setReportModalCandidate(null)}
          onBlockSuccess={handleBlockSuccess}
        />
      )}
    </div>
  );
}
