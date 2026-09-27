import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/reset-password?error=missing_code", requestUrl.origin),
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("AUTH CALLBACK ERROR:", error);

    return NextResponse.redirect(
      new URL(
        "/auth/reset-password?error=invalid_code",
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL("/auth/reset-password", requestUrl.origin),
  );
}