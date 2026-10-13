"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserData = {
  id: string;
  email?: string;
  name?: string | null;
};

type AuthData = {
  authenticated: boolean;
  currentStreak?: number;
  user?: UserData;
};

type NavbarProps = {
  streakRefreshKey?: number;
};

export default function Navbar({ streakRefreshKey = 0 }: NavbarProps) {
  const pathname = usePathname();

  const [auth, setAuth] = useState<AuthData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) {
            setAuth({ authenticated: false });
          }
          return;
        }

        const data: AuthData = await response.json();

        if (mounted) {
          setAuth(data);
        }
      } catch {
        if (mounted) {
          setAuth({ authenticated: false });
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [streakRefreshKey]);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // Fetch the latest server-side authentication state.
        // Defer the request to avoid making Supabase calls
        // directly inside the auth-state callback.
        setTimeout(() => {
          loadAuthState();
        }, 0);
      }
    });

    async function loadAuthState() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setAuth({ authenticated: false });
          return;
        }

        const data: AuthData = await response.json();

        setAuth(data);
      } catch {
        setAuth({ authenticated: false });
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const showBackButton =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/streak" ||
    pathname === "/profile" ||
    pathname === "/auth/forgot-password";

  return (
    <nav className="flex h-24 w-full max-w-6xl items-center justify-center">
      {/* Back button */}

      {showBackButton && (
        <Link
          href="/"
          aria-label="Back"
          className="
            absolute
            left-5
            flex
            h-10
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.06]
            px-4
            text-sm
            font-semibold
            text-white/80
            backdrop-blur-sm
            transition-all
            duration-200
            hover:border-white/20
            hover:bg-white/[0.1]
            hover:text-white
            active:scale-95
            sm:left-8
          "
        >
          <ArrowLeft size={17} strokeWidth={2} />
          <span>Back</span>
        </Link>
      )}

      {/* Logo */}

      <Link
        href="/"
        className="
          absolute
          left-1/2
          -translate-x-1/2
          text-xl
          font-bold
          tracking-tight
          text-white
          transition-opacity
          hover:opacity-80
          sm:text-2xl
        "
      >
        speakup.cool
      </Link>

      {/* Right side */}

      <div className="absolute right-5 flex items-center gap-2 sm:right-8">
        {auth?.authenticated ? (
          <>
            {/* Streak */}

            <Link
              href="/streak"
              aria-label={`${auth.currentStreak ?? 0} day streak`}
              className="
                flex
                h-10
                items-center
                gap-1.5
                rounded-full
                border
                border-white/10
                bg-white/[0.06]
                px-3
                text-sm
                font-semibold
                text-white/85
                backdrop-blur-sm
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/[0.1]
                hover:text-white
                active:scale-95
              "
            >
              <span className="text-[17px] leading-none">🔥</span>
              <span>{auth.currentStreak ?? 0}</span>
            </Link>

            {/* Profile */}

            <Link
              href="/profile"
              aria-label="Profile"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.06]
                text-white/70
                backdrop-blur-sm
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/[0.1]
                hover:text-white
                active:scale-95
              "
            >
              <UserRound size={19} strokeWidth={2} />
            </Link>
          </>
        ) : auth !== null ? (
          <Link
            href="/auth/login"
            className="
              rounded-xl
              border
              border-white/10
              bg-white/[0.07]
              px-4
              py-2
              text-sm
              font-semibold
              text-white/80
              backdrop-blur-sm
              transition-all
              duration-200
              hover:border-white/20
              hover:bg-white/[0.12]
              hover:text-white
              active:scale-[0.97]
            "
          >
            Login
          </Link>
        ) : null}
      </div>
    </nav>
  );
}