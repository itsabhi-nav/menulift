/** Content for the search landing pages. Facts here are general; confirm specifics on the call. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://menulift.in";

export type SeoDoc = {
  path: string;
  title: string; // under 60 characters
  description: string; // under 155 characters
  h1: string;
  answer: string; // first paragraph: the answer, in 1 to 2 sentences
  steps: { t: string; d: string }[];
  list?: { title: string; items: string[] };
  faqs: { q: string; a: string }[];
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
  },
];

export function seoMetadata(doc: SeoDoc) {
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `${siteUrl}/${doc.path}` },
  };
}
