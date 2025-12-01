// src/app/api/home/reload/route.ts
import { NextResponse } from "next/server";
import loadHomeServer from "@/services/home/loadHomeServer";
import { getUserServer } from "@/lib/supabase/getUserServer";

export async function GET() {
  try {
    const { user } = await getUserServer();

    // usuário não logado → 401
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // carregar dados da home
    const data = await loadHomeServer(user.id);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("🔥 Error /api/home/reload:", err);
    return NextResponse.json(
      { error: "Internal error", details: err.message },
      { status: 500 }
    );
  }
}
