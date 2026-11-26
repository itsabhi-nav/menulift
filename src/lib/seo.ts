/** Content for the search landing pages. Facts here are general; confirm specifics on the call. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://menulift.in";
export const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");

export type Locale = "en" | "hi";

export function visiblePath(locale: Locale, path = "") {
  const cleanPath = path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  return locale === "hi" ? `/hi${cleanPath}` : cleanPath || "/";
}

export function pageAlternates(locale: Locale, path = "") {
  const enPath = path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  return {
    canonical: `${normalizedSiteUrl}${visiblePath(locale, path)}`,
    languages: {
      en: `${normalizedSiteUrl}${enPath || "/"}`,
      hi: `${normalizedSiteUrl}/hi${enPath}`,
      "x-default": `${normalizedSiteUrl}${enPath || "/"}`,
    },
  };
}

export function pageMetadata({
  lang,
  path = "",
  title,
  description,
  hiTitle,
  hiDesc,
}: {
  lang: Locale;
  path?: string;
  title: string;
  description: string;
  hiTitle?: string;
  hiDesc?: string;
}) {
  const hindi = lang === "hi";
  return {
    title: hindi && hiTitle ? hiTitle : title,
    description: hindi && hiDesc ? hiDesc : description,
    alternates: pageAlternates(lang, path),
    openGraph: {
      type: "website",
      locale: hindi ? "hi_IN" : "en_IN",
      alternateLocale: hindi ? ["en_IN"] : ["hi_IN"],
      url: `${normalizedSiteUrl}${visiblePath(lang, path)}`,
      siteName: "Menulift",
      title: hindi && hiTitle ? hiTitle : title,
      description: hindi && hiDesc ? hiDesc : description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Menulift Zomato and Swiggy onboarding" }],
    },
    twitter: {
      card: "summary",
      title: hindi && hiTitle ? hiTitle : title,
      description: hindi && hiDesc ? hiDesc : description,
    },
  };
}

export type SeoDoc = {
  path: string;
  title: string; // under 60 characters
  description: string; // under 155 characters
  h1: string;
  answer: string; // first paragraph: the answer, in 1 to 2 sentences
  steps: { t: string; d: string }[];
  list?: { title: string; items: string[] };
  faqs: { q: string; a: string }[];
  hi?: {
    title: string;
    description: string;
    h1: string;
    answer: string;
    steps: { t: string; d: string }[];
    list?: { title: string; items: string[] };
    faqs: { q: string; a: string }[];
  };
};

export const seoPages: SeoDoc[] = [
  {
    path: "zomato-onboarding",
    title: "Zomato Onboarding Service for Kitchens | Menulift",
    description:
      "Get your kitchen or restaurant live on Zomato. Menulift prepares documents, files the application, follows up and sets up your menu. Free 20-minute call.",
    h1: "Zomato onboarding, done for you",
    answer:
      "Zomato onboarding means getting your FSSAI, bank details, menu and photos approved so your kitchen can take orders. Menulift prepares the documents, files the application, follows up with Zomato and sets up your menu and launch offers.",
    steps: [
      { t: "Check what you have", d: "We look at your FSSAI, PAN, bank proof and menu, and tell you exactly what is missing." },
      { t: "Fix and prepare", d: "We correct name mismatches and format the documents so the application is not sent back." },
      { t: "Apply and follow up", d: "We file on Zomato and chase every query or rejection until it is approved." },
      { t: "Go live with a priced menu", d: "Your menu goes up priced for margin, with launch offers set so the first orders arrive." },
    ],
    faqs: [
      { q: "Is listing on Zomato free?", a: "Yes. Zomato does not charge to list. Menulift charges for its service: documents, applications, follow-ups and menu setup." },
      { q: "How long does Zomato onboarding take?", a: "It depends on how ready your documents are. Our aim is about a week from the point your documents are ready. The free call gives you your own date." },
      { q: "What documents do I need for Zomato?", a: "Usually an FSSAI licence or registration, PAN, bank account proof, and your menu with prices. See the full list on our documents page." },
    ],
    hi: {
      title: "किचन के लिए Zomato ऑनबोर्डिंग सेवा | Menulift",
      description: "Zomato पर अपने किचन या रेस्टोरेंट को लाइव करें। Menulift डॉक्यूमेंट, आवेदन, फॉलो-अप और मेन्यू सेटअप में मदद करता है।",
      h1: "Zomato ऑनबोर्डिंग, हमारी पूरी मदद के साथ",
      answer: "Zomato ऑनबोर्डिंग में FSSAI, बैंक विवरण, मेन्यू और फोटो को सही और मंज़ूर करवाना शामिल है। Menulift डॉक्यूमेंट तैयार करता है, आवेदन करता है, फॉलो-अप करता है और मेन्यू व लॉन्च ऑफर सेट करता है।",
      steps: [
        { t: "तैयारी जाँचें", d: "हम आपका FSSAI, PAN, बैंक प्रूफ और मेन्यू देखते हैं और साफ बताते हैं कि क्या बाकी है।" },
        { t: "डॉक्यूमेंट सुधारें", d: "हम नाम में अंतर ठीक करते हैं और डॉक्यूमेंट सही फॉर्मेट में तैयार करते हैं।" },
        { t: "आवेदन और फॉलो-अप", d: "हम Zomato पर आवेदन करते हैं और हर सवाल या रिजेक्शन की मंज़ूरी तक फॉलो-अप करते हैं।" },
        { t: "मुनाफ़े वाली मेन्यू से लाइव", d: "आपकी मेन्यू मार्जिन के हिसाब से प्राइस और लॉन्च ऑफर के साथ लाइव होती है।" },
      ],
      faqs: [
        { q: "Zomato पर लिस्टिंग मुफ़्त है?", a: "हाँ। Zomato लिस्टिंग का कोई चार्ज नहीं लेता। डॉक्यूमेंट, आवेदन, फॉलो-अप और मेन्यू सेटअप जैसी Menulift की सेवा अलग से चार्ज होती है।" },
        { q: "Zomato ऑनबोर्डिंग में कितना समय लगता है?", a: "यह डॉक्यूमेंट की तैयारी पर निर्भर करता है। डॉक्यूमेंट तैयार होने के बाद हमारा लक्ष्य लगभग एक हफ्ता है।" },
        { q: "Zomato के लिए कौन-से डॉक्यूमेंट चाहिए?", a: "आम तौर पर FSSAI लाइसेंस या रजिस्ट्रेशन, PAN, बैंक अकाउंट प्रूफ और कीमतों वाला मेन्यू चाहिए।" },
      ],
    },
  },
  {
    path: "swiggy-onboarding",
    title: "Swiggy Onboarding Service for Kitchens | Menulift",
    description:
      "Get your kitchen or restaurant live on Swiggy. Menulift handles documents, partner registration, follow-ups and menu setup. Book a free 20-minute call.",
    h1: "Swiggy onboarding, done for you",
    answer:
      "Swiggy partner registration needs your FSSAI, bank details, menu and photos to be correct and consistent. Menulift prepares and files everything, follows up with Swiggy, and gets your menu live and priced to earn.",
    steps: [
      { t: "Readiness review", d: "We check your documents against what Swiggy asks for, kitchen by kitchen." },
      { t: "Partner registration", d: "We fill and file the registration so names, addresses and categories match your licence." },
      { t: "Follow-ups and queries", d: "We handle every question or rejection so the application keeps moving." },
      { t: "Menu and launch", d: "Your menu goes live priced for margin, with launch offers to win the first orders." },
    ],
    faqs: [
      { q: "Is Swiggy partner registration free?", a: "Yes. Swiggy does not charge to list. Menulift charges for its service." },
      { q: "Can I go live on Zomato and Swiggy together?", a: "Yes. We prepare one set of documents and file on both, so you go live on both apps at about the same time." },
      { q: "Why do Swiggy applications get rejected?", a: "Common reasons are name mismatches between licence and listing, unclear photos and wrong categories. We check each one before filing." },
    ],
    hi: {
      title: "किचन के लिए Swiggy ऑनबोर्डिंग सेवा | Menulift",
      description: "Swiggy पर अपने किचन या रेस्टोरेंट को लाइव करें। Menulift डॉक्यूमेंट, पार्टनर रजिस्ट्रेशन, फॉलो-अप और मेन्यू सेटअप संभालता है।",
      h1: "Swiggy ऑनबोर्डिंग, हमारी पूरी मदद के साथ",
      answer: "Swiggy पार्टनर रजिस्ट्रेशन में FSSAI, बैंक विवरण, मेन्यू और फोटो सही और एक जैसे होने चाहिए। Menulift सब तैयारी और आवेदन करता है, फॉलो-अप करता है और मेन्यू लाइव करता है।",
      steps: [
        { t: "रेडीनेस रिव्यू", d: "हम Swiggy की जरूरतों के अनुसार हर किचन के डॉक्यूमेंट देखते हैं।" },
        { t: "पार्टनर रजिस्ट्रेशन", d: "हम नाम, पता और कैटेगरी लाइसेंस के साथ मेल खाते हुए रजिस्ट्रेशन करते हैं।" },
        { t: "फॉलो-अप और जवाब", d: "हम हर सवाल या रिजेक्शन का जवाब देते हैं ताकि आवेदन आगे बढ़े।" },
        { t: "मेन्यू और लॉन्च", d: "मेन्यू मुनाफ़े के हिसाब से प्राइस और पहले ऑर्डर के लिए लॉन्च ऑफर के साथ लाइव होती है।" },
      ],
      faqs: [
        { q: "Swiggy पार्टनर रजिस्ट्रेशन मुफ़्त है?", a: "हाँ। Swiggy लिस्टिंग का अलग से चार्ज नहीं लेता। Menulift की सेवा के लिए शुल्क होता है।" },
        { q: "क्या Zomato और Swiggy दोनों पर एक साथ जा सकते हैं?", a: "हाँ। हम एक तैयारी से दोनों पर आवेदन कर सकते हैं।" },
        { q: "Swiggy आवेदन क्यों रिजेक्ट होता है?", a: "नाम का अंतर, धुंधली फोटो और गलत कैटेगरी आम वजह हैं। हम आवेदन से पहले सब जाँचते हैं।" },
      ],
    },
  },
  {
    path: "documents-for-zomato-swiggy",
    title: "Documents Needed for Zomato and Swiggy | Menulift",
    description:
      "The documents most kitchens need to list on Zomato and Swiggy: FSSAI, PAN, bank proof, GST where applicable, menu and photos. Check yours free.",
    h1: "Documents you need for Zomato and Swiggy",
    answer:
      "Most kitchens need an FSSAI licence or registration, a PAN card, bank account proof, and a menu with prices. Some also need GST details and food photos. Requirements can change, so we confirm yours on the free call.",
    list: {
      title: "The usual checklist",
      items: [
        "FSSAI licence or registration for your kitchen address",
        "PAN card of the owner or business",
        "Bank account proof, such as a cancelled cheque",
        "GST details, where they apply to your business",
        "Your menu with prices and categories",
        "Clear photos of your dishes",
        "Kitchen or restaurant address and contact number",
      ],
    },
    steps: [
      { t: "Take the free quiz", d: "Six questions show what is ready and what is missing for your kitchen type." },
      { t: "We tell you what to fix", d: "Name mismatches and missing papers are the usual reasons for delays." },
      { t: "We prepare and file", d: "Once your documents are right, we file on both apps." },
    ],
    faqs: [
      { q: "Do home kitchens need an FSSAI licence?", a: "A food business selling food generally needs FSSAI registration or a licence, depending on its size. Home kitchens are no exception." },
      { q: "What if my documents have different names?", a: "Name mismatches are a common reason for rejection. We help you correct them before you apply." },
      { q: "Do I need GST?", a: "It depends on your business and turnover. We tell you on the call whether it applies to you." },
    ],
    hi: {
      title: "Zomato और Swiggy के लिए डॉक्यूमेंट | Menulift",
      description: "Zomato और Swiggy पर लिस्ट करने के लिए FSSAI, PAN, बैंक प्रूफ, GST और मेन्यू से जुड़े ज़रूरी डॉक्यूमेंट।",
      h1: "Zomato और Swiggy के लिए ज़रूरी डॉक्यूमेंट",
      answer: "ज्यादातर किचन को FSSAI लाइसेंस या रजिस्ट्रेशन, PAN कार्ड, बैंक अकाउंट प्रूफ और कीमतों वाला मेन्यू चाहिए। कुछ मामलों में GST और स्पष्ट फूड फोटो भी चाहिए।",
      list: {
        title: "सामान्य चेकलिस्ट",
        items: ["किचन पते के लिए FSSAI लाइसेंस या रजिस्ट्रेशन", "मालिक या बिज़नेस का PAN कार्ड", "बैंक अकाउंट प्रूफ, जैसे कैंसिल चेक", "बिज़नेस पर लागू GST विवरण", "कीमतों और कैटेगरी वाला मेन्यू", "डिश की साफ तस्वीरें", "किचन या रेस्टोरेंट का पता और संपर्क नंबर"],
      },
      steps: [
        { t: "फ्री क्विज़ लें", d: "छह सवालों से पता चलता है कि आपके किचन में क्या तैयार है और क्या बाकी है।" },
        { t: "सुधार बताएं", d: "नाम का अंतर और कागज़ की कमी आम देरी की वजह हैं।" },
        { t: "तैयारी और आवेदन", d: "डॉक्यूमेंट सही होने के बाद हम दोनों ऐप पर आवेदन करते हैं।" },
      ],
      faqs: [
        { q: "होम किचन को FSSAI चाहिए?", a: "भोजन बेचने वाले खाद्य व्यवसाय को आम तौर पर आकार के अनुसार FSSAI रजिस्ट्रेशन या लाइसेंस चाहिए।" },
        { q: "डॉक्यूमेंट में नाम अलग है?", a: "नाम का अंतर रिजेक्शन की आम वजह है। आवेदन से पहले हम इसे सुधारने में मदद करते हैं।" },
        { q: "क्या GST चाहिए?", a: "यह आपके बिज़नेस और टर्नओवर पर निर्भर करता है। फ्री कॉल में हम इसकी स्थिति बताते हैं।" },
      ],
    },
  },
  {
    path: "fssai-for-cloud-kitchen",
    title: "FSSAI for Cloud Kitchens and Home Kitchens | Menulift",
    description:
      "Do you need FSSAI for a cloud kitchen or home kitchen? What it is, why Zomato and Swiggy ask for it, and how Menulift helps you get live.",
    h1: "FSSAI for cloud kitchens and home kitchens",
    answer:
      "FSSAI is the food safety licence or registration that Zomato and Swiggy ask every kitchen for. Whether you need a registration or a licence depends on the size of your business, and it must match the address you list.",
    steps: [
      { t: "Know which one you need", d: "Registration or licence depends on your business size. We help you work out which applies." },
      { t: "Match it to your listing", d: "Your kitchen name and address on FSSAI should match your Zomato and Swiggy listing." },
      { t: "Keep it valid", d: "Platforms can pause listings if the licence lapses, so keep your renewal date in view." },
    ],
    faqs: [
      { q: "Is FSSAI mandatory for Zomato and Swiggy?", a: "Yes. Both platforms ask for an FSSAI licence or registration before a kitchen can go live." },
      { q: "Does Menulift apply for my FSSAI?", a: "We guide you on the right type and check your documents. Ask us on the free call how we can help in your case." },
      { q: "Can I start with a home kitchen?", a: "Yes, many owners do. You still need the right FSSAI document for your kitchen." },
    ],
    hi: {
      title: "क्लाउड और होम किचन के लिए FSSAI | Menulift",
      description: "क्लाउड या होम किचन के लिए FSSAI चाहिए या नहीं, और Zomato और Swiggy पर लाइव होने में किस तरह मदद मिलती है?",
      h1: "क्लाउड और होम किचन के लिए FSSAI",
      answer: "FSSAI वह फूड सेफ्टी लाइसेंस या रजिस्ट्रेशन है जो Zomato और Swiggy हर किचन से मांगते हैं। बिज़नेस के आकार के अनुसार रजिस्ट्रेशन या लाइसेंस लगता है और वह लिस्ट किए गए पते से मेल खाना चाहिए।",
      steps: [
        { t: "कौन-सा विकल्प चाहिए", d: "बिज़नेस के आकार के अनुसार रजिस्ट्रेशन या लाइसेंस तय होता है।" },
        { t: "लिस्टिंग से मिलाएँ", d: "FSSAI पर किचन का नाम और पता Zomato और Swiggy लिस्टिंग से मेल खाना चाहिए।" },
        { t: "वैधता बनाए रखें", d: "लाइसेंस खत्म होने पर लिस्टिंग रुकी जा सकती है, इसलिए रिन्यूअल तारीख ध्यान में रखें।" },
      ],
      faqs: [
        { q: "Zomato और Swiggy के लिए FSSAI अनिवार्य है?", a: "हाँ। दोनों प्लेटफॉर्म किचन के लाइव होने से पहले FSSAI लाइसेंस या रजिस्ट्रेशन मांगते हैं।" },
        { q: "क्या Menulift मेरा FSSAI करवाता है?", a: "हम सही प्रकार चुनने और डॉक्यूमेंट जाँचने में मार्गदर्शन करते हैं।" },
        { q: "क्या होम किचन से शुरुआत हो सकती है?", a: "हाँ। कई मालिक होम किचन से शुरू करते हैं, बस सही FSSAI डॉक्यूमेंट होना चाहिए।" },
      ],
    },
  },
];

export function seoMetadata(doc: SeoDoc, lang: Locale = "en") {
  const hi = lang === "hi" ? doc.hi : undefined;
  return pageMetadata({
    lang,
    path: doc.path,
    title: hi?.title ?? doc.title,
    description: hi?.description ?? doc.description,
    hiTitle: hi?.title,
    hiDesc: hi?.description,
  });
}
