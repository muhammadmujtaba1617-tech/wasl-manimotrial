'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  BookOpen,
  DollarSign,
  Calendar,
  Sparkles,
  Edit3,
  Sliders,
  Smile,
  Compass,
  Check,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Move,
  Crop,
  Maximize2
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    name: 'Male Formal 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900'
  },
  {
    name: 'Male Formal 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=900'
  },
  {
    name: 'Male Modern',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900'
  },
  {
    name: 'Female Modest 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
  },
  {
    name: 'Female Modest 2',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900'
  },
  {
    name: 'Female Professional',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=900'
  }
];

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [initials, setInitials] = useState('NM');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [photoSavedToast, setPhotoSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Interactive Crop, Zoom, Pan & Rotate State
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [userGender, setUserGender] = useState('Unspecified');
  const [userAge, setUserAge] = useState<number | string>('--');
  const [userHeight, setUserHeight] = useState("Not specified");
  const [userMaritalStatus, setUserMaritalStatus] = useState('Single (Never Married)');
  const [userCity, setUserCity] = useState('Location not set');
  const [userEducation, setUserEducation] = useState('Education not specified');
  const [userInstitution, setUserInstitution] = useState('');
  const [userProfession, setUserProfession] = useState('Profession not specified');
  const [userCompany, setUserCompany] = useState('');
  const [userIncome, setUserIncome] = useState('Not specified');
  const [userCaste, setUserCaste] = useState<string>('Not specified');
  const [userSect, setUserSect] = useState<string>('Sunni');
  const [userPrayer, setUserPrayer] = useState('Always (5x daily)');
  const [userDiet, setUserDiet] = useState('Strictly Halal Always');
  const [userFamilyType, setUserFamilyType] = useState('Nuclear Family Setup');
  const [userBio, setUserBio] = useState('');
  const [userHobbies, setUserHobbies] = useState<string[]>([]);

  const [prefAgeMin, setPrefAgeMin] = useState('20');
  const [prefAgeMax, setPrefAgeMax] = useState('30');
  const [prefLocations, setPrefLocations] = useState('Open to all cities');
  const [prefEdu, setPrefEdu] = useState('Bachelors or Master’s');
  const [prefCasteStrictness, setPrefCasteStrictness] = useState('Open to Compatible Families');

  // Quick Edit Details State
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editProfession, setEditProfession] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('wasl_user_name');
    const storedPhoto = localStorage.getItem('wasl_user_photo');
    const storedGender = localStorage.getItem('wasl_user_gender');
    const storedDob = localStorage.getItem('wasl_user_dob');
    const storedHeight = localStorage.getItem('wasl_user_height');
    const storedMarital = localStorage.getItem('wasl_user_marital');
    const storedCity = localStorage.getItem('wasl_user_city');
    const storedCaste = localStorage.getItem('wasl_user_caste');
    const storedSect = localStorage.getItem('wasl_user_sect');
    const storedPrayer = localStorage.getItem('wasl_user_prayer');
    const storedFamilyType = localStorage.getItem('wasl_user_family_type');
    const storedEducation = localStorage.getItem('wasl_user_education');
    const storedInstitution = localStorage.getItem('wasl_user_institution');
    const storedProfession = localStorage.getItem('wasl_user_profession');
    const storedCompany = localStorage.getItem('wasl_user_company');
    const storedIncome = localStorage.getItem('wasl_user_income');
    const storedBio = localStorage.getItem('wasl_user_bio');
    const storedHobbies = localStorage.getItem('wasl_user_hobbies');
    const storedPrefAgeMin = localStorage.getItem('wasl_pref_age_min');
    const storedPrefAgeMax = localStorage.getItem('wasl_pref_age_max');
    const storedPrefLocations = localStorage.getItem('wasl_pref_locations');
    const storedPrefEdu = localStorage.getItem('wasl_pref_edu');
    const storedPrefCaste = localStorage.getItem('wasl_caste_preference');
    const storedPhone = localStorage.getItem('wasl_user_phone');
    const storedEmail = localStorage.getItem('wasl_user_email');

    if (storedPhoto) setUserPhoto(storedPhoto);
    if (storedGender) setUserGender(storedGender);
    if (storedHeight) setUserHeight(`${storedHeight} cm`);
    if (storedMarital) setUserMaritalStatus(storedMarital);
    if (storedEducation) setUserEducation(storedEducation);
    if (storedInstitution) setUserInstitution(storedInstitution);
    if (storedProfession) setUserProfession(storedProfession);
    if (storedCompany) setUserCompany(storedCompany);
    if (storedIncome) setUserIncome(storedIncome);
    if (storedPrayer) setUserPrayer(storedPrayer);
    if (storedFamilyType) setUserFamilyType(storedFamilyType);
    if (storedBio) setUserBio(storedBio);

    if (storedHobbies) {
      try {
        const parsed = JSON.parse(storedHobbies);
        if (Array.isArray(parsed) && parsed.length > 0) setUserHobbies(parsed);
      } catch {}
    }

    if (storedDob) {
      const birthYear = new Date(storedDob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear && currentYear - birthYear > 15) {
        setUserAge(currentYear - birthYear);
      }
    }

    if (storedPrefAgeMin) setPrefAgeMin(storedPrefAgeMin);
    if (storedPrefAgeMax) setPrefAgeMax(storedPrefAgeMax);
    if (storedPrefLocations) setPrefLocations(storedPrefLocations);
    if (storedPrefEdu) setPrefEdu(storedPrefEdu);
    if (storedPrefCaste) {
      setPrefCasteStrictness(
        storedPrefCaste === 'MUST_MATCH'
          ? 'Must match my caste'
          : storedPrefCaste === 'PREFER_SAME'
          ? 'Prefer same caste'
          : 'Open to all castes'
      );
    }

    if (storedName) {
      setDisplayName(storedName);
      const parts = storedName.trim().split(' ');
      if (parts.length >= 2) {
        setInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
      } else if (parts[0]) {
        setInitials(parts[0].slice(0, 2).toUpperCase());
      }
    } else if (storedPhone) {
      setDisplayName(`User (${storedPhone.slice(-4)})`);
      setInitials('US');
    } else if (storedEmail) {
      setDisplayName(storedEmail.split('@')[0]);
      setInitials('US');
    }

    if (storedCity) setUserCity(storedCity);
    if (storedCaste) setUserCaste(storedCaste);
    if (storedSect) setUserSect(storedSect);

    setEditName(storedName || '');
    setEditCity(storedCity || '');
    setEditProfession(storedProfession || '');
    setEditEducation(storedEducation || '');
    setEditBio(storedBio || '');
  }, []);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      localStorage.setItem('wasl_user_name', editName.trim());
      setDisplayName(editName.trim());
      const parts = editName.trim().split(' ');
      if (parts.length >= 2) {
        setInitials(`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase());
      } else if (parts[0]) {
        setInitials(parts[0].slice(0, 2).toUpperCase());
      }
    }
    if (editCity.trim()) {
      localStorage.setItem('wasl_user_city', editCity.trim());
      setUserCity(editCity.trim());
    }
    if (editProfession.trim()) {
      localStorage.setItem('wasl_user_profession', editProfession.trim());
      setUserProfession(editProfession.trim());
    }
    if (editEducation.trim()) {
      localStorage.setItem('wasl_user_education', editEducation.trim());
      setUserEducation(editEducation.trim());
    }
    if (editBio.trim()) {
      localStorage.setItem('wasl_user_bio', editBio.trim());
      setUserBio(editBio.trim());
    }

    try {
      const email = localStorage.getItem('wasl_user_email');
      const phone = localStorage.getItem('wasl_user_phone');
      const stored = localStorage.getItem('wasl_registered_candidates');
      if (stored) {
        let list = JSON.parse(stored);
        if (Array.isArray(list)) {
          list = list.map((c: any) => {
            if ((email && c.email === email) || (phone && c.phone === phone)) {
              return {
                ...c,
                name: editName.trim() || c.name,
                city: editCity.trim() || c.city,
                profession: editProfession.trim() || c.profession,
                education: editEducation.trim() || c.education,
                aboutMe: editBio.trim() || c.aboutMe
              };
            }
            return c;
          });
          localStorage.setItem('wasl_registered_candidates', JSON.stringify(list));
          if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('wasl_sync_channel');
            channel.postMessage({ type: 'PROFILE_UPDATED' });
            channel.close();
          }
        }
      }
    } catch (err) {
      console.error('Failed to update candidate cache:', err);
    }

    setIsEditDetailsOpen(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 4000);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setTempPhoto(reader.result as string);
          handleResetCrop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag to pan image inside crop circle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleResetCrop = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Extract high-resolution cropped avatar via Canvas
  const generateCroppedImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const activePhoto = tempPhoto || customPhotoUrl || userPhoto;
      if (!activePhoto) {
        resolve('');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const outputSize = 400; // High resolution 400x400 square
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(activePhoto);
          return;
        }

        ctx.clearRect(0, 0, outputSize, outputSize);

        // Circular clipping mask
        ctx.save();
        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.clip();

        // Translate to center
        ctx.translate(outputSize / 2, outputSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Viewport on screen is 224px (w-56)
        const viewportRatio = outputSize / 224;
        ctx.translate(position.x * viewportRatio, position.y * viewportRatio);

        const aspectRatio = img.width / img.height;
        let drawWidth = outputSize;
        let drawHeight = outputSize;
        if (aspectRatio > 1) {
          drawWidth = outputSize * aspectRatio;
        } else {
          drawHeight = outputSize / aspectRatio;
        }

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        try {
          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve(croppedDataUrl);
        } catch {
          resolve(activePhoto);
        }
      };

      img.onerror = () => {
        resolve(activePhoto);
      };

      img.src = activePhoto;
    });
  };

  const handleSavePhoto = async () => {
    const croppedUrl = await generateCroppedImage();
    const photoToSave = croppedUrl || tempPhoto.trim() || customPhotoUrl.trim() || userPhoto;
    if (photoToSave) {
      setUserPhoto(photoToSave);
      localStorage.setItem('wasl_user_photo', photoToSave);
      setIsPhotoModalOpen(false);
      setCustomPhotoUrl('');
      handleResetCrop();
      setPhotoSavedToast(true);
      setTimeout(() => setPhotoSavedToast(false), 4000);
    }
  };

  const handleRemovePhoto = () => {
    setTempPhoto('');
    setCustomPhotoUrl('');
    setUserPhoto('');
    localStorage.removeItem('wasl_user_photo');
    handleResetCrop();
    setIsPhotoModalOpen(false);
    setPhotoSavedToast(true);
    setTimeout(() => setPhotoSavedToast(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {photoSavedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-bold">Profile picture updated successfully!</span>
        </div>
      )}

      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture (Clickable to Update) */}
          <button
            type="button"
            onClick={() => {
              setTempPhoto(userPhoto);
              setCustomPhotoUrl('');
              setIsPhotoModalOpen(true);
            }}
            className="relative w-24 h-24 rounded-full border-2 border-emerald-700 ring-4 ring-emerald-600/20 shadow-lg shrink-0 bg-emerald-950 group cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-emerald-500 transition-transform active:scale-95"
            title="Click to update your profile photo"
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              {userPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userPhoto}
                  alt={displayName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setUserPhoto('')}
                />
              ) : (
                <div className="w-full h-full bg-emerald-800 text-white font-black text-3xl flex items-center justify-center">
                  {initials}
                </div>
              )}
            </div>

            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-full">
              <Camera className="w-5 h-5 mb-0.5 text-emerald-300" />
              <span className="text-[10px] font-bold">Update</span>
            </div>

            {/* Badge Icon on Bottom Right */}
            <div className="absolute bottom-0 right-0 bg-emerald-800 text-white p-1.5 rounded-full shadow-md border-2 border-white group-hover:bg-emerald-700 transition">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </button>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{displayName}</h1>
              {userCaste && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  🏛️ {userCaste}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-600">
              <span>{userAge} Yrs</span>
              <span>•</span>
              <span>{userHeight}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {userCity}
              </span>
              <span>•</span>
              <span className="bg-emerald-50 text-emerald-900 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                {userSect}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditDetailsOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-800 text-white hover:bg-emerald-900 transition flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <Link
            href="/onboarding"
            className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Complete 5-step onboarding wizard"
          >
            <Sliders className="w-4 h-4" />
            Wizard
          </Link>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="space-y-6">
        {/* Section 1: Personal & Demographics Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-extrabold text-slate-900">Personal & Demographic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm">{displayName}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Gender & Age</span>
              <span className="font-bold text-slate-900 text-sm">{userGender} • {userAge} Years</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Height</span>
              <span className="font-bold text-slate-900 text-sm">{userHeight}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Marital Status</span>
              <span className="font-bold text-slate-900 text-sm">{userMaritalStatus}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Caste / Biradari</span>
              <span className="font-bold text-slate-900 text-sm">{userCaste || 'Not Specified'}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">City / Location</span>
              <span className="font-bold text-slate-900 text-sm">{userCity}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Religious Sect</span>
              <span className="font-bold text-slate-900 text-sm">{userSect}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Daily Prayers</span>
              <span className="font-bold text-slate-900 text-sm">{userPrayer}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Dietary Practices</span>
              <span className="font-bold text-slate-900 text-sm">{userDiet}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Professional Career */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-extrabold text-slate-900">Education & Professional Career</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Highest Qualification
              </span>
              <span className="font-bold text-slate-900 text-sm block">{userEducation}</span>
              <span className="text-slate-500 text-[11px] block">{userInstitution}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Occupation / Role
              </span>
              <span className="font-bold text-slate-900 text-sm block">{userProfession}</span>
              <span className="text-slate-500 text-[11px] block">{userCompany}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Monthly Income Bracket</span>
              <span className="font-bold text-emerald-900 text-sm block">{userIncome}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Living Structure</span>
              <span className="font-bold text-slate-900 text-sm block">{userFamilyType}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Narrative Bio & Hobbies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-extrabold text-slate-900">About Me & Interests</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
              &ldquo;{userBio}&rdquo;
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Hobbies & Personal Interests:</span>
              <div className="flex flex-wrap gap-2">
                {userHobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Section 5: Partner Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-extrabold text-slate-900">Partner Preferences & Criteria</h2>
            </div>
            <Link
              href="/onboarding"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" /> Adjust Criteria
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Age Preference</span>
              <span className="font-bold text-slate-900">{prefAgeMin} – {prefAgeMax} Years</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Target Regions</span>
              <span className="font-bold text-slate-900">{prefLocations}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Minimum Education</span>
              <span className="font-bold text-slate-900">{prefEdu}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-500 font-semibold text-[11px] block">Caste Preference</span>
              <span className="font-bold text-slate-900">{prefCasteStrictness}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO UPDATE & CROP STUDIO MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                  <Crop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Photo Preview & Crop Studio</h3>
                  <p className="text-xs text-slate-500">Drag to pan, zoom, or rotate to fit the circular profile frame</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleResetCrop();
                  setIsPhotoModalOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Crop Viewport */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Central Circular Cropper Viewport */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-emerald-700 ring-4 ring-emerald-600/30 shadow-2xl bg-slate-950 flex items-center justify-center cursor-grab active:cursor-grabbing select-none group"
                  title="Click and drag to position your photo"
                >
                  {tempPhoto || customPhotoUrl || userPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tempPhoto || customPhotoUrl || userPhoto}
                      alt="Crop Viewport"
                      draggable={false}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                      className="w-full h-full object-cover max-w-none pointer-events-none"
                    />
                  ) : (
                    <div className="text-white font-black text-4xl">{initials}</div>
                  )}

                  {/* Alignment Crosshairs Overlay (Rule of Thirds / Center Reticle) */}
                  <div className="absolute inset-0 pointer-events-none rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-white/15 absolute" />
                    <div className="h-full w-[1px] bg-white/15 absolute" />
                    <div className="w-20 h-20 rounded-full border border-dashed border-emerald-400/40" />
                  </div>

                  {/* Drag to Reposition Badge */}
                  <div className="absolute bottom-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition pointer-events-none">
                    <Move className="w-2.5 h-2.5 text-emerald-300" />
                    <span>Drag to pan</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span>Zoom: <strong className="text-emerald-800">{Math.round(zoom * 100)}%</strong></span>
                  <span>•</span>
                  <span>Rotation: <strong className="text-emerald-800">{rotation}°</strong></span>
                </div>
              </div>

              {/* Crop Adjustments Toolbar: Zoom, Rotate, Reset */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-700" /> Adjust Zoom & Framing
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                      title="Rotate 90 degrees clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-emerald-700" /> Rotate 90°
                    </button>
                    <button
                      type="button"
                      onClick={handleResetCrop}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                      title="Reset zoom, rotation and position"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
                    </button>
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.max(1, Number((prev - 0.1).toFixed(2))))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.min(3, Number((prev + 0.1).toFixed(2))))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo Source Options: Device Upload, URL, Presets */}
              <div className="space-y-4 pt-1">
                {/* Option 1: Device File Upload */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Upload New Photo</label>
                  <button
                    type="button"
                    onClick={handleOpenFilePicker}
                    className="w-full py-2.5 px-4 border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-900 transition group"
                  >
                    <Upload className="w-4 h-4 text-emerald-700 group-hover:-translate-y-0.5 transition-transform" />
                    Browse Photo from Device (JPG, PNG, WEBP)
                  </button>
                </div>

                {/* Option 2: Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Or Paste Web URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={customPhotoUrl}
                        onChange={(e) => {
                          setCustomPhotoUrl(e.target.value);
                          if (e.target.value) {
                            setTempPhoto(e.target.value);
                            handleResetCrop();
                          }
                        }}
                        className="w-full text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 bg-slate-50"
                      />
                    </div>
                    {customPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPhotoUrl('');
                          setTempPhoto(userPhoto);
                          handleResetCrop();
                        }}
                        className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Option 3: Curated Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Or Choose a Preset</label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTempPhoto(preset.url);
                          setCustomPhotoUrl(preset.url);
                          handleResetCrop();
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition ${
                          (tempPhoto === preset.url || customPhotoUrl === preset.url)
                            ? 'border-emerald-700 ring-2 ring-emerald-500 scale-105 shadow-md'
                            : 'border-slate-200 hover:border-emerald-400 opacity-80 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                        {(tempPhoto === preset.url || customPhotoUrl === preset.url) && (
                          <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              {userPhoto ? (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetCrop();
                    setIsPhotoModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Apply & Save Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Profile Details Modal */}
      {isEditDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  وصل
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Edit Profile Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditDetailsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Fatima Zahra or Ahmed Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  placeholder="e.g. Lahore (DHA Phase 5)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profession / Role</label>
                <input
                  type="text"
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  placeholder="e.g. Software Architect or Marketing Lead"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Education Degree & Institution</label>
                <input
                  type="text"
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  placeholder="e.g. MBA from LUMS or MBBS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Me / Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Share a brief overview of your background, values, and what you are looking for in a partner..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/onboarding"
                  onClick={() => setIsEditDetailsOpen(false)}
                  className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" /> Full 5-Step Wizard
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditDetailsOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {profileSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Profile details updated successfully!</span>
        </div>
      )}
    </div>
  );
}
