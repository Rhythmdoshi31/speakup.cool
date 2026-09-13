import { redirect } from "next/navigation";

import HomeGradient from "@/components/home/gradient";
import Navbar from "@/components/home/Navbar";
import StreakPage from "@/components/streak/StreakPage";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getWeekDays,
  hasPracticedToday,
} from "@/lib/streak";

export default async function StreakRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const sessions =
    await prisma.practiceSession.findMany({
      where: {
        userId: user.id,

        // Only completed speaking sessions count.
        completedAt: {
          not: null,
        },
      },

      select: {
        completedAt: true,
      },

      orderBy: {
        completedAt: "asc",
      },
    });

  const practiceDates = sessions
    .map((session) => session.completedAt)
    .filter(
      (date): date is Date => date !== null,
    );

  const currentStreak =
    calculateCurrentStreak(practiceDates);

  const longestStreak =
    calculateLongestStreak(practiceDates);

  const practicedToday =
    hasPracticedToday(practiceDates);

  const week =
    getWeekDays(practiceDates);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <HomeGradient />

      <div className="relative z-10 flex h-full w-full flex-col items-center px-5">
        <Navbar />

        <div className="flex w-full flex-1 flex-col items-center">
          <StreakPage
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            practicedToday={practicedToday}
            week={week}
          />
        </div>
      </div>
    </main>
  );
}