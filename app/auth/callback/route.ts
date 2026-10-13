import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const type = requestUrl.searchParams.get("type");

  if (!code) {
    const errorUrl =
      type === "recovery"
        ? "/auth/reset-password?error=missing_code"
        : "/auth/login?error=missing_code";

    return NextResponse.redirect(
      new URL(errorUrl, requestUrl.origin),
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("AUTH CALLBACK ERROR:", error);

    const errorUrl =
      type === "recovery"
        ? "/auth/reset-password?error=invalid_code"
        : "/auth/login?error=invalid_code";

    return NextResponse.redirect(
      new URL(errorUrl, requestUrl.origin),
    );
  }

  // Password recovery must go to the password reset page.
  if (type === "recovery") {
    return NextResponse.redirect(
      new URL("/auth/reset-password", requestUrl.origin),
    );
  }

  // Ensure the redirect stays within this website.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";

  return NextResponse.redirect(
    new URL(safeNext, requestUrl.origin),
  );
}