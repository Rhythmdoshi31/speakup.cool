"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
  mode: string;
  category: string;
  speechTime: number;
  debateSide: DebateSide;
  isDebate: boolean;
  onExit: () => void;
  onSessionComplete?: () => void;
  onStartSpeech?: () => void;
  onExtendResearch?: () => void;
  researchExtension?: number;
  isSoundMuted: boolean;
};

type AuthResponse = {
  authenticated: boolean;
};

export default function TimerScreen({
  topic,
  initialTime,
  type,
  mode,
  category,
  speechTime,
  debateSide,
  isDebate,
  onExit,
  onSessionComplete,
  onStartSpeech,
  onExtendResearch,
  researchExtension,
  isSoundMuted,
}: TimerScreenProps) {
  const duration = initialTime ?? 60;

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [guestCompletion, setGuestCompletion] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(duration * 1000);

  const timerAudio = useRef<HTMLAudioElement | null>(null);
  const sessionSavedRef = useRef(false);
  const completionCheckedRef = useRef(false);

  /*
   * TIMER SOUND
   */
  useEffect(() => {
    timerAudio.current = new Audio("/timer.mp3");
    timerAudio.current.preload = "auto";

    return () => {
      timerAudio.current?.pause();
      timerAudio.current = null;
    };
  }, []);

  useEffect(() => {
    if (timeLeft !== 0 || isSoundMuted) return;

    const audio = timerAudio.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {
      // Browser blocked audio playback.
    });
  }, [timeLeft, isSoundMuted]);

  /*
   * RESET TIMER WHEN TOPIC / TIMER CHANGES
   */
  useEffect(() => {
    const duration = initialTime ?? 60;
    const durationMs = duration * 1000;

    setTimeLeft(duration);
    setIsPaused(false);
    setGuestCompletion(false);

    pausedTimeRef.current = durationMs;
    endTimeRef.current = Date.now() + durationMs;

    sessionSavedRef.current = false;
    completionCheckedRef.current = false;
  }, [initialTime, type, researchExtension]);

  /*
   * TIMER
   */
  useEffect(() => {
    if (isPaused) return;

    const updateTimer = () => {
      if (endTimeRef.current === null) return;

      const remainingMs = Math.max(
        0,
        endTimeRef.current - Date.now(),
      );

      const remainingSeconds = Math.ceil(
        remainingMs / 1000,
      );

      setTimeLeft(remainingSeconds);

      if (remainingMs <= 0) {
        setTimeLeft(0);
        setIsPaused(true);
        endTimeRef.current = null;
      }
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      100,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused]);

  /*
   * HANDLE COMPLETED SPEECH SESSION
   *
   * Logged in:
   *   Save session to database.
   *
   * Logged out:
   *   Do not save anything.
   *   Show guest streak popup instead.
   */
  useEffect(() => {
    if (type !== "speech") return;
    if (timeLeft !== 0) return;
    if (completionCheckedRef.current) return;

    completionCheckedRef.current = true;

    async function handleCompletion() {
      try {
        const authResponse = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          },
        );

        /*
         * If auth check fails, treat the user as a guest
         * rather than attempting to save the session.
         */
        if (!authResponse.ok) {
          setGuestCompletion(true);
          return;
        }

        const authData: AuthResponse =
          await authResponse.json();

        /*
         * GUEST
         */
        if (!authData.authenticated) {
          setGuestCompletion(true);
          return;
        }

        /*
         * LOGGED-IN USER
         */
        if (sessionSavedRef.current) return;

        sessionSavedRef.current = true;

        const response = await fetch(
          "/api/practice",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic,
              mode,
              category,
              durationSeconds: speechTime * 60,
              debateSide: isDebate
                ? debateSide
                : null,
            }),
          },
        );

        if (!response.ok) {
          console.error(
            "Failed to save practice session",
          );

          sessionSavedRef.current = false;
          completionCheckedRef.current = false;

          return;
        }

        console.log("Practice session saved");

        onSessionComplete?.();
      } catch (error) {
        console.error(
          "Error handling completed practice session:",
          error,
        );

        sessionSavedRef.current = false;
        completionCheckedRef.current = false;
      }
    }

    handleCompletion();
  }, [
    timeLeft,
    type,
    topic,
    mode,
    category,
    speechTime,
    debateSide,
    isDebate,
    onSessionComplete,
  ]);

  /*
   * PAUSE / PLAY
   */
  function togglePause() {
    if (timeLeft <= 0) return;

    if (!isPaused) {
      const remainingMs = Math.max(
        0,
        (endTimeRef.current ?? Date.now()) -
          Date.now(),
      );

      pausedTimeRef.current = remainingMs;
      endTimeRef.current = null;

      setIsPaused(true);
      return;
    }

    endTimeRef.current =
      Date.now() + pausedTimeRef.current;

    setIsPaused(false);
  }

  /*
   * RESET
   */
  function resetTimer() {
    const duration = initialTime ?? 60;
    const durationMs = duration * 1000;

    pausedTimeRef.current = durationMs;
    endTimeRef.current = Date.now() + durationMs;

    setTimeLeft(duration);
    setGuestCompletion(false);

    sessionSavedRef.current = false;
    completionCheckedRef.current = false;

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
   * RESEARCH COMPLETION SCREEN
   */
  if (type === "research" && isFinished) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black/10 px-6 pt-24">
        <div className="flex w-full max-w-6xl animate-timer-enter flex-col items-center text-center">
          <div className="select-none text-[clamp(5rem,16vw,10rem)] font-bold leading-none tracking-[-0.06em] text-white tabular-nums">
            00:00
          </div>

          <p className="mt-8 text-xl font-medium text-white/70 sm:text-2xl">
            Research Done
          </p>

          <div className="mt-6 flex items-end justify-center gap-3">
            <div className="flex flex-col items-center">
              <p className="mb-2 text-xs text-transparent">
                Need more time?
              </p>

              <button
                type="button"
                onClick={onStartSpeech}
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
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-2 text-xs text-white/40">
                Need more time?
              </p>

              <button
                type="button"
                onClick={onExtendResearch}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.07]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white/80
                  transition-all
                  duration-200
                  hover:border-white/20
                  hover:bg-white/[0.12]
                  hover:text-white
                  active:scale-[0.97]
                "
              >
                <RotateCcw size={15} />
                Extend 1 min
              </button>
            </div>
          </div>

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

  /*
   * NORMAL TIMER
   *
   * Guest completion appears as a popup ON TOP
   * of this timer instead of replacing the screen.
   */
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black/10 px-6 pt-24">
      {/* =========================================================
          GUEST STREAK POPUP
          ========================================================= */}
      {type === "speech" &&
        isFinished &&
        guestCompletion && (
          <div className="absolute inset-x-0 bottom-0 top-24 z-50 flex items-center justify-center bg-black/35 px-5 backdrop-blur-[2px]">
            <div
              className="
                w-full
                max-w-md
                animate-timer-enter
                rounded-3xl
                border
                border-white/15
                bg-[#111111]/95
                px-7
                py-8
                text-center
                shadow-2xl
                shadow-black/30
              "
            >
              {/* FIRE */}
              <div className="text-5xl leading-none">
                🔥
              </div>

              {/* STREAK */}
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black tracking-tight text-white">
                  1
                </span>

                <span className="text-base font-bold tracking-[0.14em] text-white/70">
                  DAY STREAK
                </span>
              </div>

              {/* MESSAGE */}
              <p className="mt-4 text-base font-medium text-white/85">
                You did it! Your streak starts today.
              </p>

              <p className="mt-2 text-sm leading-5 text-white/50">
                Log in or create an account to save
                your streak and keep it going tomorrow.
              </p>

              {/* ACTIONS */}
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/auth/login"
                  className="
                    flex
                    items-center
                    justify-center
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
                    hover:-translate-y-0.5
                    hover:bg-white/90
                    active:scale-[0.97]
                  "
                >
                  Login to keep my streak
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/auth/signup"
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.06]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white/75
                    transition-all
                    duration-200
                    hover:border-white/25
                    hover:bg-white/[0.1]
                    hover:text-white
                    active:scale-[0.97]
                  "
                >
                  Sign up
                </Link>
              </div>

              {/* EXIT */}
              <button
                type="button"
                onClick={onExit}
                className="
                  mt-5
                  text-xs
                  font-medium
                  text-white/40
                  transition
                  hover:text-white/70
                "
              >
                Exit timer
              </button>
            </div>
          </div>
        )}

      {/* =========================================================
          MAIN TIMER
          ========================================================= */}
      <div className="flex w-full max-w-6xl animate-timer-enter flex-col items-center text-center">
        {/* TOPIC */}
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
            text-[#f9f9f9]
            sm:text-2xl
            md:text-3xl
            lg:text-4xl
          "
          title={topic}
        >
          {topic}
        </p>

        {/* TIMER */}
        <div className="select-none text-[clamp(5rem,16vw,10rem)] font-bold leading-none tracking-[-0.06em] text-white tabular-nums">
          {formattedTime}
        </div>

        {/* STATUS */}
        <p className="mt-7 text-base font-medium tracking-wide text-white/55 sm:text-lg">
          {isFinished
            ? "Time's up"
            : type === "research"
              ? "Research"
              : isDebate
                ? `Speaking ${
                    debateSide === "for"
                      ? "for"
                      : "against"
                  } the topic`
                : "Speak"}
        </p>

        {/* CONTROLS */}
        <div className="mt-9 flex items-center gap-3">
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

        {/* EXIT */}
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