import "dotenv/config";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function dayDifference(newer: Date, older: Date) {
  return Math.round(
    (utcDay(newer).getTime() - utcDay(older).getTime()) / DAY_MS,
  );
}

async function main() {
  await prisma.$connect();
  console.log("Database connection established");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      practiceSessions: {
        where: { completedAt: { not: null } },
        select: { completedAt: true },
      },
    },
  });

  for (const user of users) {
    const uniqueDays = [
      ...new Map(
        user.practiceSessions
          .map((session) => session.completedAt)
          .filter((date): date is Date => date !== null)
          .map((date) => {
            const day = utcDay(date);
            return [day.toISOString(), day] as const;
          }),
      ).values(),
    ].sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let runningStreak = 0;
    let previousDay: Date | null = null;

    for (const day of uniqueDays) {
      runningStreak =
        previousDay && dayDifference(day, previousDay) === 1
          ? runningStreak + 1
          : 1;

      longestStreak = Math.max(longestStreak, runningStreak);
      previousDay = day;
    }

    const lastPracticeDate = uniqueDays.at(-1) ?? null;
    const today = utcDay(new Date());

    const currentStreak =
      lastPracticeDate &&
      dayDifference(today, lastPracticeDate) >= 0 &&
      dayDifference(today, lastPracticeDate) <= 1
        ? runningStreak
        : 0;

    await prisma.userStreak.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        currentStreak,
        longestStreak,
        lastPracticeDate,
      },
      update: {
        currentStreak,
        longestStreak,
        lastPracticeDate,
      },
    });
  }

  console.log(`Backfilled streaks for ${users.length} users.`);
}

main()
  .catch((error) => {
    console.error("STREAK BACKFILL FAILED:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
