import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentStreak } from "@/lib/streak";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    const currentStreak =
      await getCurrentStreak(user.id);

    return NextResponse.json({
      authenticated: true,
      currentStreak,
      user: {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.name ?? null,
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