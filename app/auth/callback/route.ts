import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const origin = requestUrl.origin;

  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";

  if (!code) {
    const errorUrl =
      safeNext === "/auth/reset-password"
        ? "/auth/forgot-password?error=missing_code"
        : "/auth/login?error=missing_code";

    return NextResponse.redirect(new URL(errorUrl, origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("AUTH CALLBACK ERROR:", error);

    const errorUrl =
      safeNext === "/auth/reset-password"
        ? "/auth/forgot-password?error=invalid_code"
        : "/auth/login?error=invalid_code";

    return NextResponse.redirect(new URL(errorUrl, origin));
  }

  return NextResponse.redirect(new URL(safeNext, origin));
}