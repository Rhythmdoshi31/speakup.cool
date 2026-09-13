"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleLogin(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const {
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const profileResponse =
      await fetch("/api/auth/profile", {
        method: "POST",
      });

    if (!profileResponse.ok) {
      setError(
        "Logged in, but profile setup failed.",
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm opacity-60">
            Continue your SpeakUp journey.
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded-xl border px-4 py-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full rounded-xl border px-4 py-3"
          required
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : "Log in"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/auth/signup")
          }
          className="w-full text-sm opacity-60"
        >
          Dont have an account? <span className="text-white">Sign Up</span>
        </button>
      </form>
    </main>
  );
}