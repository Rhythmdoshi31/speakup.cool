"use client";

import { useEffect, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  X,
  ArrowRight,
} from "lucide-react";

type TimerType = "speech" | "research";

type DebateSide = "for" | "against";

type TimerScreenProps = {
  topic: string;
  initialTime?: number;
  type: "speech" | "research";
  speechTime: number;
  debateSide: DebateSide;
  isDebate: boolean;
  onExit: () => void;
  onStartSpeech?: () => void;
};

export default function TimerScreen({
  topic,
  initialTime,
  type,
  speechTime,
  debateSide,
  isDebate,
  onExit,
  onStartSpeech,
}: TimerScreenProps) {

  const [timeLeft, setTimeLeft] = useState(initialTime ?? 60);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime ?? 60);
    setIsPaused(false);
  }, [initialTime, type]);

  /*
   * Research starts immediately.
   * Speech also starts immediately when we enter it.
   */
  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsPaused(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, timeLeft]);

  function togglePause() {
    if (timeLeft <= 0) return;

    setIsPaused((previous) => !previous);
  }

  function resetTimer() {
    setTimeLeft(initialTime ?? 60);

    // Reset always pauses.
    setIsPaused(true);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

  const isFinished = timeLeft === 0;

  /*
   * Research completion screen
   */
  if (type === "research" && isFinished) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 px-6 pt-24">
        <div className="flex w-full max-w-6xl animate-timer-enter flex-col items-center text-center">

          {/* Timer */}

          <div className="select-none text-[clamp(5rem,16vw,10rem)] font-bold leading-none tracking-[-0.06em] text-white tabular-nums">
            00:00
          </div>

          {/* Research done */}

          <p className="mt-8 text-xl font-medium text-white/70 sm:text-2xl">
            Research Done
          </p>

          {/* Next */}

          <p className="mt-12 text-sm text-white/45">
            Up next: {speechTime} min to speak
          </p>

          {/* Continue */}

          <button
            type="button"
            onClick={onStartSpeech}
            className="
              mt-4
              flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-6
              py-3
              text-sm
              font-bold
              text-black
              shadow-lg
              shadow-black/10
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-white/90
              active:scale-[0.97]
            "
          >
            Ready to speak

            <ArrowRight size={16} />
          </button>

          {/* Exit */}

          <button
            type="button"
            onClick={onExit}
            className="
              group
              mt-9
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2
              text-xs
              font-medium
              text-white/45
              transition-all
              duration-200
              hover:border-white/20
              hover:bg-white/[0.08]
              hover:text-white/75
            "
          >
            <X
              size={13}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            Exit timer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 px-6 pt-24">
      <div className="flex w-full max-w-6xl animate-timer-enter flex-col items-center text-center">

        {/* Topic */}

        <p
          className="
    mb-8
    w-full
    max-w-5xl
    px-4
    text-xl
    font-medium
    leading-tight
    tracking-tight
    text-white/70
    sm:text-2xl
    md:text-3xl
    lg:text-4xl
  "
          title={topic}
        >
          {topic}
        </p>

        {/* Timer */}

        <div className="select-none text-[clamp(5rem,16vw,10rem)] font-bold leading-none tracking-[-0.06em] text-white tabular-nums">
          {formattedTime}
        </div>

        {/* Timer type */}

        <p className="mt-7 text-base font-medium tracking-wide text-white/55 sm:text-lg">
          {isFinished
            ? "Time's up"
            : type === "research"
              ? "Research"
              : isDebate
                ? `Speaking ${debateSide === "for" ? "for" : "against"} the topic`
                : "Speak"}
        </p>

        {/* Controls */}

        <div className="mt-9 flex items-center gap-3">

          {/* Play / Pause */}

          <button
            type="button"
            onClick={togglePause}
            disabled={timeLeft === 0}
            className="
    flex
    items-center
    gap-2
    rounded-full
    bg-white
    px-6
    py-3
    text-sm
    font-bold
    text-black
    transition-all
    duration-200
    hover:scale-[1.03]
    hover:bg-white/90
    active:scale-[0.97]
    disabled:cursor-not-allowed
    disabled:opacity-40
    disabled:hover:scale-100
  "
          >
            {isPaused ? (
              <Play
                size={15}
                fill="currentColor"
              />
            ) : (
              <Pause
                size={15}
                fill="currentColor"
              />
            )}

            {isPaused ? "Play" : "Pause"}
          </button>

          {/* Reset */}

          <button
            type="button"
            onClick={resetTimer}
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-6
              py-3
              text-sm
              font-bold
              text-white/85
              transition-all
              duration-200
              hover:bg-white/15
              hover:text-white
              active:scale-[0.97]
            "
          >
            <RotateCcw size={15} />

            Reset
          </button>
        </div>

        {/* Exit */}

        <button
          type="button"
          onClick={onExit}
          className="
            group
            mt-9
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-4
            py-2
            text-xs
            font-medium
            text-white/45
            transition-all
            duration-200
            hover:border-white/20
            hover:bg-white/[0.08]
            hover:text-white/75
          "
        >
          <X
            size={13}
            className="transition-transform duration-200 group-hover:rotate-90"
          />

          Exit timer
        </button>
      </div>
    </div>
  );
}