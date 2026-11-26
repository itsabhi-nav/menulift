import type { Metadata } from "next";
import { Founder } from "@/components/sections/Founder";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About | Menulift",
  description: "Meet Anshuman, the founder of Menulift, who helps kitchens go live on Zomato and Swiggy.",
};

export default function Page() {
  return (
    <>
      <Founder asH1 />
      <CtaBand />
    </>
  );
}
