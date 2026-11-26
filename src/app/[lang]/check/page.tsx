import type { Metadata } from "next";
import { CheckFlow } from "@/components/CheckFlow";

export const metadata: Metadata = {
  title: "Go-Live Readiness Check | Menulift",
  description:
    "Answer six quick questions and see exactly what your kitchen needs before going live on Zomato and Swiggy.",
};

export default function CheckPage() {
  return <CheckFlow />;
}
