import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { adminPassword, isAdminCookie } from "@/lib/server-utils";
import { counts, listLeads, upcomingBookings, type LeadStatus, type LeadType } from "@/lib/store";
import { istParts } from "@/lib/slots";
import { AdminLeads } from "@/components/AdminLeads";
import { AdminShell } from "@/components/AdminShell";
import { AdminSkeleton } from "@/components/AdminSkeleton";

export const metadata: Metadata = { title: "Admin | Menulift", robots: { index: false, follow: false } };

type SP = { e?: string; type?: string; status?: string; q?: string; page?: string };
const PAGE = 40;

async function Content({ params }: { params: Promise<SP> }) {
  const { e: error, type, status, q, page } = await params;
  const jar = await cookies();
  const authed = isAdminCookie(jar.get("ml_admin")?.value);
  if (!adminPassword()) {
    return <p className="mx-auto max-w-md p-8 text-center">Admin is off. Set ADMIN_PASSWORD in the environment to turn it on.</p>;
  }
  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <form method="post" action="/api/admin/login" className="w-full max-w-sm rounded-3xl border border-line bg-white p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] sm:p-9">
          <p className="font-display text-[28px] font-semibold tracking-tight">
            menu<span className="text-accent-deep">lift</span>
            <span className="ml-2 rounded-full bg-paper-2 px-2 py-0.5 align-middle font-sans text-[12px] font-medium text-slate">admin</span>
          </p>
          <p className="mt-2 text-[15px] text-slate">Sign in to see your bookings and enquiries.</p>
          <label className="mt-6 block text-[14px] font-semibold">
            Password
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate bg-white px-4 text-[16px] font-normal outline-none focus:border-ink focus:ring-2 focus:ring-accent/40"
            />
          </label>
          {error && <p role="alert" className="mt-3 text-[14px] font-semibold text-danger-deep">{error === "wait" ? "Too many tries. Wait a minute." : error === "weak" ? "Admin is locked until ADMIN_PASSWORD is a strong one (10+ characters). Change it in your hosting settings." : "That password is not right."}</p>}
          <button className="mt-5 min-h-12 w-full rounded-full bg-ink text-[16px] font-semibold text-paper transition-colors hover:bg-ink-2">Sign in</button>
        </form>
      </div>
    );
  }
  const t = type === "booking" || type === "quiz" || type === "partner" ? (type as LeadType) : undefined;
  const st = (["new", "contacted", "showed", "paid", "closed", "cancelled"] as const).find((x) => x === status) as LeadStatus | undefined;
  const p = Math.max(1, Number(page) || 1);
  const { rows, total } = await listLeads({ type: t, status: st, q: q?.slice(0, 60), limit: PAGE, offset: (p - 1) * PAGE });
  const upcoming = await upcomingBookings(istParts(Date.now()).date);
  const newCount = (await listLeads({ status: "new", limit: 1, offset: 0 })).total;
  return <AdminLeads rows={rows} total={total} page={p} pageSize={PAGE} type={t ?? "all"} status={st ?? "all"} q={q ?? ""} upcoming={upcoming} counts={await counts()} newCount={newCount} />;
}

export default function Page({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <AdminShell title="Enquiries">
            <AdminSkeleton />
          </AdminShell>
        }
      >
        <Content params={searchParams} />
      </Suspense>
    </main>
  );
}
