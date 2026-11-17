import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  ShieldCheck,
  LogOut,
  LogIn,
  Check,
  Edit2,
  Sparkles,
  CloudCheck,
  Star,
  Palette,
} from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../services/sound';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  favoritesCount?: number;
  themeName?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onSignOut,
  onUpdateUser,
  favoritesCount = 0,
  themeName = 'OLED',
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState(
    currentUser?.displayName || 'Sports Fan'
  );
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState(currentUser?.phoneNumber || '');

  if (!isOpen) return null;

  const handleSaveName = () => {
    sounds.playTap();
    if (displayNameDraft.trim()) {
      onUpdateUser({ displayName: displayNameDraft.trim() });
    }
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    sounds.playTap();
    if (phoneDraft.trim()) {
      onUpdateUser({ phoneNumber: phoneDraft.trim() });
    }
    setIsUpdatingPhone(false);
  };

  const handleToggle2FA = () => {
    sounds.playTap();
    if (currentUser) {
      onUpdateUser({ is2FAEnabled: !currentUser.is2FAEnabled });
    }
  };

  const initials = currentUser?.displayName
    ? currentUser.displayName
        .split(' ')
        .map((s) => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'GU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#161618] border border-[#2A2A2E] rounded-[24px] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2E] flex items-center justify-between bg-black/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                My Account & Profile
              </h2>
              <p className="text-xs text-[#8E8E93]">
                {currentUser ? 'Active Authenticated Profile' : 'Guest User Mode'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 space-y-5">
          {/* Avatar and Main Info Banner */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-[#2A2A2E] flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/20 flex items-center justify-center text-lg font-black text-white shadow-inner">
                {currentUser ? initials : <User className="w-6 h-6 text-neutral-400" />}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#161618] ${
                  currentUser ? 'bg-emerald-400' : 'bg-neutral-500'
                }`}
                title={currentUser ? 'Online / Authenticated' : 'Guest'}
              />
            </div>

            <div className="flex-1 min-w-0">
              {currentUser ? (
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={displayNameDraft}
                        onChange={(e) => setDisplayNameDraft(e.target.value)}
                        className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg border border-white/30 focus:outline-none"
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1 rounded bg-white text-black cursor-pointer hover:bg-neutral-200"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white truncate">
                        {currentUser.displayName}
                      </h3>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setIsEditingName(true);
                        }}
                        className="text-neutral-500 hover:text-white p-0.5 cursor-pointer"
                        title="Edit Name"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-[#8E8E93] font-mono mt-0.5">
                    {currentUser.phoneNumber}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>2FA Protected · SMS Verified</span>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-white">Guest User</h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    Local storage only · Link phone for cloud sync
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sync Stats Strip */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-black/40 border border-[#2A2A2E] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[#8E8E93] block uppercase">
                  Followed Teams
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {favoritesCount} Teams Saved
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#2A2A2E] flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[#8E8E93] block uppercase">
                  Active Palette
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {themeName}
                </span>
              </div>
            </div>
          </div>

          {/* Logged in settings & toggles */}
          {currentUser ? (
            <div className="space-y-3">
              {/* Toggle SMS 2FA */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-[#2A2A2E] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Require SMS 2FA on Login
                  </span>
                  <span className="text-[11px] text-[#8E8E93]">
                    Sends a 6-digit one-time passkey to your linked phone
                  </span>
                </div>

                <button
                  onClick={handleToggle2FA}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentUser.is2FAEnabled ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full transition-transform ${
                      currentUser.is2FAEnabled
                        ? 'bg-black translate-x-5'
                        : 'bg-neutral-500 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Update Phone Number Row */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-[#2A2A2E] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Linked Mobile Number
                    </span>
                    <span className="text-[11px] text-[#8E8E93] font-mono">
                      {currentUser.phoneNumber}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsUpdatingPhone(!isUpdatingPhone);
                    }}
                    className="text-xs font-bold text-neutral-300 hover:text-white cursor-pointer"
                  >
                    {isUpdatingPhone ? 'Cancel' : 'Change'}
                  </button>
                </div>

                {isUpdatingPhone && (
                  <div className="flex items-center gap-2 pt-1 animate-fade-in">
                    <input
                      type="tel"
                      value={phoneDraft}
                      onChange={(e) => setPhoneDraft(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="flex-1 bg-black/60 text-white text-xs px-3 py-1.5 rounded-xl border border-white/30 focus:outline-none font-mono"
                    />
                    <button
                      onClick={handleSavePhone}
                      className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onSignOut();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 rounded-xl text-xs font-bold border border-red-900/40 transition-colors cursor-pointer mt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            /* Guest User State Action */
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-neutral-900/50 to-emerald-950/30 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    Unlock Cloud Sync & Multi-Device Backup
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Link your mobile number with instant 2FA authentication to keep your followed teams, alerts, and custom theme presets synchronized.
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Phone & SMS 2FA</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
