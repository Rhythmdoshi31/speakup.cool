type SpinButtonProps = {
  isSpinning: boolean;
  onSpin: () => void;
};

export default function SpinButton({
  isSpinning,
  onSpin,
}: SpinButtonProps) {
  return (
    <button
      type="button"
      onClick={onSpin}
      disabled={isSpinning}
      className="group mt-10 flex min-w-[110px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl hover:shadow-black/15 active:translate-y-0 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
    >
      <span
        className={`transition-transform duration-500 ${
          isSpinning ? "animate-spin" : "group-hover:rotate-12"
        }`}
      >
        ✦
      </span>

      <span className="ml-2">
        {isSpinning ? "Spinning..." : "Spin"}
      </span>
    </button>
  );
}