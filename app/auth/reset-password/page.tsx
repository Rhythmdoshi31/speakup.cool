"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired.",
        );
      }

      setCheckingSession(false);
    }

    checkSession();
  }, []);

  async function handleUpdatePassword(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full">
      <div className="flex min-h-screen w-full flex-col items-center px-5">
        <Navbar />

        <div className="flex w-full flex-1 items-center justify-center pb-16">
          <form
            onSubmit={handleUpdatePassword}
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
            {checkingSession ? (
              <div className="py-8 text-center text-sm text-white/50">
                Checking reset link...
              </div>
            ) : success ? (
              <>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Password updated
                  </h1>

                  <p className="mt-2 text-sm leading-5 text-white/55">
                    Your password has been changed successfully.
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
                  Log in
                </button>
              </>
            ) : error ? (
              <>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Reset link unavailable
                  </h1>

                  <p className="mt-2 text-sm leading-5 text-white/55">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
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
                  Request a new link
                </button>
              </>
            ) : (
              <>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Reset your password
                  </h1>

                  <p className="mt-2 text-sm leading-5 text-white/55">
                    Choose a new password for your SpeakUp account.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-white/70"
                  >
                    New password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-white/70"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
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
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3">
                    <p className="text-sm leading-5 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

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
                  {loading
                    ? "Updating password..."
                    : "Update password"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}