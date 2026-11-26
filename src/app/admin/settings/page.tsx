import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { adminPassword, isAdminCookie } from "@/lib/server-utils";
import { getPersonalSettings } from "@/lib/store";
import { AdminPersonal } from "@/components/AdminPersonal";
import { AdminShell } from "@/components/AdminShell";
import { AdminSkeleton } from "@/components/AdminSkeleton";

export const metadata: Metadata = { title: "Personal info | Menulift admin", robots: { index: false, follow: false } };

async function Content() {
  const jar = await cookies();
  if (!adminPassword() || !isAdminCookie(jar.get("ml_admin")?.value)) {
    return <p className="mx-auto max-w-md p-8 text-center">Please <Link className="underline" href="/admin">sign in</Link> first.</p>;
  }
  return <AdminPersonal initial={await getPersonalSettings()} />;
}

export default function Page() {
  return (
    <Suspense fallback={<AdminShell title="Personal info"><AdminSkeleton /></AdminShell>}>
      <Content />
    </Suspense>
  );
}
