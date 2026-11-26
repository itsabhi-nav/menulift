import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "terms",
    title: "Terms of Use | Menulift",
    description: "Read the terms that apply to using the Menulift website and booking an onboarding call.",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const hi = lang === "hi";
  const sections = hi
    ? [
        ["वेबसाइट का उपयोग", "आप Menulift के बारे में जानने, किचन रेडीनेस जाँचने, पूछताछ भेजने या कॉल बुक करने के लिए वेबसाइट उपयोग कर सकते हैं। फॉर्म, ऑटोमेशन या सुरक्षित एडमिन क्षेत्र का गलत इस्तेमाल न करें।"],
        ["सेवा और कीमत", "किचन और डॉक्यूमेंट की जाँच के बाद दायरा, कीमत और डिलीवरी की तारीख सीधे तय होती है। फ्री कॉल या अनुमान मंज़ूरी या निश्चित प्लेटफॉर्म समय की गारंटी नहीं देते।"],
        ["प्लेटफॉर्म की मंज़ूरी", "Zomato और Swiggy लिस्टिंग और आवेदन स्वतंत्र रूप से जाँचते हैं। Menulift एक स्वतंत्र सेवा है और किसी प्लेटफॉर्म से संबद्ध नहीं है।"],
        ["जानकारी की सटीकता", "बिज़नेस, पहचान, लाइसेंस और बैंक विवरण सही देना आपका उत्तरदायित्व है। अंतिम नियम हर मामले में अलग से कन्फर्म किए जाते हैं।"],
        ["रद्दीकरण और बुकिंग", "आप Menulift से संपर्क करके बुक की गई कॉल रद्द या दोबारा तय करा सकते हैं। कोई भुगतान सेवा शुरू होने से पहले सहमत और बताई जाती है।"],
        ["अपडेट", "सेवा या वेबसाइट व्यवहार बदलने पर ये नियम अपडेट हो सकते हैं। वेबसाइट का उपयोग जारी रखना ताज़ा नियम मानने के बराबर है।"],
      ]
    : [
        ["Website use", "You may use this website to learn about Menulift, check your kitchen readiness, submit an enquiry or book a call. Do not misuse forms, automated systems or protected admin areas."],
        ["Services and pricing", "Any scope, price and delivery date are confirmed directly after review of your kitchen and documents. Free calls and estimates do not guarantee approval or a specific platform timeline."],
        ["Platform approval", "Zomato and Swiggy independently review listings and applications. Menulift is an independent service and is not affiliated with or endorsed by either platform."],
        ["Information accuracy", "You are responsible for providing accurate business, identity, licence and bank details. Requirements can change, so final applicability is confirmed case by case."],
        ["Cancellations and bookings", "A booked call can be rescheduled or cancelled by contacting Menulift. Any paid-service terms must be agreed and communicated before work begins."],
        ["Updates", "These terms may be updated when services or website practices change. Continued use indicates acceptance of the then-current terms."],
      ];
  return (
    <>
      <PageHeader title={hi ? "उपयोग के नियम" : "Terms of Use"} sub={hi ? "इस वेबसाइट और Menulift ऑनबोर्डिंग सेवाओं के नियम।" : "Terms for using this website and Menulift onboarding services."} />
      <section className="bg-paper py-12 text-ink sm:py-24">
        <div className="mx-auto max-w-[900px] space-y-8 px-4 text-[17px] leading-relaxed sm:px-8">
          {sections.map(([title, text]) => (
            <section key={title}><h2 className="text-[28px] font-semibold">{title}</h2><p className="mt-3 text-slate">{text}</p></section>
          ))}
        </div>
      </section>
    </>
  );
}
