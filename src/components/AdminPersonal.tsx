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
  const [photoPreview, setPhotoPreview] = useState(initial.founderPhoto);
  const [photoBusy, setPhotoBusy] = useState(false);
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (key: keyof PersonalSettings, v: string) => setValue((cur) => ({ ...cur, [key]: v }));

  async function uploadPhoto(file: File) {
    if (value.founderPhoto && !window.confirm("Replace the current founder photo? The existing uploaded photo will be deleted.")) {
      return;
    }
    setPhotoBusy(true);
    setMessage("");
    const form = new FormData();
    form.set("photo", file);
    const response = await fetch("/api/admin/founder-photo", { method: "POST", body: form });
    setPhotoBusy(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setMessage(body?.error === "bad_file_type"
        ? "Use a JPG, PNG or WebP image."
        : body?.error === "bad_file_size"
          ? "The image must be smaller than 5 MB."
          : "The photo could not be uploaded.");
      return;
    }
    const next = (await response.json()) as PersonalSettings;
    setValue(next);
    setSaved(JSON.stringify(next));
    setPhotoPreview(next.founderPhoto);
    setMessage("Founder photo replaced and saved.");
  }

  async function removePhoto() {
    if (!window.confirm("Remove the founder photo?")) return;
    setPhotoBusy(true);
    const response = await fetch("/api/admin/founder-photo", { method: "DELETE" });
    setPhotoBusy(false);
    if (!response.ok) {
      setMessage("The photo could not be removed.");
      return;
    }
    const next = (await response.json()) as PersonalSettings;
    setValue(next);
    setSaved(JSON.stringify(next));
    setPhotoPreview("");
    setMessage("Founder photo removed.");
  }

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
        <div className="mb-6 rounded-2xl border border-line bg-paper p-4">
          <p className="text-[14px] font-semibold">Founder photo</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ink text-[30px] font-bold text-accent">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Current founder" className="h-full w-full object-cover" />
              ) : (
                (value.founderName || "Founder").split(" ").map((part) => part[0]).join("").slice(0, 2)
              )}
            </div>
            <div>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[14px] font-semibold text-paper">
                {photoBusy ? "Uploading…" : photoPreview ? "Replace photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={photoBusy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void uploadPhoto(file);
                  }}
                />
              </label>
              {photoPreview && (
                <button type="button" disabled={photoBusy} onClick={removePhoto} className="ml-2 min-h-11 rounded-full border border-line px-5 text-[14px] font-semibold text-danger-deep disabled:opacity-50">
                  Remove
                </button>
              )}
              <p className="mt-2 text-[12px] text-slate">JPG, PNG or WebP. Maximum 5 MB.</p>
            </div>
          </div>
        </div>
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
