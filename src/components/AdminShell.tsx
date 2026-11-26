"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Enquiries", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/slots", label: "Slot times", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { href: "/admin/reports", label: "Reports", icon: "M5 20V10M12 20V4M19 20v-7" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const out = (e: Event) => !box.current?.contains(e.target as Node) && setMenu(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", out);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", out);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);
  const signOut = () => fetch("/api/admin/login", { method: "DELETE" }).then(() => location.assign("/admin"));
  const active = (h: string) => (h === "/admin" ? path === "/admin" : path.startsWith(h));

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col justify-between bg-ink p-5 text-paper lg:flex">
        <div>
          <Link href="/admin" className="font-display text-[26px] font-semibold tracking-tight">
            menu<span className="text-accent">lift</span>
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 align-middle font-sans text-[11px] font-medium text-slate-light">admin</span>
          </Link>
          <nav className="mt-8 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium transition-colors ${
                  active(n.href) ? "bg-white/15 text-paper" : "text-slate-light hover:bg-white/10 hover:text-paper"
                }`}
              >
                <Icon d={n.icon} />
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-1 text-[14px]">
          <a href="/" className="flex min-h-10 items-center rounded-xl px-3.5 text-slate-light hover:bg-white/10 hover:text-paper">
            View website
          </a>
          <button onClick={signOut} className="flex min-h-10 w-full items-center rounded-xl px-3.5 text-left text-slate-light hover:bg-white/10 hover:text-paper">
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-10">
        {/* mobile top bar: the page name lives here, so nothing is repeated below it */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
          <h1 className="truncate font-display text-[24px] font-semibold leading-none tracking-tight">{title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <div ref={box} className="relative">
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-haspopup="menu"
                aria-expanded={menu}
                className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-white pl-3.5 pr-3 text-[13px] font-semibold"
              >
                Menu
                <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${menu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {menu && (
                <div role="menu" className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]">
                  <a role="menuitem" href="/" className="flex min-h-12 items-center gap-3 px-4 text-[15px] font-semibold hover:bg-paper">
                    <Icon d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                    View website
                  </a>
                  <button role="menuitem" type="button" onClick={signOut} className="flex min-h-12 w-full items-center gap-3 px-4 text-left text-[15px] font-semibold text-danger-deep hover:bg-paper">
                    <Icon d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1080px] px-4 pt-4 sm:px-8 lg:pt-10">
          <div className="hidden flex-wrap items-end justify-between gap-3 lg:flex">
            <div>
              <h1 className="text-[34px] leading-tight">{title}</h1>
              {subtitle && <p className="mt-1 max-w-[60ch] text-[15px] text-slate">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </div>

      {/* mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active(n.href) ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[12px] font-semibold ${active(n.href) ? "text-ink" : "text-slate"}`}
          >
            <Icon d={n.icon} />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
