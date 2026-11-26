import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Audiences } from "@/components/sections/Audiences";
import { Problems } from "@/components/sections/Problems";
import { Handled } from "@/components/sections/Handled";
import { Bento } from "@/components/sections/Bento";
import { VideoBand } from "@/components/sections/VideoBand";
import { HomeSteps } from "@/components/sections/HomeSteps";
import { FounderStrip } from "@/components/sections/FounderStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Audiences />
      <Problems />
      <Handled />
      <Bento />
      <VideoBand />
      <HomeSteps />
      <FounderStrip />
      <Testimonials />
      <Faq limit={4} />
      <CtaBand />
    </>
  );
}
