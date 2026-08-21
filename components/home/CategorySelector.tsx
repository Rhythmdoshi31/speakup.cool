"use client";

import { useEffect, useRef, useState } from "react";
import {
  categories,
  type Category,
} from "../../data/topics";

type CategorySelectorProps = {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
};

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = categories.find(
    (category) => category.id === selectedCategory,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mt-8"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex min-w-[150px] items-center justify-between gap-5 rounded-full bg-white/[0.08] px-5 py-2.5 text-sm font-bold text-white backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.13] active:scale-[0.98]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.label ?? "General"}</span>

        <svg
          className={`h-4 w-4 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="
          absolute
          left-0
          right-0
          top-full
          z-50
          mt-2
          max-h-64
          overflow-y-auto
          overscroll-contain
          rounded-2xl
          border
          border-white/10
          bg-black/40
          p-1.5
          shadow-2xl
          backdrop-blur-xl
        "
        >
          {categories.map((category) => {
            const active = category.id === selectedCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onCategoryChange(category.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition ${active
                    ? "bg-white/15 font-bold text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span>{category.label}</span>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}