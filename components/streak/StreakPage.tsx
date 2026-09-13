"use client";

import Link from "next/link";

type DayData = {
  label: string;
  date: string;
  practiced: boolean;
  isToday: boolean;
  isFuture: boolean;
};

type StreakPageProps = {
  currentStreak: number;
  longestStreak: number;
  practicedToday: boolean;
  week: DayData[];
};

export default function StreakPage({
  currentStreak,
  longestStreak,
  practicedToday,
  week,
}: StreakPageProps) {
  return (
    <section className="flex min-h-0 w-full flex-1 items-center justify-center px-5 py-4">
      <div className="w-full max-w-3xl text-center">
        {/* Main streak */}
        <div>
          <div
            className={`
              text-6xl
              leading-none
              sm:text-7xl
              ${currentStreak > 0 ? "opacity-100" : "opacity-45"}
            `}
          >
            🔥
          </div>

          <div className="mt-5">
            <div className="text-7xl font-semibold tracking-tight text-white sm:text-8xl">
              {currentStreak}
            </div>

            <div className="mt-2 text-sm font-medium tracking-[0.2em] text-white/50">
              DAY STREAK
            </div>
          </div>

          {/* Practice message */}
          <div className="mt-5">
            {currentStreak === 0 ? (
              <>
                <p className="text-base font-medium text-white/90">
                  No streak yet.
                </p>

                <p className="mt-1 text-sm text-white/45">
                  Start your streak today.
                </p>

                <Link
                  href="/"
                  className="
                    mt-3
                    inline-block
                    text-sm
                    font-medium
                    text-white/65
                    underline
                    underline-offset-4
                    transition-colors
                    hover:text-white
                  "
                >
                  Practice now →
                </Link>
              </>
            ) : practicedToday ? (
              <>
                <p className="text-base font-medium text-white/90">
                  You&apos;ve practiced today.
                </p>

                <p className="mt-1 text-sm text-white/45">
                  Come back tomorrow to keep your streak alive.
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-medium text-white/90">
                  Practice today to keep your streak alive.
                </p>

                <Link
                  href="/"
                  className="
                    mt-3
                    inline-block
                    text-sm
                    font-medium
                    text-white/65
                    underline
                    underline-offset-4
                    transition-colors
                    hover:text-white
                  "
                >
                  Practice now →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* This Week */}
        <div className="mt-8 w-full">
          <p className="mb-6 text-center text-xs font-medium tracking-[0.2em] text-white/40">
            THIS WEEK
          </p>

          <div
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black/15
              px-4
              py-5
              backdrop-blur-sm
              sm:px-8
            "
          >
            <div className="grid grid-cols-7 gap-1 sm:gap-4">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="flex min-w-0 flex-col items-center"
                >
                  {/* Day */}
                  <span
                    className={`
                      text-[10px]
                      font-medium
                      tracking-wide
                      sm:text-[11px]
                      ${day.isToday ? "text-white/90" : "text-white/40"}
                    `}
                  >
                    {day.label}
                  </span>

                  {/* Independent circle */}
                  <div
                    className={`
                      mt-3
    flex
    h-9
    w-9
    shrink-0
    items-center
    justify-center
    rounded-full
    sm:h-11
    sm:w-11
                      border
                      transition-all
                      duration-300
                      ${
                        day.practiced
                          ? "border-white/20 bg-white/10"
                          : day.isFuture
                            ? "border-white/10 bg-black/10"
                            : "border-white/20 bg-transparent"
                      }
                      ${
                        day.isToday
                          ? "ring-1 ring-white/30 ring-offset-2 ring-offset-transparent"
                          : ""
                      }
                    `}
                  >
                    {day.practiced && (
                      <span className="text-base leading-none sm:text-lg">🔥</span>
                    )}
                  </div>

                  {/* Date */}
                  <span
                    className={`
                      mt-3
                      text-[11px]
                      ${
                        day.isToday
                          ? "font-medium text-white/80"
                          : "text-white/30"
                      }
                    `}
                  >
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Longest streak */}
        <div className="mt-17">
          <p className="text-xs font-medium tracking-[0.2em] text-white/35">
            LONGEST STREAK
          </p>

          <p className="mt-2 text-xl font-medium text-white/80">
            {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>
    </section>
  );
}
