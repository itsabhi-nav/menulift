import type { Metadata } from "next";
import { Book } from "@/components/sections/Book";

export const metadata: Metadata = {
  title: "Book your free call | Menulift",
  description: "Pick a day and time for a free 20-minute call. We tell you what your kitchen needs and a go-live date.",
};

export default function Page() {
  return <Book />;
}
