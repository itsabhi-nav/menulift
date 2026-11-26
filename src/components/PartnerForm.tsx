"use client";

import { useState } from "react";
import { siteUrl } from "@/lib/seo";

const field =
  "min-h-12 w-full rounded-xl border border-line bg-white px-4 text-[16px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/40";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);

export function PartnerForm() {
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const link = `${siteUrl}/?utm_source=partner&utm_medium=referral&utm_campaign=${slug(biz || name) || "your-name"}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) return setMsg("Enter a valid 10-digit number.");
    if (!name.trim()) return setMsg("Please tell us your name.");
    setMsg("");
    setState("busy");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "partner", name, phone: digits, kitchen: biz, hp: website }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-paper p-6 text-ink sm:p-8" role="status">
        <h3 className="font-display text-[26px] leading-tight">Thank you. We will call you soon.</h3>
        <p className="mt-3 text-[16px] text-slate">Until then, this is your tracked link. Every owner who books through it is credited to you.</p>
        <p className="mt-4 break-all rounded-xl bg-white p-4 text-[15px] font-semibold">{link}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-paper p-6 text-ink sm:p-8">
      <h3 className="font-display text-[26px] leading-tight">Become a partner</h3>
      <div className="mt-5 space-y-3">
        <label className="block text-[14px] font-semibold text-slate">
          Your name
          <input className={`${field} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="block text-[14px] font-semibold text-slate">
          Your business (for example, FSSAI consultant)
          <input className={`${field} mt-1.5`} value={biz} onChange={(e) => setBiz(e.target.value)} />
        </label>
        <label className="block text-[14px] font-semibold text-slate">
          WhatsApp number
          <input className={`${field} mt-1.5`} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" placeholder="10-digit number" />
        </label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="hp_note_x" />
      </div>
      <p className="mt-4 break-all text-[13px] text-slate">Your tracked link will be: {link}</p>
      {(msg || state === "error") && <p role="alert" className="mt-3 text-[14px] font-semibold text-danger-deep">{msg || "Something went wrong. Please try again."}</p>}
      <button disabled={state === "busy"} className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-ink text-[17px] font-bold text-paper disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Join as a partner"}
      </button>
    </form>
  );
}
