"use client";

import { useEffect, useRef, useState } from "react";

interface TopicDisplayProps {
  topic: string;
  finalTopic: string | null;
  topics: string[];
  isSpinning: boolean;
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
  /*
   * Remove both the old topic and final topic.
   *
   * This is important:
   *
   * OLD TOPIC
   *    ↓
   * random topic
   *    ↓
   * random topic
   *    ↓
   * FINAL TOPIC
   *
   * We don't want the final topic appearing early.
   */

  const available = topics.filter(
    (item) => item !== oldTopic && item !== finalTopic,
  );

  if (available.length === 0) {
    return [finalTopic];
  }

  /*
   * Create a completely fresh shuffle for every spin.
   */

  const shuffled = shuffle(available);

  /*
   * We want enough visual changes to make the spinner feel
   * like it is actually dealing topics.
   *
   * Use at most 20 random topics.
   */

  const randomCount = Math.min(
    shuffled.length,
    20,
  );

  const sequence = shuffled.slice(0, randomCount);

  /*
   * The final topic is explicitly part of the animation.
   *
   * Therefore there is no sudden:
   *
   * random topic → new topic
   *
   * after the animation finishes.
   */

  sequence.push(finalTopic);

  return sequence;
}

export default function TopicDisplay({
  topic,
  finalTopic,
  topics,
  isSpinning,
  onSpinComplete,
}: TopicDisplayProps) {
  const [displayTopic, setDisplayTopic] =
    useState(topic);

  const previousSpinning = useRef(false);

  useEffect(() => {
    /*
     * When we're not spinning, simply show the current topic.
     */

    if (!isSpinning) {
      previousSpinning.current = false;
      setDisplayTopic(topic);
      return;
    }

    /*
     * Prevent this effect from starting twice for the
     * same spin.
     */

    if (previousSpinning.current) {
      return;
    }

    previousSpinning.current = true;

    if (!finalTopic || topics.length === 0) {
      setDisplayTopic(topic);
      previousSpinning.current = false;
      return;
    }

    let cancelled = false;

    const timeoutIds: number[] = [];

    /*
     * Create ONE random sequence for this spin.
     *
     * It is created only once.
     */

    const sequence = createSpinSequence(
      topics,
      topic,
      finalTopic,
    );

    /*
     * Fast → slow.
     *
     * Starts quickly and gradually slows down.
     */

    const timings = sequence.map((_, index) => {
      const progress =
        index / Math.max(sequence.length - 1, 1);

      /*
       * Cubic easing.
       *
       * 0 → fast
       * 1 → slow
       */

      const eased = progress ** 3;

      return Math.round(
        75 + eased * 500,
      );
    });

    let currentIndex = 0;

    const showNextTopic = () => {
      if (cancelled) return;

      if (currentIndex >= sequence.length) {
        /*
         * The final topic is already visible.
         *
         * Don't change the topic again.
         */

        const finishTimeout = window.setTimeout(() => {
          if (!cancelled) {
            onSpinComplete();
          }
        }, 500);

        timeoutIds.push(finishTimeout);

        return;
      }

      const nextTopic =
        sequence[currentIndex];

      setDisplayTopic(nextTopic);

      const delay =
        timings[currentIndex];

      currentIndex++;

      const timeout = window.setTimeout(
        showNextTopic,
        delay,
      );

      timeoutIds.push(timeout);
    };

    showNextTopic();

    return () => {
      cancelled = true;

      timeoutIds.forEach((timeout) => {
        window.clearTimeout(timeout);
      });
    };

    /*
     * VERY IMPORTANT:
     *
     * Do NOT put displayTopic in this dependency array.
     *
     * Changing displayTopic is part of the animation.
     * It must NOT restart the animation.
     */
  }, [
    isSpinning,
    finalTopic,
    topics,
    topic,
    onSpinComplete,
  ]);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-3 text-sm tracking-wide text-white/45 sm:text-base">
        {isSpinning
          ? "Dealing..."
          : "Your topic"}
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
      </div>
    </div>
  );
}