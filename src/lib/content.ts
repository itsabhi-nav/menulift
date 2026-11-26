/**
 * Single source of truth for editable copy, numbers and contact details.
 * Anything marked PLACEHOLDER must be replaced with a real figure, a real
 * name or a client's permission before launch.
 */

export const site = {
  name: "Menulift",
  ctaLabel: "Book a free call",
  ctaHref: "/book",
  bookLabel: "Book my free call",
  quizLabel: "Find out what your kitchen needs",
  quizHint: "Starting or growing a food business? Answer 6 quick questions and see exactly what you still need before you can go live.",
  quizHref: "/check",
  whatsappNumber: "919876543210", // PLACEHOLDER: digits only, with country code
  whatsappMessage: "Hi Menulift, I want to get my kitchen live on Zomato and Swiggy.",
  email: "hello@menulift.in", // PLACEHOLDER
  phoneDisplay: "+91 98765 43210", // PLACEHOLDER
};

/** Live booking slots: one booking per slot, in IST. Edit these to change the schedule. */
export const bookingConfig = {
  startMinutes: 18 * 60 + 30, // 6:30 PM
  endMinutes: 21 * 60, // 9:00 PM
  callMinutes: 20,
  bufferMinutes: 0, // calls run back to back
  daysShown: 3, // the next days that still have a free slot; there is no end date
  minLeadMinutes: 30, // a slot closes this long before it starts
  closedWeekdays: [0], // 0 = Sunday
};

export const scarcity = {
  spotsLeft: 7, // update weekly to match real call capacity
  windowHours: 3,
  label: "Free Go-Live Calls this week",
};

export const hero = {
  badge: "India's No.1 Zomato and Swiggy onboarding partner",
  headline: "Get live on Zomato and Swiggy in days, not weeks.",
  copy:
    "Start earning sooner. We handle your FSSAI, documents, applications and menu, so your kitchen takes its first orders without the wait.",
  microcopy: "Free, 20 minutes, no payment needed",
  proof: [
    { value: "200+", label: "outlets live" }, // PLACEHOLDER
    { value: "7 days", label: "average to go live" }, // PLACEHOLDER
    { value: "4.9", label: "Google rating" }, // PLACEHOLDER
  ],
};

// PLACEHOLDER numbers: replace with real figures before launch.
export const stats = [
  { to: 200, suffix: "+", label: "outlets live" },
  { to: 7, suffix: " days", label: "average to go live" },
  { to: 50, suffix: "%+", label: "average order growth" },
  { to: 4.9, decimals: 1, suffix: "", label: "Google rating" },
];

export const checklist = [
  "FSSAI licence",
  "Menu and pricing",
  "Photos and descriptions",
  "Bank account verified",
  "Zomato approval",
  "Swiggy approval",
];

export const marquee = [
  "FSSAI licence",
  "Zomato onboarding",
  "Swiggy onboarding",
  "Menu pricing",
  "Food photography",
  "Launch offers",
  "GST guidance",
  "Payout setup",
];

export const audiences = [
  {
    key: "home",
    name: "Home kitchen",
    pain: "Orders only come from word of mouth, and the paperwork for the apps feels out of reach.",
    outcome: "FSSAI sorted and live on both apps, straight from your own kitchen.",
    cta: "See what my home kitchen needs",
  },
  {
    key: "cloud",
    name: "Cloud kitchen",
    pain: "You are paying rent and staff, but listings are slow, buried or still pending.",
    outcome: "Both listings live, menu priced for margin, ready for the dinner rush.",
    cta: "See what my cloud kitchen needs",
  },
  {
    key: "restaurant",
    name: "New restaurant",
    pain: "Every week without online orders is sales you never get back.",
    outcome: "Open with your listing, menu and launch offers ready on day one.",
    cta: "See what my restaurant needs",
  },
];

export const problems = {
  title: "Why onboarding goes wrong",
  intro:
    "Most owners don't fail because the platforms say no. They lose weeks to small, avoidable mistakes.",
};

export const steps = [
  {
    title: "Free call and kitchen check",
    who: "You and Anshuman",
    time: "20 minutes",
    text: "Tell us about your kitchen. We go through a short check, tell you what is missing, and give you a fixed price and a go-live date.",
  },
  {
    title: "Documents",
    who: "You share, we prepare",
    time: "1 to 3 days",
    text: "We tell you which documents you need, check each one and fix errors before anything is submitted.",
  },
  {
    title: "Applications on both platforms",
    who: "Menulift",
    time: "3 to 5 days",
    text: "We file and follow up with Zomato and Swiggy, and handle every rejection or query.",
  },
  {
    title: "Live with menu and launch offers",
    who: "Menulift",
    time: "Around day 7",
    text: "Your menu goes up priced for margin, with launch offers set so the first orders arrive.",
  },
];

export const compare = {
  without: [
    "No idea which documents Zomato and Swiggy actually need",
    "Applications bounce back with unclear reasons",
    "Weeks pass with nobody to chase the platforms",
    "Menu priced by guesswork, so orders lose money",
    "No launch offers, so the first orders never come",
    "Googling answers at midnight",
  ],
  with: [
    "A checklist built for your kitchen type, on day one",
    "Every document checked before it is submitted",
    "We follow up with both platforms until you are live",
    "Menu priced so each order earns a margin",
    "Launch offers set up so orders start flowing",
    "One person who answers on WhatsApp",
  ],
};

// PLACEHOLDER stories: replace with real outlets, photos and permission.
export const stories = [
  {
    outlet: "Amma's Tiffin",
    type: "Home kitchen",
    city: "Pune",
    days: 9,
    quote:
      "I thought the paperwork would take months. It took nine days, and my first order came the same evening.",
    name: "Priya Nair",
  },
  {
    outlet: "Crave Box",
    type: "Cloud kitchen",
    city: "Delhi",
    days: 6,
    quote:
      "They fixed our menu pricing before we even listed. We stopped losing money per order.",
    name: "Karan Malhotra",
  },
  {
    outlet: "Spice Route",
    type: "New restaurant",
    city: "Mumbai",
    days: 8,
    quote:
      "We opened our doors and our online listing on the same week. Nothing was left pending.",
    name: "Farhan Sheikh",
  },
];
export const videoUrl = ""; // add a YouTube embed URL to show a video tile

export const guaranteeDays = 10; // PLACEHOLDER: the client decides the go-live promise

// PLACEHOLDER prices: the client decides before launch.
export const offers = [
  {
    name: "Go-Live Kit",
    price: "₹4,999",
    blurb: "For owners who want to file it themselves with expert guidance.",
    items: [
      "Document checklist for your kitchen type",
      "Application walkthrough for both apps",
      "Menu and pricing guide",
      "One review call",
    ],
    cta: "Book a free call",
  },
  {
    name: "Done-for-You Onboarding",
    price: "₹14,999",
    blurb: "We do everything. You cook, we get you live.",
    highlight: true,
    items: [
      "Document checks and corrections",
      "Applications filed on Zomato and Swiggy",
      "Rejections and queries handled",
      "Menu uploaded and priced for margin",
      "Launch offers configured",
    ],
    cta: "Book a free call",
  },
  {
    name: "Launch Sprint",
    price: "₹24,999",
    blurb: "Onboarding plus 30 days of hands-on launch support.",
    items: [
      "Everything in Done-for-You",
      "Photo and description direction",
      "Weekly offer and ranking review",
      "Payout and take-rate review at day 30",
    ],
    cta: "Book a free call",
  },
];

// PLACEHOLDER: replace the name, bio and photo.
export const founder = {
  name: "Anshuman",
  role: "Founder of Menulift",
  photo: "", // e.g. "/founder.jpg" placed in /public
  linkedin: "", // PLACEHOLDER: full LinkedIn profile URL
  headline: "I help kitchens go live and earn.",
  bio: [
    "I've worked closely with home chefs, cloud kitchens and new restaurants who were stuck in the same loop: paperwork, rejections and silence from the platforms.",
    "My focus is simple: get you live quickly, priced properly, with real orders coming in. No jargon, no guesswork.",
  ],
};

// PLACEHOLDER testimonials: replace with real ones and get permission.
export const testimonials = [
  {
    name: "Sumit Chandra",
    role: "Cloud kitchen owner, Pune",
    metric: "Menu score 54 to 91",
    quote:
      "Menulift completely changed how my cloud kitchen appears on Zomato. My menu score jumped from 54 to 91 in under a week and orders followed immediately.",
  },
  {
    name: "Ritika Kapoor",
    role: "Home chef, Delhi",
    metric: "Revenue doubled in 30 days",
    quote:
      "I was spending on ads blindly with zero return. The issue was diagnosed in the first call. Within 30 days my monthly revenue had doubled.",
  },
  {
    name: "Arjun Mehta",
    role: "Restaurant owner, Mumbai",
    metric: "Order value up 40%",
    quote:
      "The menu work alone was worth every rupee. Every dish was repositioned, re-described and repriced. My average order value went up 40%.",
  },
];

export const faqs = [
  {
    q: "Is listing on Zomato and Swiggy free?",
    a: "Yes. The platforms do not charge to list. Menulift charges for its service: documents, applications, follow-ups and menu setup.",
  },
  {
    q: "How long does Zomato onboarding take?",
    a: "With documents in order, most kitchens go live in about a week. Without help, owners often lose three to six weeks to rejections and resubmissions.",
  },
  {
    q: "Which documents do I need?",
    a: "Usually an FSSAI licence or registration, PAN, bank account details, a menu with prices, and photos. The Readiness Check tells you exactly what applies to your kitchen.",
  },
  {
    q: "Can a home kitchen get onto Zomato and Swiggy?",
    a: "Yes, as long as you have the required food licence and your kitchen meets platform rules. We guide home chefs through each step.",
  },
  {
    q: "What happens on the free Go-Live Call?",
    a: "In 20 minutes we review your checklist, tell you exactly what is missing, and give you a fixed price and go-live date.",
  },
  {
    q: "What if I'm not ready to book yet?",
    a: "Take the Readiness Check anyway. We can send your checklist on WhatsApp, and share a useful tip each month until you are ready.",
  },
  {
    q: "Do you work in my city?",
    a: "We work with kitchens across India. Tell us your city in the Readiness Check and we will confirm on WhatsApp.",
  },
];

export const quiz = [
  {
    id: "type",
    title: "What kind of kitchen are you?",
    options: [
      { value: "home", label: "Home kitchen", score: 0 },
      { value: "cloud", label: "Cloud kitchen", score: 0 },
      { value: "restaurant", label: "New restaurant", score: 0 },
    ],
  },
  {
    id: "fssai",
    title: "Do you have an FSSAI licence or registration?",
    options: [
      { value: "yes", label: "Yes, it's valid", score: 25 },
      { value: "applied", label: "I've applied", score: 10 },
      { value: "no", label: "No, not yet", score: 0 },
    ],
    missing: "FSSAI licence or registration",
  },
  {
    id: "bank",
    title: "Is your bank account and PAN in the business name?",
    options: [
      { value: "yes", label: "Yes", score: 20 },
      { value: "personal", label: "Only personal", score: 8 },
      { value: "no", label: "Not sure", score: 0 },
    ],
    missing: "Business bank account and PAN",
  },
  {
    id: "menu",
    title: "Is your menu ready, with prices and photos?",
    options: [
      { value: "yes", label: "Ready", score: 20 },
      { value: "partly", label: "Partly", score: 10 },
      { value: "no", label: "Not yet", score: 0 },
    ],
    missing: "Menu with prices and photos",
  },
  {
    id: "gst",
    title: "Do you have a GST registration, if you need one?",
    options: [
      { value: "yes", label: "Yes", score: 15 },
      { value: "na", label: "Not required for me", score: 15 },
      { value: "no", label: "No, and I may need it", score: 0 },
    ],
    missing: "GST registration",
  },
  {
    id: "listed",
    title: "Are you listed on Zomato or Swiggy already?",
    options: [
      { value: "both", label: "Both", score: 20 },
      { value: "one", label: "One of them", score: 10 },
      { value: "none", label: "Neither", score: 0 },
    ],
    missing: "Listing on both platforms",
  },
] as const;
