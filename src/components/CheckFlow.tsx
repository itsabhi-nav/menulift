"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "@/components/L";
import { motion, useReducedMotion } from "motion/react";
import { getUtm, track } from "@/lib/track";
import { BookingCard } from "./BookingCard";
import { Arrow, Check, Cross } from "./ui";
import { Wordmark } from "./Nav";
import { useContent, useT } from "@/components/I18n";

type Answers = Record<string, string>;
const TYPE_NAMES: Record<string, string> = {
  home: "Home kitchen",
  cloud: "Cloud kitchen",
  restaurant: "New restaurant",
};

function ScoreRing({ score }: { score: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-40 w-40 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#2e2e32" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={score >= 70 ? "#34d399" : "#f0b44c"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - score / 100) : c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center leading-none">
        <span className="font-display text-[44px] font-extrabold">{score}</span>
        <span className="block text-[13px] text-slate-light">{t("out of 100")}</span>
      </div>
    </div>
  );
}

export function CheckFlow() {
  const t = useT();
  const { quiz, site } = useContent();
  const total = quiz.length;
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0); // 0..total-1 questions, total = contact, total+1 = result
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pre-select kitchen type from ?type= and skip that question.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    if (t && TYPE_NAMES[t]) {
      setAnswers({ type: t });
      setStep(1);
    }
  }, []);

  const q = quiz[step];
  const onQuestion = step < total;
  const onContact = step === total;
  const onResult = step === total + 1;

  const score = useMemo(() => {
    return quiz.reduce((sum, item) => {
      const opt = item.options.find((o) => o.value === answers[item.id]);
      return sum + (opt?.score ?? 0);
    }, 0);
  }, [answers]);

  const missing = useMemo(
    () =>
      quiz
        .filter((item) => "missing" in item)
        .filter((item) => {
          const opt = item.options.find((o) => o.value === answers[item.id]);
          const max = Math.max(...item.options.map((o) => o.score));
          return (opt?.score ?? 0) < max;
        })
        .map((item) => (item as { missing: string }).missing),
    [answers],
  );
  const ready = useMemo(
    () =>
      quiz
        .filter((item) => "missing" in item)
        .map((item) => (item as { missing: string }).missing)
        .filter((m) => !missing.includes(m)),
    [missing],
  );

  function begin() {
    if (!started) {
      setStarted(true);
      track("check_started");
    }
  }

  function pick(value: string) {
    begin();
    setAnswers((a) => ({ ...a, [quiz[step].id]: value }));
    track("check_step", { step: step + 1 });
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) {
      setError("Enter your 10-digit WhatsApp number so we can send your checklist.");
      return;
    }
    setError("");
    setPhone(digits);
    setSubmitting(true);
    const eventId = crypto.randomUUID();
    track("check_completed", { score, eventId });
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name,
          phone: digits,
          kitchen: TYPE_NAMES[answers.type] ?? answers.type,
          score,
          missing,
          utm: getUtm(),
          eventId,
          fbp: document.cookie.match(/(?:^|; )_fbp=([^;]*)/)?.[1],
          fbc: document.cookie.match(/(?:^|; )_fbc=([^;]*)/)?.[1],
        }),
      });
    } catch {
      // The result remains available even if lead delivery is temporarily unavailable.
    } finally {
      setSubmitting(false);
    }
    try {
      localStorage.setItem("menulift_check", JSON.stringify({ answers, score, phone: digits, name }));
    } catch {}
    setStep(total + 1);
  }

  const kitchen = TYPE_NAMES[answers.type] ?? "Kitchen";
  const label =
    score >= 80 ? "Almost ready to go live" : score >= 50 ? "A few gaps to close" : "Needs groundwork first";

  const wa = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    [
      "Hi Menulift, please send me my Go-Live checklist.",
      `Kitchen: ${kitchen}`,
      `Readiness score: ${score}/100`,
      missing.length ? `Missing: ${missing.join(", ")}` : "Nothing missing",
      `WhatsApp: ${phone}`,
    ].join("\n"),
  )}`;

  const progress = onResult ? 100 : Math.round((Math.min(step, total) / (total + 1)) * 100);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="border-b border-line-dark/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label={t("Menulift home")}>
            <Wordmark />
          </Link>
          <Link href="/" className="text-[14px] text-slate-light hover:text-paper">
            {t("Back to site")}
          </Link>
        </div>
        <div
          className="h-1.5 bg-ink-2"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("Readiness Check progress")}
        >
          <div
            className="h-full origin-left bg-accent transition-transform duration-500"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <>
          {onQuestion && (
            <motion.section
              key={q.id}
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.22 }}
              aria-labelledby="q-title"
            >
              <p className="text-[14px] font-semibold text-slate-light">
                {t("Question")} {step + 1} {t("of")} {total}
              </p>
              <h1 id="q-title" className="mt-3 text-[32px] font-extrabold leading-[1.1] sm:text-[44px]">
                {q.title}
              </h1>
              <div className="mt-9 grid gap-3">
                {q.options.map((o) => {
                  const selected = answers[q.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => pick(o.value)}
                      aria-pressed={selected}
                      className={`flex min-h-16 items-center justify-between rounded-2xl border px-5 text-left text-[18px] font-semibold transition-[transform,background-color,border-color,color,opacity,box-shadow] hover:-translate-y-0.5 ${
                        selected
                          ? "border-accent bg-accent text-ink"
                          : "border-line-dark bg-ink-2/60 hover:border-accent"
                      }`}
                    >
                      {o.label}
                      {selected && <Check className="h-5 w-5" />}
                    </button>
                  );
                })}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="mt-8 text-[15px] font-semibold text-slate-light hover:text-paper"
                >
                  {t("Back")}
                </button>
              )}
            </motion.section>
          )}

          {onContact && (
            <motion.section
              key="contact"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.22 }}
              aria-labelledby="c-title"
            >
              <p className="text-[14px] font-semibold text-slate-light">{t("Last step")}</p>
              <h1 id="c-title" className="mt-3 text-[32px] font-extrabold leading-[1.1] sm:text-[44px]">
                {t("Where should we send your result?")}
              </h1>
              <p className="mt-4 max-w-[46ch] text-[17px] text-slate-light">
                {t("We'll show your score right away and send your checklist on WhatsApp. No payment, no spam.")}
              </p>
              <form onSubmit={submit} className="mt-8 grid gap-4" noValidate>
                <label className="text-[15px] font-semibold">
                  {t("WhatsApp number")}
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={t("10-digit mobile number")}
                    className="mt-2 min-h-14 w-full rounded-2xl border border-line-dark bg-ink-2 px-5 text-[18px] text-paper outline-none placeholder:text-slate focus:border-accent"
                  />
                </label>
                <label className="text-[15px] font-semibold">
                  {t("Your name (optional)")}
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="mt-2 min-h-14 w-full rounded-2xl border border-line-dark bg-ink-2 px-5 text-[18px] text-paper outline-none focus:border-accent"
                  />
                </label>
                {error && (
                  <p role="alert" className="text-[15px] font-semibold text-danger">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent text-[18px] font-bold text-ink hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden />
                      {t("Preparing your result…")}
                    </>
                  ) : (
                    <>
                      {t("Show my result")}
                      <Arrow />
                    </>
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => setStep(total - 1)}
                className="mt-6 text-[15px] font-semibold text-slate-light hover:text-paper"
              >
                {t("Back")}
              </button>
            </motion.section>
          )}

          {onResult && (
            <motion.section
              key="result"
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.35 }}
              aria-labelledby="r-title"
            >
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <ScoreRing score={score} />
                <div>
                  <p className="text-[14px] font-semibold text-slate-light">
                    {t(kitchen)}
                    {name ? `, ${name}` : ""}
                  </p>
                  <h1 id="r-title" className="mt-1 text-[32px] font-extrabold leading-[1.1] sm:text-[44px]">
                    {t(label)}
                  </h1>
                </div>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line-dark bg-ink-2/60 p-5">
                  <p className="font-display text-[18px] font-bold">{t("Still missing")}</p>
                  <ul className="mt-3 space-y-2.5">
                    {missing.length === 0 && (
                      <li className="text-slate-light">{t("Nothing. You are in good shape.")}</li>
                    )}
                    {missing.map((m) => (
                      <li key={m} className="flex gap-3 text-[15px]">
                        <Cross className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line-dark bg-ink-2/60 p-5">
                  <p className="font-display text-[18px] font-bold">{t("Already in place")}</p>
                  <ul className="mt-3 space-y-2.5">
                    {ready.length === 0 && (
                      <li className="text-slate-light">{t("We'll build this from the ground up.")}</li>
                    )}
                    {ready.map((m) => (
                      <li key={m} className="flex gap-3 text-[15px]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-live" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="mt-14 text-[30px] font-extrabold leading-tight sm:text-[40px]">
                {t("Book your free Go-Live Call")}
              </h2>
              <p className="mt-3 max-w-[50ch] text-[17px] text-slate-light">
                {t("We'll go through this checklist together and give you a fixed price and go-live date.")}
              </p>
              <div className="mt-7">
                <BookingCard
                  prefill={{ name, phone, score, type: kitchen, missing }}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-dashed border-line-dark p-5">
                <p className="font-display text-[18px] font-bold">{t("Not ready to book?")}</p>
                <p className="mt-1 text-[15px] text-slate-light">
                  {t("We'll send your checklist on WhatsApp, with one useful tip a month until you are ready.")}
                </p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click", { from: "check_result" })}
                  className="mt-4 inline-flex items-center gap-2 font-bold text-accent hover:underline"
                >
                  {t("Send me my checklist on WhatsApp")}
                  <Arrow />
                </a>
              </div>
            </motion.section>
          )}
        </>
      </main>
    </div>
  );
}
