"use client";

import { useMemo } from "react";

type Session = {
  id: string;
  topic: string;
  mode: string;
  category: string;
  durationSeconds: number;
  debateSide: string | null;
  completedAt: string;
};

type LeaderboardEntry = {
  userId: string;
  name: string;
  streak: number;
  rank: number;
};

type ProfilePageProps = {
  name: string | null;
  email: string;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalSpeakingSeconds: number;
  sessions: Session[];
  leaderboard: LeaderboardEntry[];
  currentUserRank: number;
  currentUserId: string;
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  if (minutes < 1) return `${seconds}s`;

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string | null, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return parts[0][0].toUpperCase();
  }

  return email[0]?.toUpperCase() ?? "U";
}

function getStreakMessage(streak: number) {
  if (streak === 0) {
    return "Start today and begin your streak.";
  }

  if (streak === 1) {
    return "Great start. Come back tomorrow to keep it alive.";
  }

  if (streak < 7) {
    return "You're building momentum. Keep showing up.";
  }

  if (streak < 30) {
    return "You're on a roll. Don't break the streak now.";
  }

  return "Incredible consistency. Keep the streak alive.";
}

export default function ProfilePage({
  name,
  email,
  currentStreak,
  longestStreak,
  totalSessions,
  totalSpeakingSeconds,
  sessions,
  leaderboard,
  currentUserRank,
  currentUserId,
}: ProfilePageProps) {
  const displayName = name?.trim() || "Speaker";

  const visibleLeaderboard = useMemo(() => {
    const topFive = leaderboard.slice(0, 5);

    const currentUser = leaderboard.find(
      (entry) => entry.userId === currentUserId,
    );

    const alreadyVisible = topFive.some(
      (entry) => entry.userId === currentUserId,
    );

    return {
      topFive,
      currentUser: alreadyVisible || !currentUser ? null : currentUser,
    };
  }, [leaderboard, currentUserId]);

  return (
    <section
      className="
        flex
    w-full
    max-w-[1000px]
    flex-col
    px-4
    py-4
    sm:px-5
    sm:py-5
    md:h-full
    md:min-h-0
      "
    >
      {/* =========================================================
          PROFILE HEADER
          ========================================================= */}
      <div
        className="
          mb-4
          flex
          shrink-0
          flex-wrap
          items-center
          justify-between
          gap-4
          sm:mb-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-white/[0.08]
              text-sm
              font-bold
              text-white
              sm:h-12
              sm:w-12
              sm:text-base
            "
          >
            {getInitials(name, email)}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">
              {displayName}
            </h1>

            <p className="mt-0.5 truncate text-xs text-white/65 sm:mt-1 sm:text-sm">
              {email}
            </p>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="
              rounded-xl
              border
              border-white/15
              bg-white/[0.06]
              px-3.5
              py-2
              text-xs
              font-semibold
              text-white/70
              transition
              hover:border-white/25
              hover:bg-white/[0.1]
              hover:text-white
              sm:px-4
              sm:text-sm
            "
          >
            Logout
          </button>
        </form>
      </div>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div
        className="
          flex
    flex-col
    md:min-h-0
    md:flex-1
        "
      >
        {/* =======================================================
            TOP AREA
            Desktop:
              LEFT 70% | RIGHT 30%

            Mobile:
              LEFT
              LEADERBOARD
            ======================================================= */}
        <div
          className="
            flex
    flex-col
    gap-4
    md:shrink-0
    lg:flex-row
          "
        >
          {/* =====================================================
              LEFT SIDE
              ===================================================== */}
          <div className="min-w-0 flex-1 lg:flex-[7]">
            {/* CURRENT STREAK */}
            <div
              className="
                mb-3
                rounded-2xl
                border
                border-white/15
                bg-white/[0.06]
                px-4
                py-6
                sm:px-5
                sm:py-7
                lg:py-8
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none sm:text-4xl">🔥</span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {currentStreak}
                    </span>

                    <span className="text-xs font-bold tracking-[0.12em] text-white/75 sm:text-sm">
                      DAY STREAK
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs leading-5 text-white/70 sm:mt-2 sm:text-sm">
                    {getStreakMessage(currentStreak)}
                  </p>
                </div>
              </div>
            </div>

            {/* THREE STAT CARDS */}
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
              "
            >
              {/* LONGEST */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-5
                  sm:py-6
                  lg:py-7
                "
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/65 sm:text-sm">
                  Longest Streak
                </p>

                <p className="mt-2 text-xl font-black tabular-nums text-white sm:mt-3 sm:text-2xl">
                  {longestStreak}
                </p>

                <p className="mt-1 text-xs text-white/55 sm:text-sm">days</p>
              </div>

              {/* SESSIONS */}
              <div
                className="
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-5
                  sm:py-6
                  lg:py-7
                "
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/65 sm:text-sm">
                  Sessions
                </p>

                <p className="mt-2 text-xl font-black tabular-nums text-white sm:mt-3 sm:text-2xl">
                  {totalSessions}
                </p>

                <p className="mt-1 text-xs text-white/55 sm:text-sm">
                  completed
                </p>
              </div>

              {/* TIME */}
              <div
                className="
                  col-span-2
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-5
                  sm:col-span-1
                  sm:py-6
                  lg:py-7
                "
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/65 sm:text-sm">
                  Time Spoken
                </p>

                <p className="mt-2 text-xl font-black tabular-nums text-white sm:mt-3 sm:text-2xl">
                  {formatDuration(totalSpeakingSeconds)}
                </p>

                <p className="mt-1 text-xs text-white/55 sm:text-sm">
                  total practice
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              LEADERBOARD
              ===================================================== */}
          <div
            className="
              min-w-0
              flex-1
              rounded-2xl
              border
              border-white/15
              bg-white/[0.05]
              px-4
              py-5
              sm:px-5
              sm:py-6
              lg:flex-[3]
              lg:py-8
            "
          >
            <div className="mb-3 sm:mb-4">
              <h2 className="text-sm font-bold text-white sm:text-base">
                Streak Leaderboard
              </h2>

              <p className="mt-1 text-xs text-white/55 sm:text-sm">
                Keep pushing yourself.
              </p>
            </div>

            <div className="space-y-1">
              {visibleLeaderboard.topFive.map((entry) => {
                const isYou = entry.userId === currentUserId;

                return (
                  <div
                    key={entry.userId}
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-2
                      py-2
                      sm:px-2.5
                      sm:py-2.5
                      ${isYou ? "bg-white/[0.09]" : ""}
                    `}
                  >
                    <div className="flex w-6 shrink-0 justify-center text-sm sm:w-7 sm:text-base">
                      {entry.rank === 1 ? (
                        "🥇"
                      ) : entry.rank === 2 ? (
                        "🥈"
                      ) : entry.rank === 3 ? (
                        "🥉"
                      ) : (
                        <span className="text-xs font-bold text-white/55 sm:text-sm">
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    <p
                      className={`
                        min-w-0
                        flex-1
                        truncate
                        text-xs
                        font-semibold
                        sm:text-sm
                        ${isYou ? "text-white" : "text-white/80"}
                      `}
                    >
                      {isYou ? "You" : entry.name}
                    </p>

                    <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/80 sm:text-sm">
                      <span>🔥</span>
                      <span>{entry.streak}</span>
                    </div>
                  </div>
                );
              })}

              {visibleLeaderboard.currentUser && (
                <>
                  <div className="py-1 text-center text-[10px] tracking-[0.3em] text-white/35">
                    • • •
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-white/[0.09] px-2 py-2 sm:px-2.5 sm:py-2.5">
                    <div className="flex w-6 shrink-0 justify-center text-xs font-bold text-white/60 sm:w-7 sm:text-sm">
                      {currentUserRank}
                    </div>

                    <p className="min-w-0 flex-1 truncate text-xs font-bold text-white sm:text-sm">
                      You
                    </p>

                    <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-white/85 sm:text-sm">
                      <span>🔥</span>
                      <span>{visibleLeaderboard.currentUser.streak}</span>
                    </div>
                  </div>

                  <div className="py-1 text-center text-[10px] tracking-[0.3em] text-white/35">
                    • • •
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* =======================================================
            RECENT PRACTICE

            This is the ONLY scrolling area.
            ======================================================= */}
        <div
          className="
            mt-5
    flex
    flex-col
    md:min-h-0
    md:flex-1
          "
        >
          {/* HEADER */}
          <div className="mb-2.5 flex shrink-0 items-center justify-between gap-3 sm:mb-3">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Recent Practice
            </h2>

            <span className="shrink-0 text-xs font-semibold text-white/60 sm:text-sm">
              {sessions.length} recent sessions
            </span>
          </div>

          {/* SCROLLING LIST */}
          <div className="pr-1
    md:min-h-0
    md:flex-1
    md:overflow-y-auto
    md:overscroll-contain">
            {sessions.length === 0 ? (
              <div className="flex h-full min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 text-center text-sm text-white/50">
                No practice sessions yet.
              </div>
            ) : (
              <div className="space-y-2.5 pb-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="
                      rounded-2xl
                      border
                      border-white/15
                      bg-white/[0.06]
                      px-4
                      py-3.5
                      transition
                      hover:border-white/25
                      hover:bg-white/[0.085]
                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-5">
                      {/* LEFT */}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-white sm:text-base">
                          {session.topic}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/60 sm:text-sm">
                          <span>{session.mode}</span>

                          <span className="text-white/30">•</span>

                          <span>{session.category}</span>

                          {session.debateSide && (
                            <>
                              <span className="text-white/30">•</span>

                              <span>{session.debateSide}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-white/90 sm:text-base">
                          {formatDuration(session.durationSeconds)}
                        </p>

                        <p className="mt-0.5 text-xs text-white/55 sm:mt-1 sm:text-sm">
                          {formatDate(session.completedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
