import { Inter_Tight, Inter, Noto_Sans_Devanagari } from "next/font/google";

export const display = Inter_Tight({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
export const body = Inter({ variable: "--font-hanken", subsets: ["latin"], display: "swap" });
// Hindi glyphs; the browser only downloads this when a page actually shows Devanagari text.
export const deva = Noto_Sans_Devanagari({ variable: "--font-deva", subsets: ["devanagari"], display: "swap", preload: false });

export const fontClasses = `${display.variable} ${body.variable} ${deva.variable}`;
