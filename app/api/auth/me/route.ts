import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStreak } from "@/lib/streak";

export async function GET() {
  const start = performance.now();

  try {
    const supabase = await createClient();
    const clientCreated = performance.now();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    const authChecked = performance.now();

    console.log({
      createClientMs: Math.round(clientCreated - start),
      getUserMs: Math.round(authChecked - clientCreated),
    });

    if (error || !user) {
      return NextResponse.json({ authenticated: false });
    }

    const currentStreak = await getCurrentStreak(user.id);
    const streakCalculated = performance.now();

    console.log({
      getCurrentStreakMs: Math.round(streakCalculated - authChecked),
      totalMs: Math.round(streakCalculated - start),
    });

    return NextResponse.json({
      authenticated: true,
      currentStreak,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name ?? null,
      },
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 },
    );
  }
}