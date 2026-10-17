"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createUISFX } from "uisfx";

interface TopicDisplayProps {
  topic: string;
  finalTopic: string | null;
  topics: string[];
  isSpinning: boolean;
  isSoundMuted: boolean;
  onSpinComplete: () => void;
}

interface SpinAnimationProps {
  topic: string;
  finalTopic: string;
  topics: string[];
  isSoundMuted: boolean;
  onSpinComplete: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createSpinSequence(
  topics: string[],
  oldTopic: string,
  finalTopic: string,
): string[] {
  const available = topics.filter(
    (item) => item !== oldTopic && item !== finalTopic,
  );

  if (available.length === 0) {
    return [finalTopic];
  }

  const shuffled = shuffle(available);
  const randomCount = Math.min(shuffled.length, 20);
  const sequence = shuffled.slice(0, randomCount);

  sequence.push(finalTopic);

  return sequence;
}

const ui = createUISFX({
  pack: "minimal",
});

function SpinAnimation({
  topic,
  finalTopic,
  topics,
  isSoundMuted,
  onSpinComplete,
}: SpinAnimationProps) {
  const [displayTopic, setDisplayTopic] = useState(topic);

  const soundMutedRef = useRef(isSoundMuted);
  const onSpinCompleteRef = useRef(onSpinComplete);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    soundMutedRef.current = isSoundMuted;

    if (isSoundMuted && tickAudioRef.current) {
      tickAudioRef.current.pause();
      tickAudioRef.current.currentTime = 0;
    }
  }, [isSoundMuted]);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  useEffect(() => {
    const audio = new Audio("/ticking.mp3");
    audio.preload = "auto";
    audio.volume = 0.65;

    tickAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      tickAudioRef.current = null;
    };
  }, []);

  const playTick = useCallback(() => {
    if (soundMutedRef.current) return;

    const audio = tickAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, []);

  const stopTick = useCallback(() => {
    const audio = tickAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timeoutIds: number[] = [];

    const sequence = createSpinSequence(
      topics,
      topic,
      finalTopic,
    );

    const timings = sequence.map((_, index) => {
      const progress =
        index / Math.max(sequence.length - 1, 1);

      return Math.round(75 + progress ** 3 * 500);
    });

    let currentIndex = 0;

    const showNextTopic = () => {
      if (cancelled) return;

      const nextTopic = sequence[currentIndex];
      const isFinalTopic =
        currentIndex === sequence.length - 1;

      setDisplayTopic(nextTopic);
      playTick();

      if (isFinalTopic) {
        stopTick();

        if (!soundMutedRef.current) {
          ui.play("bonus");
        }

        if (!completedRef.current) {
          completedRef.current = true;
          onSpinCompleteRef.current();
        }

        return;
      }

      const timeout = window.setTimeout(() => {
        currentIndex++;
        showNextTopic();
      }, timings[currentIndex]);

      timeoutIds.push(timeout);
    };

    showNextTopic();

    return () => {
      cancelled = true;

      timeoutIds.forEach((timeout) => {
        window.clearTimeout(timeout);
      });

      stopTick();
    };
  }, [
    topic,
    finalTopic,
    topics,
    playTick,
    stopTick,
  ]);

  return (
    <p
      key={displayTopic}
      className="
        max-w-4xl
        text-center
        text-2xl
        font-bold
        leading-[1.15]
        tracking-tight
        text-white
        sm:text-4xl
        md:text-5xl
        lg:text-6xl
      "
    >
      {displayTopic}
    </p>
  );
}

export default function TopicDisplay({
  topic,
  finalTopic,
  topics,
  isSpinning,
  isSoundMuted,
  onSpinComplete,
}: TopicDisplayProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-3 text-sm tracking-wide text-white/45 sm:text-base">
        {isSpinning ? "Dealing..." : "Your topic"}
      </p>

      <div
        className="
          flex
          h-[180px]
          w-full
          max-w-5xl
          items-center
          justify-center
          overflow-hidden
          px-5
          sm:h-[190px]
          sm:px-6
        "
      >
        {isSpinning && finalTopic ? (
          <SpinAnimation
            key={`${topic}-${finalTopic}`}
            topic={topic}
            finalTopic={finalTopic}
            topics={topics}
            isSoundMuted={isSoundMuted}
            onSpinComplete={onSpinComplete}
          />
        ) : (
          <p
            className="
              max-w-4xl
              text-center
              text-2xl
              font-bold
              leading-[1.15]
              tracking-tight
              text-white
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            {topic}
          </p>
        )}
      </div>
    </div>
  );
}
