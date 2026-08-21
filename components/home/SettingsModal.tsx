"use client";

import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";

type SettingsModalProps = {
  open: boolean;
  speechTime: number;
  researchTime: number;
  onSave: (speechTime: number, researchTime: number) => void;
  onClose: () => void;
};

type TimeSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function TimeSlider({
  label,
  value,
  min,
  max,
  onChange,
}: TimeSliderProps) {
  return (
    <div className="w-full">
      {/* Label + value */}

      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.16em] text-white/55">
          {label}
        </span>

        <span className="text-sm font-medium tabular-nums text-[#ff6e42]">
          {value} min
        </span>
      </div>

      {/* Slider */}

      <div className="relative flex h-6 w-full items-center">
        {/* Invisible / subtle track */}

        <div className="absolute left-0 right-0 h-px bg-white/15" />

        {/* Native range */}

        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          className="
    relative
    z-10
    h-6
    w-full
    cursor-pointer
    appearance-none
    bg-transparent
    outline-none

    [&::-webkit-slider-runnable-track]:h-px
    [&::-webkit-slider-runnable-track]:bg-transparent

    [&::-webkit-slider-thumb]:mt-[-7px]
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-[#FF6E42]
    [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,206,66,0.12)]
    [&::-webkit-slider-thumb]:transition-transform
    [&::-webkit-slider-thumb]:duration-150
    hover:[&::-webkit-slider-thumb]:scale-110

    [&::-moz-range-track]:h-px
    [&::-moz-range-track]:bg-transparent

    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:border-0
    [&::-moz-range-thumb]:bg-[#FF6E42]
  "
        />
      </div>

      {/* Range hints */}

      <div className="mt-1 flex justify-between text-[10px] text-white/65">
        <span>{min} min</span>
        <span>{max} min</span>
      </div>
    </div>
  );
}

export default function SettingsModal({
  open,
  speechTime,
  researchTime,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [localSpeechTime, setLocalSpeechTime] =
    useState(speechTime);

  const [localResearchTime, setLocalResearchTime] =
    useState(researchTime);

  useEffect(() => {
    if (open) {
      setLocalSpeechTime(speechTime);
      setLocalResearchTime(researchTime);
    }
  }, [open, speechTime, researchTime]);

  if (!open) return null;

  function handleDone() {
    onSave(localSpeechTime, localResearchTime);
  }

  return (
    <div
      className="
    fixed
    inset-0
    z-[100]
    flex
    items-center
    justify-center
    px-4
    py-6
    sm:px-6
  "
    >
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/30"
      />

      {/* Modal */}

      <div
        className="
    relative
    z-10
    w-full
    max-w-md
    animate-settings-enter
    rounded-[26px]
    border
    border-white/[0.08]
    bg-black/20
    p-5
    shadow-2xl
    backdrop-blur-xl
    sm:p-7
  "
      >
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings
              size={18}
              className="text-white/65"
            />

            <h2 className="text-base font-bold text-white">
              Settings
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-white/35
              transition
              hover:bg-white/10
              hover:text-white/70
            "
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sliders */}

        <div className="space-y-8">
          <TimeSlider
            label="SPEECH"
            value={localSpeechTime}
            min={1}
            max={10}
            onChange={setLocalSpeechTime}
          />

          <TimeSlider
            label="RESEARCH"
            value={localResearchTime}
            min={1}
            max={60}
            onChange={setLocalResearchTime}
          />
        </div>

        {/* Save */}

        <div className="mt-9">
          <button
            type="button"
            onClick={handleDone}
            className="
              w-full
              rounded-full
              bg-white
              px-6
              py-3
              text-sm
              font-bold
              text-black
              transition
              hover:bg-white/90
              active:scale-[0.98]
            "
          >
            Done
          </button>

          <p className="mt-3 text-center text-[10px] text-white/65">
            We&apos;ll remember this next time.
          </p>
        </div>
      </div>
    </div>
  );
}