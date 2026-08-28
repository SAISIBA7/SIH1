'use client';

import React, { useState } from 'react';

interface VoiceButtonProps {
  textToRead: string;
  language?: string;
  className?: string;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToRead,
  language = 'or-IN',
  className = '',
  label = 'Listen in Odia (ଶୁଣନ୍ତୁ)',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 4000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer min-h-[44px] shadow-sm ${
        isPlaying
          ? 'bg-[#CFE362] text-[#1A1A1A] border border-[#b8ce4e] shadow-md'
          : 'bg-white/80 hover:bg-white text-[#1A1A1A] border border-gray-200 hover:border-gray-300'
      } ${className}`}
    >
      {isPlaying ? (
        <div className="flex items-center gap-1">
          <span className="w-1 h-3 bg-[#1A1A1A] animate-bounce rounded-full" />
          <span className="w-1 h-4 bg-[#1A1A1A] animate-bounce delay-75 rounded-full" />
          <span className="w-1 h-2 bg-[#1A1A1A] animate-bounce delay-150 rounded-full" />
        </div>
      ) : (
        <span className="text-base">🔊</span>
      )}
      <span>{isPlaying ? 'Playing Narration...' : label}</span>
    </button>
  );
};

export default VoiceButton;
