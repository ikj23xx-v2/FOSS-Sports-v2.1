import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { sounds } from '../services/sound';
import { Sparkles, Phone, ShieldCheck, KeyRound, Lock, ArrowRight, RotateCw, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleAction = () => {
    sounds.playTap();
    setErrorMsg(null);

    if (step === 'input') {
      if (authMode === 'phone') {
        const clean = phone.replace(/\D/g, '');
        if (clean.length < 10) {
          setErrorMsg('Please enter a valid 10-digit mobile phone number');
          return;
        }
      } else {
        if (!username.trim() || !password) {
          setErrorMsg('Please enter username and password');
          return;
        }
      }
      setStep('otp');
      setResendTimer(45);
    } else {
      if (code.trim().length < 4) {
        setErrorMsg('Please enter the 6-digit SMS verification code');
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '') || '5552345678';
      const formattedPhone = `+1 (${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 10)}`;

      const newUser: UserProfile = {
        uid: `usr_${Date.now()}`,
        displayName: username.trim() || 'Sports Fan',
        phoneNumber: formattedPhone,
        email: username.includes('@') ? username.trim() : undefined,
        is2FAEnabled: true,
        createdAt: Date.now(),
        syncStatus: 'synced',
      };

      try {
        localStorage.setItem('foss_user_auth', JSON.stringify(newUser));
        localStorage.setItem('foss_active_profile', JSON.stringify(newUser));
      } catch {
        // Ignore
      }

      sounds.playScore();
      onSuccess(newUser);
      onClose();
    }
  };

  const handleAutofillDemo = () => {
    sounds.playTap();
    setCode('729415');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div
        className="bg-[#161618] border border-[#2A2A2E] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-white font-extrabold text-xl mb-1 font-display">
          Sign In to FOSS Sports
        </h2>
        <p className="text-gray-400 text-xs mb-5">
          Link your phone number with SMS 2FA to sync favorites and themes.
        </p>

        {/* Tab Switcher if in input step */}
        {step === 'input' && (
          <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-[#2A2A2E] mb-4 text-xs font-semibold">
            <button
              onClick={() => {
                sounds.playTap();
                setAuthMode('phone');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                authMode === 'phone'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Phone SMS 2FA
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                setAuthMode('password');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Password + 2FA
            </button>
          </div>
        )}

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300 animate-fade-in">
            {errorMsg}
          </div>
        )}

        {step === 'input' ? (
          authMode === 'phone' ? (
            <div className="mb-4">
              <label className="text-gray-400 text-[11px] font-bold uppercase mb-1.5 block">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                  className="w-full bg-[#000000] border border-[#2A2A2E] rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-white font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-gray-400 text-[11px] font-bold uppercase mb-1 block">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="alex@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#000000] border border-[#2A2A2E] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[11px] font-bold uppercase mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#000000] border border-[#2A2A2E] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-white font-mono"
                />
              </div>
            </div>
          )
        ) : (
          <div className="mb-4 animate-fade-in">
            <label className="text-gray-400 text-[11px] font-bold uppercase mb-1.5 block">
              Enter 6-Digit SMS Code
            </label>
            <input
              type="text"
              placeholder="• • • • • •"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              className="w-full bg-[#000000] border border-[#2A2A2E] rounded-xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:border-white shadow-inner"
            />
            <div className="flex items-center justify-between gap-2 mt-2">
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Demo Code (729415)</span>
              </button>

              {resendTimer > 0 ? (
                <span className="text-[11px] font-mono text-gray-500">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setResendTimer(45)}
                  className="text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              sounds.playTap();
              if (step === 'otp') {
                setStep('input');
                setErrorMsg(null);
              } else {
                onClose();
              }
            }}
            className="flex-1 bg-[#1F1F23] hover:bg-zinc-700 text-gray-300 font-bold py-3 rounded-xl text-sm transition cursor-pointer"
          >
            {step === 'otp' ? 'Back' : 'Cancel'}
          </button>
          <button
            onClick={handleAction}
            className="flex-1 bg-white hover:bg-gray-200 text-black font-extrabold py-3 rounded-xl text-sm transition cursor-pointer shadow-sm active:scale-95"
          >
            {step === 'input' ? 'Send SMS Code' : 'Verify & Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
