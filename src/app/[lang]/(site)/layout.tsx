import { TopBar } from "@/components/TopBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { ExitIntent } from "@/components/ExitIntent";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Nav />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
      <ExitIntent />
    </>
  );
}
