import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { adminPassword, isAdminCookie } from "@/lib/server-utils";
import { getSchedule } from "@/lib/store";
import { AdminSlots } from "@/components/AdminSlots";
import { AdminShell } from "@/components/AdminShell";
import { AdminSkeleton } from "@/components/AdminSkeleton";

export const metadata: Metadata = { title: "Slot times | Menulift admin", robots: { index: false, follow: false } };

async function Content() {
  const jar = await cookies();
  if (!adminPassword() || !isAdminCookie(jar.get("ml_admin")?.value)) {
    return (
      <p className="mx-auto max-w-md p-8 text-center">
        Please <Link className="underline" href="/admin">sign in</Link> first.
      </p>
    );
  }
  return <AdminSlots initial={await getSchedule()} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <AdminShell title="Slot times">
          <AdminSkeleton />
        </AdminShell>
      }
    >
      <Content />
    </Suspense>
  );
}
