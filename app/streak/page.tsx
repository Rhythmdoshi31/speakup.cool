import { redirect } from "next/navigation";

import HomeGradient from "@/components/home/gradient";
import Navbar from "@/components/home/Navbar";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

import StreakPage from "@/components/streak/StreakPage";

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getStartOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function getDaysBetween(
  newer: Date,
  older: Date,
) {
  const newerDay = getStartOfDay(newer);
  const olderDay = getStartOfDay(older);

  return Math.round(
    (newerDay.getTime() -
      olderDay.getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function calculateCurrentStreak(
  dates: Date[],
) {
  if (dates.length === 0) {
    return 0;
  }

  const uniqueDays = Array.from(
    new Set(
      dates.map((date) =>
        getDateKey(date),
      ),
    ),
  )
    .map((date) => new Date(date))
    .sort(
      (a, b) =>
        b.getTime() - a.getTime(),
    );

  const today = getStartOfDay(
    new Date(),
  );

  const latestDay = getStartOfDay(
    uniqueDays[0],
  );

  const daysSinceLatest =
    getDaysBetween(
      today,
      latestDay,
    );

  // Streak is broken if the user
  // hasn't practiced today or yesterday.
  if (daysSinceLatest > 1) {
    return 0;
  }

  let streak = 1;

  for (
    let i = 1;
    i < uniqueDays.length;
    i++
  ) {
    const difference =
      getDaysBetween(
        uniqueDays[i - 1],
        uniqueDays[i],
      );

    if (difference !== 1) {
      break;
    }

    streak++;
  }

  return streak;
}

function calculateLongestStreak(
  dates: Date[],
) {
  if (dates.length === 0) {
    return 0;
  }

  const uniqueDays = Array.from(
    new Set(
      dates.map((date) =>
        getDateKey(date),
      ),
    ),
  )
    .map((date) => new Date(date))
    .sort(
      (a, b) =>
        a.getTime() - b.getTime(),
    );

  let longest = 1;
  let current = 1;

  for (
    let i = 1;
    i < uniqueDays.length;
    i++
  ) {
    const difference =
      getDaysBetween(
        uniqueDays[i],
        uniqueDays[i - 1],
      );

    if (difference === 1) {
      current++;
      longest = Math.max(
        longest,
        current,
      );
    } else {
      current = 1;
    }
  }

  return longest;
}

function getWeekDays(
  practiceDates: Date[],
) {
  const today = new Date();
  const currentDay = today.getDay();

  // Monday → Sunday
  const mondayOffset =
    currentDay === 0
      ? -6
      : 1 - currentDay;

  const monday = new Date(today);

  monday.setDate(
    today.getDate() + mondayOffset,
  );

  monday.setHours(0, 0, 0, 0);

  const practiceDayKeys = new Set(
    practiceDates.map((date) =>
      getDateKey(date),
    ),
  );

  const labels = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  return labels.map(
    (label, index) => {
      const date = new Date(monday);

      date.setDate(
        monday.getDate() + index,
      );

      const dateKey =
        getDateKey(date);

      const todayKey =
        getDateKey(today);

      return {
        label,
        date: date
          .getDate()
          .toString(),

        practiced:
          practiceDayKeys.has(
            dateKey,
          ),

        isToday:
          dateKey === todayKey,

        isFuture:
          date.getTime() >
          today.getTime(),
      };
    },
  );
}

export default async function StreakRoute() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const sessions =
    await prisma.practiceSession.findMany(
      {
        where: {
          userId: user.id,
        },

        select: {
          createdAt: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    );

  const practiceDates =
    sessions.map(
      (session) =>
        session.createdAt,
    );

  const currentStreak =
    calculateCurrentStreak(
      practiceDates,
    );

  const longestStreak =
    calculateLongestStreak(
      practiceDates,
    );

  const todayKey =
    getDateKey(new Date());

  const practicedToday =
    practiceDates.some(
      (date) =>
        getDateKey(date) ===
        todayKey,
    );

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