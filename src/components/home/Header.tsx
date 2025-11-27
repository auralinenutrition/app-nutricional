"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type UserSimple = {
  name?: string | null;
  email?: string | null;
};

type HeaderProps = {
  user: UserSimple | null;
};

export default function Header({ user } : HeaderProps) {
  const router = useRouter();
  const name = user?.name;
  const email = user?.email;

  const initials = name
    ? name[0].toUpperCase()
    : email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex items-center justify-between mb-6 px-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-gray-600 text-sm">Bom dia,</p>
          <p className="font-semibold">{email}</p>
        </div>
      </div>

      <div
        className="cursor-pointer text-gray-500"
        onClick={() => router.push("/progresso")}
      >
        <ChevronRight size={24} />
      </div>
    </div>
  );
}
