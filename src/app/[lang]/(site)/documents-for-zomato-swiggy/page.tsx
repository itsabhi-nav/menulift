import { SeoPage } from "@/components/SeoPage";
import { seoMetadata, seoPages } from "@/lib/seo";

const doc = seoPages.find((d) => d.path === "documents-for-zomato-swiggy")!;
export const metadata = seoMetadata(doc);

export default function Page() {
  return <SeoPage doc={doc} />;
}
