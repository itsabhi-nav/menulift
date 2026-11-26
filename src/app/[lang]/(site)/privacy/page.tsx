import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    lang: lang === "hi" ? "hi" : "en",
    path: "privacy",
    title: "Privacy Policy | Menulift",
    description: "Learn how Menulift collects, uses and protects information submitted through its website.",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const hi = lang === "hi";
  const sections = hi
    ? [
        ["हम कौन-सी जानकारी लेते हैं", "बुकिंग, रेडीनेस क्विज़ या पार्टनर पूछताछ में आपका नाम, फोन नंबर, किचन की जानकारी, दिए गए जवाब और पसंदीदा कॉल समय लिया जा सकता है।"],
        ["हम इसका इस्तेमाल कैसे करते हैं", "इस जानकारी का इस्तेमाल पूछताछ का जवाब देने, ऑनबोर्डिंग मार्गदर्शन देने, कॉल प्रबंधित करने और सेवाएँ सुधारने के लिए होता है। हम व्यक्तिगत जानकारी नहीं बेचते।"],
        ["डेटा स्टोरेज और साझा करना", "जानकारी कॉन्फ़िगर किए गए वेबसाइट डेटाबेस में रखी जाती है। सेवा प्रदाता वेबसाइट, बुकिंग या संवाद चलाने के लिए आवश्यक सीमा तक डेटा संभाल सकते हैं।"],
        ["एनालिटिक्स", "वेबसाइट Menulift द्वारा कॉन्फ़िगर किए गए एनालिटिक्स और विज्ञापन टूल इस्तेमाल कर सकती है। ये इंटरैक्शन और मापन के लिए जरूरी तकनीकी डेटा रिकॉर्ड कर सकते हैं।"],
        ["आपके विकल्प", "जहाँ लागू हो, आप जानकारी सुधारने या हटाने का अनुरोध कर सकते हैं। आप वेबसाइट का उपयोग रोक सकते हैं या ऑनलाइन फॉर्म के बजाय सीधे संपर्क कर सकते हैं।"],
        ["अपडेट", "वेबसाइट या सेवाओं में बदलाव के साथ यह नीति अपडेट हो सकती है। सबसे नया संस्करण इसी पेज पर रहेगा।"],
      ]
    : [
        ["Information we collect", "When you submit a booking, readiness check or partner enquiry, we may collect your name, phone number, kitchen details, submitted answers and preferred call slot."],
        ["How we use it", "We use this information to respond to enquiries, provide onboarding guidance, manage booked calls and improve our services. We do not sell personal information."],
        ["Storage and sharing", "Information is stored in the configured website database. Service providers may process data only when needed to operate the website, booking process or communications."],
        ["Analytics", "The website may use analytics and advertising tools configured by Menulift. These tools can record interactions and technical data needed for measurement and fraud prevention."],
        ["Your choices", "You may contact us to request correction or deletion of information where applicable. You can also stop using the website or contact us instead of continuing a submission."],
        ["Updates", "This policy may be updated as the website and its services change. The latest version will remain published on this page."],
      ];
  return (
    <>
      <PageHeader title={hi ? "गोपनीयता नीति" : "Privacy Policy"} sub={hi ? "Menulift इस वेबसाइट पर दी गई जानकारी को कैसे संभालता है।" : "How Menulift handles information you submit through this website."} />
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
