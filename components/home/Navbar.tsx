"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

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

export default function Navbar({
  streakRefreshKey = 0,
}: NavbarProps) {
  const pathname = usePathname();

  const [auth, setAuth] = useState<AuthData | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setAuth({ authenticated: false });
          return;
        }

        const data = await response.json();

        setAuth(data);
      } catch {
        setAuth({ authenticated: false });
      }
    }

    loadUser();
  }, [streakRefreshKey]);

  const showSpeakButton =
    pathname === "/profile" ||
    pathname === "/streak";

  return (
    <nav className="relative flex h-24 w-full max-w-6xl items-center justify-center">
      {/* Speak */}

      {showSpeakButton && (
        <Link
          href="/"
          aria-label="Speak"
          className="
            absolute
            left-0
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
          "
        >
          <Mic size={17} strokeWidth={2} />
          <span>Speak</span>
        </Link>
      )}

      {/* Logo */}

      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80 sm:text-2xl"
      >
        speakup.cool
      </Link>

      {/* Right side */}

      <div className="absolute right-0 flex items-center gap-2">
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
              <span className="text-[17px] leading-none">
                🔥
              </span>

              <span>
                {auth.currentStreak ?? 0}
              </span>
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