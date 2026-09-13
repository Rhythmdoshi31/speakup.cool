"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Supabase did not return a user.");
      setLoading(false);
      return;
    }

    console.log("SUPABASE USER:", data.user);
    console.log("SUPABASE SESSION:", data.session);

    const profileResponse = await fetch("/api/auth/profile", {
      method: "POST",
    });

    console.log("PROFILE STATUS:", profileResponse.status);

    const profileData = await profileResponse.json();

    console.log("PROFILE RESPONSE:", profileData);

    if (!profileResponse.ok) {
      setError(`Profile setup failed: ${profileData.error ?? "Unknown error"}`);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Create your account</h1>

          <p className="mt-2 text-sm opacity-60">Keep your SpeakUp progress.</p>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
          required
          minLength={6}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="w-full text-sm opacity-60"
        >
          Already have an account? Log in
        </button>
      </form>
    </main>
  );
}
