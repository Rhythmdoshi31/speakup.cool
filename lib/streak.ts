const DAY_MS = 24 * 60 * 60 * 1000;

/*
 * For now this uses the server's local calendar date.
 *
 * Later, when users can be in different timezones,
 * we can store a timezone on the user and calculate
 * their streak using their own local calendar.
 */

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getDaysBetween(newer: Date, older: Date) {
  const newerUtc = Date.UTC(
    newer.getFullYear(),
    newer.getMonth(),
    newer.getDate(),
  );

  const olderUtc = Date.UTC(
    older.getFullYear(),
    older.getMonth(),
    older.getDate(),
  );

  return Math.round((newerUtc - olderUtc) / DAY_MS);
}

function getUniquePracticeDays(dates: Date[]) {
  return Array.from(
    new Set(dates.map(getDateKey)),
  );
}

export function calculateCurrentStreak(
  practiceDates: Date[],
) {
  if (practiceDates.length === 0) {
    return 0;
  }

  const uniqueDays = getUniquePracticeDays(practiceDates)
    .map(dateFromKey)
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();

  const latestPracticeDay = uniqueDays[0];

  const daysSinceLastPractice = getDaysBetween(
    today,
    latestPracticeDay,
  );

  /*
   * Practiced today → streak is alive.
   * Practiced yesterday → streak is still alive today.
   * Last practice was 2+ days ago → streak is broken.
   */
  if (daysSinceLastPractice > 1) {
    return 0;
  }

  let streak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const difference = getDaysBetween(
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

export function calculateLongestStreak(
  practiceDates: Date[],
) {
  if (practiceDates.length === 0) {
    return 0;
  }

  const uniqueDays = getUniquePracticeDays(practiceDates)
    .map(dateFromKey)
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const difference = getDaysBetween(
      uniqueDays[i],
      uniqueDays[i - 1],
    );

    if (difference === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function hasPracticedToday(
  practiceDates: Date[],
) {
  const todayKey = getDateKey(new Date());

  return practiceDates.some(
    (date) => getDateKey(date) === todayKey,
  );
}

export function getWeekDays(
  practiceDates: Date[],
) {
  const today = new Date();

  const currentDay = today.getDay();

  // JS: Sunday = 0, Monday = 1...
  const mondayOffset =
    currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  monday.setDate(monday.getDate() + mondayOffset);

  const practiceDayKeys = new Set(
    practiceDates.map(getDateKey),
  );

  const todayKey = getDateKey(today);

  const labels = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  return labels.map((label, index) => {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const dateKey = getDateKey(date);

    return {
      label,
      date: date.getDate().toString(),
      practiced: practiceDayKeys.has(dateKey),
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
    };
  });
}

import { prisma } from "@/lib/prisma";

export async function getCurrentStreak(
  userId: string,
) {
  const sessions =
    await prisma.practiceSession.findMany({
      where: {
        userId,
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
    });

  const practiceDates = sessions
    .map((session) => session.completedAt)
    .filter(
      (date): date is Date => date !== null,
    );

  return calculateCurrentStreak(
    practiceDates,
  );
}

export type LeaderboardEntry = {
  userId: string;
  name: string;
  streak: number;
  rank: number;
};

export async function getStreakLeaderboard(
  currentUserId: string,
) {
  const users =
    await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        practiceSessions: {
          where: {
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
        },
      },
    });

  const entries = users.map((user) => {
    const practiceDates = user.practiceSessions
      .map((session) => session.completedAt)
      .filter(
        (date): date is Date => date !== null,
      );

    return {
      userId: user.id,
      name: user.name?.trim() || "Anonymous",
      streak: calculateCurrentStreak(
        practiceDates,
      ),
    };
  });

  entries.sort((a, b) => {
    if (b.streak !== a.streak) {
      return b.streak - a.streak;
    }

    // If streaks are equal, keep the
    // ordering stable by user ID.
    return a.userId.localeCompare(b.userId);
  });

  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}