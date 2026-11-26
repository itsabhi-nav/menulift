import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getPersonalSettings, savePersonalSettings } from "@/lib/store";
import { isAdminCookie, sameOrigin } from "@/lib/server-utils";

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
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const destination = path.join(uploadDir, filename);
  await fs.writeFile(destination, Buffer.from(await file.arrayBuffer()));

  const old = await getPersonalSettings();
  const next = await savePersonalSettings({ ...old, founderPhoto: `/uploads/${filename}` });

  if (old.founderPhoto?.startsWith("/uploads/founder-")) {
    const oldPath = path.join(process.cwd(), "public", "uploads", path.basename(old.founderPhoto));
    await fs.unlink(oldPath).catch(() => undefined);
  }

  return NextResponse.json(next);
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const old = await getPersonalSettings();
  const next = await savePersonalSettings({ ...old, founderPhoto: "" });
  if (old.founderPhoto?.startsWith("/uploads/founder-")) {
    const oldPath = path.join(process.cwd(), "public", "uploads", path.basename(old.founderPhoto));
    await fs.unlink(oldPath).catch(() => undefined);
  }
  return NextResponse.json(next);
}
