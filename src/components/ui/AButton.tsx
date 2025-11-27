"use client";

export default function AButton({ children, type = "button", onClick }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-[#00C974] text-white py-3 rounded-xl font-semibold text-lg active:scale-[0.98] transition-all"
    >
      {children}
    </button>
  );
}
