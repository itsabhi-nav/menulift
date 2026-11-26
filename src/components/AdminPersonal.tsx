"use client";

import { useEffect, useState } from "react";
import type { PersonalSettings } from "@/lib/store";
import { AdminShell } from "./AdminShell";

const field = "min-h-12 w-full rounded-xl border border-slate bg-white px-3 text-[15px] outline-none focus:border-ink focus:ring-2 focus:ring-accent/40";

export function AdminPersonal({ initial }: { initial: PersonalSettings }) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: keyof PersonalSettings, v: string) => setValue((cur) => ({ ...cur, [key]: v }));

  async function save() {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    setBusy(false);
    if (!response.ok) {
      setMessage("Could not save. Please sign in again.");
      return;
    }
    const next = (await response.json()) as PersonalSettings;
    setValue(next);
    setSaved(JSON.stringify(next));
    setMessage("Saved. Personal information is updated across the website.");
  }

  const inputs: { key: keyof PersonalSettings; label: string; type?: string; placeholder?: string }[] = [
    { key: "founderName", label: "Founder name", placeholder: "Anshuman" },
    { key: "founderRole", label: "Founder role", placeholder: "Founder of Menulift" },
    { key: "founderPhoto", label: "Founder photo URL", placeholder: "/photos/founder.jpg" },
    { key: "email", label: "Public email", type: "email", placeholder: "hello@menulift.in" },
    { key: "phoneDisplay", label: "Phone shown on website", type: "tel", placeholder: "+91 98765 43210" },
    { key: "whatsappNumber", label: "WhatsApp number with country code", type: "tel", placeholder: "919876543210" },
    { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/..." },
    { key: "instagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
    { key: "youtube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/@..." },
    { key: "facebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
  ];

  return (
    <AdminShell
      title="Personal info"
      subtitle="Update the public founder and contact details used across Menulift."
      actions={
        <button type="button" disabled={!dirty || busy} onClick={save} className="min-h-11 rounded-full bg-ink px-5 text-[14px] font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Saving..." : "Save changes"}
        </button>
      }
    >
      <div className="mt-6 rounded-2xl border border-line bg-white p-4 sm:p-6 lg:mt-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {inputs.map((item) => (
            <label key={item.key} className="text-[14px] font-semibold">
              {item.label}
              <input
                type={item.type ?? "text"}
                value={value[item.key]}
                onChange={(event) => set(item.key, event.target.value)}
                placeholder={item.placeholder}
                className={`${field} mt-1.5 font-normal`}
              />
            </label>
          ))}
        </div>
        {message && <p role="status" className="mt-5 text-[14px] font-semibold text-slate">{message}</p>}
      </div>
    </AdminShell>
  );
}
