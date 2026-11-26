import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Credits | Menulift", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Credits" sub="Placeholder photographs and videos, to be replaced with client material." />
      <section className="bg-paper py-12 text-ink sm:py-24">
        <div className="mx-auto max-w-[800px] space-y-4 px-4 text-[16px] leading-relaxed text-slate sm:px-8">
          <p>
            Photographs via{" "}
            <a className="underline" href="https://commons.wikimedia.org">Wikimedia Commons</a>:
            roti dough by Ssemmanda will (CC BY-SA 4.0), kitchen dough by Ermell (CC0), wood-fired oven by Øyvind Holmstad (CC BY-SA 4.0), dried chillies by Richard Mortel (CC BY 2.0).
          </p>
          <p>
            Kitchen videos from <a className="underline" href="https://mixkit.co">Mixkit</a>, under the Mixkit free licence.
          </p>
          <p>
            Hero kitchen footage via <a className="underline" href="https://www.pexels.com/video/a-man-cooking-in-a-commercial-kitchen-4253135/">Pexels</a>,
            used under the Pexels licence.
          </p>
        </div>
      </section>
    </>
  );
}
