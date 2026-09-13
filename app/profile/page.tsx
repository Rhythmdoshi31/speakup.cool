import { redirect } from "next/navigation";

import HomeGradient from "@/components/home/gradient";
import Navbar from "@/components/home/Navbar";
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

  const [profile, sessions, leaderboard] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
      }),

      prisma.practiceSession.findMany({
        where: {
          userId: user.id,
          completedAt: {
            not: null,
          },
        },
        orderBy: {
          completedAt: "desc",
        },
      }),

      getStreakLeaderboard(user.id),
    ]);

  if (!profile) {
    redirect("/");
  }

  const practiceDates = sessions
    .map((session) => session.completedAt)
    .filter(
      (date): date is Date => date !== null,
    );

  const currentStreak =
    calculateCurrentStreak(practiceDates);

  const longestStreak =
    calculateLongestStreak(practiceDates);

  const totalSessions = sessions.length;

  const totalSpeakingSeconds =
    sessions.reduce(
      (total, session) =>
        total + session.durationSeconds,
      0,
    );

  const recentSessions = sessions
    .slice(0, 10)
    .map((session) => ({
      id: session.id,
      topic: session.topic,
      mode: session.mode,
      category: session.category,
      durationSeconds: session.durationSeconds,
      debateSide: session.debateSide,
      completedAt:
        session.completedAt!.toISOString(),
    }));

  const currentUserRank =
    leaderboard.findIndex(
      (entry) => entry.userId === user.id,
    ) + 1;

  return (
    <main className="relative min-h-screen w-full md:h-screen md:overflow-hidden">
      <HomeGradient />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-5 md:h-screen">
        <Navbar />

        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center">
          <ProfilePage
            name={profile.name}
            email={profile.email}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalSessions={totalSessions}
            totalSpeakingSeconds={
              totalSpeakingSeconds
            }
            sessions={recentSessions}
            leaderboard={leaderboard}
            currentUserRank={currentUserRank}
            currentUserId={user.id}
          />
        </div>
      </div>
    </main>
  );
}