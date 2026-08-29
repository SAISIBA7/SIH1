"use client";

import React, { useState } from "react";
import Link from "next/link";

interface InsuranceHeaderProps {
  lang: "EN" | "HI" | "OR";
  onLangChange: (lang: "EN" | "HI" | "OR") => void;
  onBack?: () => void;
}

export const InsuranceHeader: React.FC<InsuranceHeaderProps> = ({
  lang,
  onLangChange,
  onBack,
}) => {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const toggleTTS = () => {
    setIsPlayingTTS((prev) => !prev);
    if (!isPlayingTTS && typeof window !== "undefined" && "speechSynthesis" in window) {
      const text =
        lang === "HI"
          ? "फसल बीमा। संकट से होने वाले नुकसान से आपकी फसल की सुरक्षा।"
          : lang === "OR"
          ? "ଫସଲ ବୀମା। କ୍ଷୟକ୍ଷତିରୁ ଆପଣଙ୍କ ଫସଲର ସୁରକ୍ଷା।"
          : "Crop Insurance. Protecting your crop against distress-related loss.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <header className="w-full sticky top-0 z-30 px-3 sm:px-6 py-3 transition-all select-none">
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-md px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 text-gray-900">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-gray-100/90 hover:bg-gray-200/90 text-gray-700 text-xs font-semibold tracking-wide transition active:scale-95 flex items-center gap-1 border border-gray-200"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-gray-100/90 hover:bg-gray-200/90 text-gray-700 text-xs font-semibold tracking-wide transition active:scale-95 flex items-center gap-1 border border-gray-200"
            >
              <span>←</span>
              <span>Back</span>
            </Link>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
              🛡️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-emerald-950 tracking-tight leading-tight">
                Crop Insurance
              </h1>
              <p className="text-[11px] text-emerald-800/80 hidden sm:block">
                Protecting your crop against distress‑related loss
              </p>
            </div>
          </div>
        </div>

        {/* Right: Audio TTS & Language selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TTS Audio affordance per PRD §18 */}
          <button
            onClick={toggleTTS}
            title="Read out page content"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
              isPlayingTTS
                ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                : "bg-gray-100/90 hover:bg-gray-200/90 text-gray-700 border-gray-200"
            }`}
          >
            <span>{isPlayingTTS ? "🔊 Playing" : "🔊 Listen"}</span>
          </button>

          {/* Multilingual Selector per PRD §17 */}
          <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200 text-[11px] font-semibold">
            {(["EN", "HI", "OR"] as const).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`px-2 py-1 rounded-lg transition ${
                  lang === l
                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {l === "EN" ? "EN" : l === "HI" ? "हिंदी" : "ଓଡ଼ିଆ"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
