
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import Navbar from "@/components/home/Navbar";

type StreakRefreshContextValue = {
  refreshStreak: () => void;
};

const StreakRefreshContext =
  createContext<StreakRefreshContextValue | null>(null);

export function useStreakRefresh() {
  const context = useContext(StreakRefreshContext);

  if (!context) {
    throw new Error(
      "useStreakRefresh must be used within AppShell",
    );
  }

  return context;
}

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [streakRefreshKey, setStreakRefreshKey] = useState(0);

  const refreshStreak = useCallback(() => {
    setStreakRefreshKey((value) => value + 1);
  }, []);

  return (
    <StreakRefreshContext.Provider value={{ refreshStreak }}>
      <div className="relative min-h-screen w-full">
        <Navbar streakRefreshKey={streakRefreshKey} />
        {children}
      </div>
    </StreakRefreshContext.Provider>
  );
}
