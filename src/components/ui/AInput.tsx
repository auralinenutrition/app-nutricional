"use client";

export default function AInput({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-[#6F6F6F]">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] outline-none border border-transparent focus:border-[#00C974] transition-all"
      />
    </div>
  );
}
