import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getPersonalSettings, savePersonalSettings } from "@/lib/store";
import { isAdminCookie, sameOrigin } from "@/lib/server-utils";
import { supabaseServerClient } from "@/lib/store-supabase";

const BUCKET = "uploads";

function authed(req: Request) {
  return isAdminCookie(req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1]);
}

function safeImageExtension(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return null;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("photo");
  if (!(file instanceof File)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (file.size < 1 || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "bad_file_size" }, { status: 413 });
  }
  const extension = safeImageExtension(file.type);
  if (!extension) return NextResponse.json({ error: "bad_file_type" }, { status: 415 });

  const filename = `founder-${crypto.randomUUID()}.${extension}`;
  const old = await getPersonalSettings();
  const client = supabaseServerClient();
  const uploaded = await client.storage.from(BUCKET).upload(filename, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl: "public, max-age=31536000",
    upsert: false,
  });
  if (uploaded.error) {
    return NextResponse.json({ error: "upload_failed", detail: uploaded.error.message }, { status: 500 });
  }

  const publicUrl = client.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
  const next = await savePersonalSettings({ ...old, founderPhoto: publicUrl });

  if (old.founderPhoto?.includes("/storage/v1/object/public/uploads/founder-")) {
    const oldName = old.founderPhoto.split("/").pop();
    if (oldName) await client.storage.from(BUCKET).remove([oldName]);
  }

  return NextResponse.json(next);
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const old = await getPersonalSettings();
  const next = await savePersonalSettings({ ...old, founderPhoto: "" });
  if (old.founderPhoto?.includes("/storage/v1/object/public/uploads/founder-")) {
    const oldName = old.founderPhoto.split("/").pop();
    if (oldName) await supabaseServerClient().storage.from(BUCKET).remove([oldName]);
  }
  return NextResponse.json(next);
}
