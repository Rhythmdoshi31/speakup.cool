import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  if (!user.email) {
    return NextResponse.json(
      {
        error: "User email is missing.",
      },
      {
        status: 400,
      },
    );
  }

  const profile =
    await prisma.user.upsert({
      where: {
        id: user.id,
      },

      update: {
        email: user.email,
        name:
          user.user_metadata?.name ??
          null,
      },

      create: {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.name ??
          null,
      },
    });

  return NextResponse.json(profile);
}