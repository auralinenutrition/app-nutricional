// src/app/home/page.tsx

import loadHomeServer from "@/services/home/loadHomeServer";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";
import { getUserServer } from "@/lib/supabase/getUserServer";

export default async function HomePage() {
  const { user } = await getUserServer();

  if (!user) redirect("/login");

  const data = await loadHomeServer(user.id);

  return <HomeClient user={user} data={data} />;
}
