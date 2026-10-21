
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type TransactionClient = Prisma.TransactionClient;

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );
}

function daysBetween(newer: Date, older: Date): number {
  return Math.round(
    (toUtcDay(newer).getTime() - toUtcDay(older).getTime()) /
      DAY_MS,
  );
}

export async function updateStreakOnPracticeCompletion(
  tx: TransactionClient,
  userId: string,
  completedAt: Date,
) {
  const practiceDay = toUtcDay(completedAt);

  const existing = await tx.userStreak.findUnique({
    where: { userId },
  });

  if (!existing) {
    await tx.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastPracticeDate: practiceDay,
      },
    });

    return;
  }

  const lastPracticeDay = existing.lastPracticeDate
    ? toUtcDay(existing.lastPracticeDate)
    : null;

  // Multiple completed sessions on the same day count once.
  if (lastPracticeDay && daysBetween(practiceDay, lastPracticeDay) === 0) {
    return;
  }

  // This service is for newly completed sessions. Do not let an
  // older session overwrite the latest streak date.
  if (lastPracticeDay && practiceDay < lastPracticeDay) {
    return;
  }

  const currentStreak =
    lastPracticeDay && daysBetween(practiceDay, lastPracticeDay) === 1
      ? existing.currentStreak + 1
      : 1;

  await tx.userStreak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak: Math.max(existing.longestStreak, currentStreak),
      lastPracticeDate: practiceDay,
    },
  });
}

export async function getUserStreak(userId: string) {
  const streak = await prisma.userStreak.findUnique({
    where: { userId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastPracticeDate: true,
    },
  });

  if (!streak || !streak.lastPracticeDate) {
    return {
      currentStreak: 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastPracticeDate: streak?.lastPracticeDate ?? null,
    };
  }

  const today = toUtcDay(new Date());
  const lastPracticeDay = toUtcDay(streak.lastPracticeDate);
  const daysSinceLastPractice = daysBetween(today, lastPracticeDay);

  return {
    currentStreak:
      daysSinceLastPractice <= 1 && daysSinceLastPractice >= 0
        ? streak.currentStreak
        : 0,
    longestStreak: streak.longestStreak,
    lastPracticeDate: streak.lastPracticeDate,
  };
}
