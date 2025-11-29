"use client";

import Link from "next/link";
import { Home, Utensils, ClipboardList, User } from "lucide-react";

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-6px_18px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around py-3">
        <Link href="/home" className="flex flex-col items-center gap-1">
          <Home size={22} strokeWidth={2} className="text-gray-700" />
        </Link>

        <Link href="/meals" className="flex flex-col items-center gap-1">
          <Utensils size={22} strokeWidth={2} className="text-gray-700" />
        </Link>

        <Link href="/shopping" className="flex flex-col items-center gap-1">
          <ClipboardList size={22} strokeWidth={2} className="text-gray-700" />
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-1">
          <User size={22} strokeWidth={2} className="text-gray-700" />
        </Link>
      </div>
    </div>
  );
}
