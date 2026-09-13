import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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

    const {
      topic,
      mode,
      category,
      durationSeconds,
      debateSide,
    } = body;

    if (
      !topic ||
      !mode ||
      !category ||
      typeof durationSeconds !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const session = await prisma.practiceSession.create({
      data: {
        userId: user.id,
        topic,
        mode,
        category,
        durationSeconds,
        debateSide: debateSide ?? null,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("PRACTICE SESSION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save practice session" },
      { status: 500 },
    );
  }
}