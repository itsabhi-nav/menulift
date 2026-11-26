import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PartnerForm } from "@/components/PartnerForm";

export const metadata: Metadata = {
  title: "Partner with Menulift | Menulift",
  description: "FSSAI and GST consultants, equipment and packaging suppliers: send new food-business owners to Menulift with a tracked link.",
};

const who = ["FSSAI and GST consultants", "Kitchen equipment sellers", "Packaging suppliers", "POS and billing companies"];

export default function Page() {
  return (
    <>
      <PageHeader
        title="Meet new owners first? Partner with us."
        sub="You are often the first person a new food-business owner talks to. Send them to Menulift and we will get them live on Zomato and Swiggy."
      />
      <section className="bg-paper py-12 text-ink sm:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-[30px] leading-tight sm:text-[48px]">How it works</h2>
            <ol className="mt-6 space-y-5">
              {[
                ["Join", "Fill the short form. We call you and answer your questions."],
                ["Share your link", "You get a tracked link. Every owner who books a call through it is credited to you."],
                ["We take it from there", "We onboard the owner. Your referral reward is agreed with you on the call."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[16px] text-accent">{i + 1}</span>
                  <div>
                    <h3 className="text-[20px] leading-tight">{t}</h3>
                    <p className="mt-1 text-[16px] leading-relaxed text-slate">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-semibold">Who it is for</p>
            <ul className="mt-2 grid gap-1.5 text-[16px] text-slate sm:grid-cols-2">
              {who.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}
