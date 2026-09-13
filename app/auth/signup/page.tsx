"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSignup(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError(
        "Supabase did not return a user.",
      );
      setLoading(false);
      return;
    }

    const profileResponse =
      await fetch("/api/auth/profile", {
        method: "POST",
      });

    let profileData: {
      error?: string;
    } = {};

    try {
      profileData =
        await profileResponse.json();
    } catch {
      // Ignore invalid/empty response.
    }

    if (!profileResponse.ok) {
      setError(
        `Profile setup failed: ${
          profileData.error ??
          "Unknown error"
        }`,
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen w-full">
      <div className="flex min-h-screen w-full flex-col items-center px-5">
        <Navbar />

        <div className="flex w-full flex-1 items-center justify-center pb-16">
          <form
            onSubmit={handleSignup}
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
            {/* Header */}

            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-5 text-white/55">
                Keep your SpeakUp progress.
              </p>
            </div>

            {/* Name */}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-white/70"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
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
                autoComplete="name"
              />
            </div>

            {/* Email */}

            <div className="mt-4 space-y-2">
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
                onChange={(e) =>
                  setEmail(e.target.value)
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
                autoComplete="email"
              />
            </div>

            {/* Password */}

            <div className="mt-4 space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
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

            {/* Error */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3">
                <p className="text-sm leading-5 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Create account */}

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
                ? "Creating account..."
                : "Create account"}
            </button>

            {/* Login */}

            <button
              type="button"
              onClick={() =>
                router.push("/auth/login")
              }
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
              Already have an account?{" "}
              <span className="font-semibold text-white/80">
                Log in
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}