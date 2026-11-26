import "../globals.css";
import { fontClasses } from "@/lib/fonts";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="min-h-screen" style={{ background: "var(--paper)", color: "var(--ink)" }}>{children}</body>
    </html>
  );
}
