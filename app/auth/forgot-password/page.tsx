"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full">
      <div className="flex min-h-screen w-full flex-col items-center px-5">

        <div className="flex w-full flex-1 items-center justify-center pb-16">
          <form
            onSubmit={handleReset}
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-6
              shadow-2xl
              shadow-black/10
              backdrop-blur-md
              sm:p-8
            "
          >
            {!sent ? (
              <>
                {/* Header */}

                <div className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Forgot your password?
                  </h1>

                  <p className="mt-2 text-sm leading-5 text-white/55">
                    Enter your email and we&apos;ll send you a link to reset
                    your password.
                  </p>
                </div>

                {/* Email */}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-white/70"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.06]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/30
                      transition
                      focus:border-white/25
                      focus:bg-white/[0.08]
                    "
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Error */}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3">
                    <p className="text-sm leading-5 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-black
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-white/90
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>

                {/* Back to Login */}

                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="
                    mt-5
                    w-full
                    text-center
                    text-sm
                    text-white/50
                    transition
                    hover:text-white/80
                  "
                >
                  Back to{" "}
                  <span className="font-semibold text-white/80">
                    Log in
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Success */}

                <div className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Check your email
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    If an account exists with that email, we&apos;ve sent you
                    a link to reset your password.
                  </p>

                  <p className="mt-3 break-all text-sm font-semibold text-white">
                    {email.trim()}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    Check your inbox and spam folder for the reset email.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-black
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-white/90
                    active:scale-[0.98]
                  "
                >
                  Back to log in
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError(null);
                  }}
                  className="
                    mt-4
                    w-full
                    text-center
                    text-sm
                    text-white/50
                    transition
                    hover:text-white/80
                  "
                >
                  Try another email
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}