"use client";

import { Settings, ArrowRight } from "lucide-react";
import type { Mode } from "../../data/topics";

type ActionButtonsProps = {
  selectedMode: Mode;
  speechTime: number;
  researchTime: number;
  onStartTimer: () => void;
  onStartResearch: () => void;
  onSettings: () => void;
};

export default function ActionButtons({
  selectedMode,
  speechTime,
  researchTime,
  onStartTimer,
  onStartResearch,
  onSettings,
}: ActionButtonsProps) {
  const isOffTheCuff = selectedMode === "offTheCuff";

  return (
    <div
      className="
        mt-6
        flex
        w-full
        max-w-xl
        flex-wrap
        items-center
        justify-center
        gap-2
        px-2
        sm:flex-nowrap
        sm:px-0
      "
    >
      {/* Speech */}

      <button
        type="button"
        onClick={onStartTimer}
        className="
          flex
          h-11
          flex-1
          items-center
          justify-center
          whitespace-nowrap
          rounded-full
          bg-white
          px-4
          text-xs
          font-bold
          text-black
          shadow-lg
          shadow-black/10
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-white/90
          active:scale-[0.97]
          sm:flex-none
          sm:px-5
          sm:text-sm
        "
      >
        Start {speechTime} min
      </button>

      {/* Research */}

      {!isOffTheCuff && (
        <button
          type="button"
          onClick={onStartResearch}
          className="
            flex
            h-11
            flex-1
            items-center
            justify-center
            whitespace-nowrap
            rounded-full
            bg-white
            px-4
            text-xs
            font-bold
            text-black
            shadow-lg
            shadow-black/10
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-white/90
            active:scale-[0.97]
            sm:flex-none
            sm:px-5
            sm:text-sm
          "
        >
          Start {researchTime} min research
        </button>
      )}

      {/* Settings */}

      <button
        type="button"
        onClick={onSettings}
        aria-label="Settings"
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/10
          text-white/65
          transition-all
          duration-200
          hover:bg-white/15
          hover:text-white
          active:scale-[0.97]
        "
      >
        <Settings size={18} />
      </button>
    </div>
  );
}