"use client";

import { modes, type Mode } from "../../data/topics";

type ModeSelectorProps = {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function ModeSelector({
  selectedMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="w-full max-w-3xl">
      <div
        className="
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-4
          sm:gap-0
        "
      >
        {modes.map((mode) => {
          const active = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              className={`
                relative
                flex
                h-11
                w-full
                items-center
                justify-center
                whitespace-nowrap
                rounded-full
                px-3
                text-sm
                transition-all
                duration-200

                sm:rounded-none
                sm:px-2
                sm:text-base

                ${
                  active
                    ? "font-bold text-white"
                    : "font-normal text-white/40 hover:text-white/75"
                }
              `}
            >
              {mode.label}

              {active && (
                <span
                  className="
                    absolute
                    bottom-0.5
                    left-1/2
                    h-1
                    w-1
                    -translate-x-1/2
                    rounded-full
                    bg-white
                    sm:bottom-0
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}