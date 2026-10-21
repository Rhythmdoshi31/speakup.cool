
import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { updateStreakOnPracticeCompletion } from "@/lib/streak/streak.service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { topic, mode, category, durationSeconds, debateSide } = body;

    if (
      typeof topic !== "string" ||
      !topic.trim() ||
      typeof mode !== "string" ||
      !mode.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof durationSeconds !== "number" ||
      !Number.isFinite(durationSeconds) ||
      durationSeconds < 0
    ) {
      return NextResponse.json(
        { error: "Invalid or missing required fields" },
        { status: 400 },
      );
    }

    let session;

    // Serializable transactions can conflict under simultaneous
    // completions. Retry serialization conflicts a limited number of times.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        session = await prisma.$transaction(
          async (tx) => {
            const completedAt = new Date();

            const createdSession = await tx.practiceSession.create({
              data: {
                userId: user.id,
                topic: topic.trim(),
                mode: mode.trim(),
                category: category.trim(),
                durationSeconds,
                debateSide:
                  typeof debateSide === "string" ? debateSide : null,
                completedAt,
              },
            });

            await updateStreakOnPracticeCompletion(
              tx,
              user.id,
              completedAt,
            );

            return createdSession;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );

        break;
      } catch (error) {
        const isSerializationConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034";

        if (!isSerializationConflict || attempt === 2) {
          throw error;
        }
      }
    }

    if (!session) {
      throw new Error("Failed to complete practice session");
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("PRACTICE SESSION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save practice session" },
      { status: 500 },
    );
  }
}
