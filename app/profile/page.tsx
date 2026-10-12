import { redirect } from "next/navigation";

import ProfilePage from "@/components/profile/ProfilePage";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getStreakLeaderboard,
} from "@/lib/streak";

export default async function ProfileRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profile, stats, recentSessions, sessionDates, leaderboard] =
    await Promise.all([
      // Fetch user profile.
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
      }),

      // Calculate totals across ALL completed sessions.
      prisma.practiceSession.aggregate({
        where: {
          userId: user.id,
          completedAt: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          durationSeconds: true,
        },
      }),

      // Fetch only the latest 5 completed sessions.
      prisma.practiceSession.findMany({
        where: {
          userId: user.id,
          completedAt: {
            not: null,
          },
        },
        select: {
          id: true,
          topic: true,
          mode: true,
          category: true,
          durationSeconds: true,
          debateSide: true,
          completedAt: true,
        },
        orderBy: {
          completedAt: "desc",
        },
        take: 5,
      }),

      // Fetch all completed session dates for accurate streaks.
      prisma.practiceSession.findMany({
        where: {
          userId: user.id,
          completedAt: {
            not: null,
          },
        },
        select: {
          completedAt: true,
        },
        orderBy: {
          completedAt: "desc",
        },
      }),

      // Fetch leaderboard.
      getStreakLeaderboard(user.id),
    ]);

  if (!profile) {
    redirect("/");
  }

  // Calculate streaks using ALL completed session dates.
  const practiceDates = sessionDates
    .map((session) => session.completedAt)
    .filter((date): date is Date => date !== null);

  const currentStreak =
    calculateCurrentStreak(practiceDates);

  const longestStreak =
    calculateLongestStreak(practiceDates);

  // Totals include ALL completed sessions.
  const totalSessions = stats._count._all;

  const totalSpeakingSeconds =
    stats._sum.durationSeconds ?? 0;

  // Recent Practice includes only the latest 5 sessions.
  const recentSessionsFormatted = recentSessions.map(
    (session) => ({
      id: session.id,
      topic: session.topic,
      mode: session.mode,
      category: session.category,
      durationSeconds: session.durationSeconds,
      debateSide: session.debateSide,
      completedAt: session.completedAt!.toISOString(),
    }),
  );

  const currentUserRank =
    leaderboard.findIndex(
      (entry) => entry.userId === user.id,
    ) + 1;

  return (
    <main className="relative min-h-screen w-full">
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-5">
        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center">
          <ProfilePage
            name={profile.name}
            email={profile.email}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalSessions={totalSessions}
            totalSpeakingSeconds={totalSpeakingSeconds}
            sessions={recentSessionsFormatted}
            leaderboard={leaderboard}
            currentUserRank={currentUserRank}
            currentUserId={user.id}
          />
        </div>
      </div>
    </main>
  );
}