// src/app/api/uploads/meal-photo/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// admin client (service role)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    // 1) Autenticação — cookies OU bearer token
    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Ler FormData
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/meal-photos/${fileName}`;

    // 3) Converter File → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4) Upload privado no bucket
    const { error: uploadErr } = await supabaseAdmin.storage
      .from("user-uploads")
      .upload(filePath, buffer, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return NextResponse.json({ error: "Upload failed", details: uploadErr }, { status: 500 });
    }

    // 5) Criar signed URL (1 hora)
    const { data: signed, error: signedErr } = await supabaseAdmin.storage
      .from("user-uploads")
      .createSignedUrl(filePath, 60 * 60);

    if (signedErr) {
      console.error("Signed URL error:", signedErr);
      return NextResponse.json({ error: "Signed URL failed", details: signedErr }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      path: filePath,
      publicUrl: signed.signedUrl,
    });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
