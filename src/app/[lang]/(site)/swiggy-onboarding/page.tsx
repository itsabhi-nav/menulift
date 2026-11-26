import { SeoPage } from "@/components/SeoPage";
import { seoMetadata, seoPages } from "@/lib/seo";

const doc = seoPages.find((d) => d.path === "swiggy-onboarding")!;
export const metadata = seoMetadata(doc);

export default function Page() {
  return <SeoPage doc={doc} />;
}
