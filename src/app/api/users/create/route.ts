import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// client admin
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, email, plan } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // inserir no users (sem depender de auth)
    const { error: insertErr } = await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        name,
        email,
        plan,
        onboarding_done: true,
        created_at: new Date().toISOString(),
      });

    if (insertErr) {
      console.error("Admin insert error:", insertErr);
      return NextResponse.json(
        { error: "Failed to insert user", details: insertErr },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("users/create error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
