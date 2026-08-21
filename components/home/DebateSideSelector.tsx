"use client";

type DebateSide = "for" | "against";

type DebateSideSelectorProps = {
  selectedSide: DebateSide;
  onSideChange: (side: DebateSide) => void;
};

export default function DebateSideSelector({
  selectedSide,
  onSideChange,
}: DebateSideSelectorProps) {
  return (
    <div className="mt-3D flex items-center justify-center">
      <div
        className="
          flex
          items-center
          gap-1
          rounded-full
          border
          border-white/[0.08]
          bg-white/[0.04]
          p-1
        "
      >
        <button
          type="button"
          onClick={() => onSideChange("for")}
          className={`
            rounded-full
            px-5
            py-2
            text-xs
            font-medium
            transition-all
            duration-200
            sm:text-sm
            ${
              selectedSide === "for"
                ? "bg-white text-black"
                : "text-white/45 hover:text-white/80"
            }
          `}
        >
          For
        </button>

        <button
          type="button"
          onClick={() => onSideChange("against")}
          className={`
            rounded-full
            px-5
            py-2
            text-xs
            font-medium
            transition-all
            duration-200
            sm:text-sm
            ${
              selectedSide === "against"
                ? "bg-white text-black"
                : "text-white/45 hover:text-white/80"
            }
          `}
        >
          Against
        </button>
      </div>
    </div>
  );
}