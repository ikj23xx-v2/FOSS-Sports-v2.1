import React, { useState, useEffect } from 'react';
import { X, Check, Send, ThumbsUp, Sparkles, MessageSquarePlus } from 'lucide-react';
import { sounds } from '../services/sound';

interface SportFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StoredVote {
  id: string;
  sport: string;
  timestamp: number;
}

const POPULAR_SUGGESTIONS = [
  'UFC / MMA',
  'NASCAR',
  'PGA Tour',
  'Tennis (ATP/WTA)',
  'Cricket (IPL)',
  'IndyCar',
];

export const SportFeedbackModal: React.FC<SportFeedbackModalProps> = ({ isOpen, onClose }) => {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [submittedVotes, setSubmittedVotes] = useState<StoredVote[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('foss_sport_requests');
      if (saved) {
        setSubmittedVotes(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const vote = customInput.trim() || selectedChip;
    if (!vote) return;

    sounds.playTap();
    if (navigator.vibrate) {
      navigator.vibrate([20, 30]);
    }

    const newVote: StoredVote = {
      id: `vote-${Date.now()}`,
      sport: vote,
      timestamp: Date.now(),
    };

    const updated = [newVote, ...submittedVotes.filter((v) => v.sport !== vote)];
    setSubmittedVotes(updated);

    try {
      localStorage.setItem('foss_sport_requests', JSON.stringify(updated));
      localStorage.setItem(`last_requested_sport_${Date.now()}`, vote);
    } catch {
      // Ignore
    }

    setToastMessage(`Thanks! Request for '${vote}' logged.`);
    setCustomInput('');
    setSelectedChip(null);

    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#161618] border border-[#2A2A2E] rounded-[24px] p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <MessageSquarePlus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-extrabold text-white font-display tracking-tight">
                Request a Sport or League
              </h2>
            </div>
            <p className="text-xs text-[#8E8E93] mt-1.5 leading-snug">
              Vote for sports you want added next to FOSS Sports:
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Close request dialog"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick-Vote Suggestion Pills */}
        <div className="mb-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-2 font-bold">
            Popular Requests
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((sport) => {
              const isSelected = selectedChip === sport && !customInput;
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setSelectedChip(sport);
                    setCustomInput('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-[#1F1F23] text-neutral-300 border-[#2A2A2E] hover:border-neutral-500 hover:text-white'
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Field */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1.5 font-bold">
              Other Sport or League
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (e.target.value) {
                  setSelectedChip(null);
                }
              }}
              placeholder="Or type other league name (e.g. Rugby, IndyCar)..."
              className="w-full bg-[#1F1F23] text-white placeholder-[#636366] text-sm font-medium px-3.5 py-2.5 rounded-xl border border-[#2A2A2E] focus:outline-none focus:border-white transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customInput.trim() && !selectedChip}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>

        {/* Previously submitted requests list if available */}
        {submittedVotes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#2A2A2E]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#636366] mb-1.5">
              Your Logged Requests ({submittedVotes.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {submittedVotes.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300 font-medium"
                >
                  <Check className="w-3 h-3 text-[#30D158]" />
                  {v.sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="absolute inset-x-6 bottom-4 p-3 rounded-xl bg-[#30D158] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg animate-bounce">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
