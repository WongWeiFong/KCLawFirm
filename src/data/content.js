export const FIRM = "Tan & Rahman";
export const FULL = "Tan & Rahman Advocates & Solicitors";

export const CONTACT = {
  phone: "+60 3-1234 5678",
  tel: "+60312345678",
  email: "hello@tanrahman.example",
  whatsapp: "60123456789",
  address: ["Level 18, Menara Contoh", "Jalan Sultan Ismail", "50250 Kuala Lumpur, Malaysia"],
  hours: "Monday to Friday, 9:00 am to 6:00 pm",
  mapQuery: "Jalan Sultan Ismail, Kuala Lumpur",
};

export const PRACTICE_AREAS = [
  {
    id: "corporate",
    group: "Core",
    name: "Corporate & Commercial Law",
    short: "Company formation, contracts, mergers and shareholder matters.",
    body: [
      "We act for founders, family businesses and listed companies on the legal side of running and growing a business.",
      "We draft and negotiate commercial contracts, advise boards on directors' duties, and guide clients through investments, joint ventures and restructurings.",
    ],
    items: ["Company incorporation and governance", "Shareholder and joint venture agreements", "Mergers, acquisitions and investments", "Commercial contracts and licensing", "Regulatory compliance"],
  },
  {
    id: "litigation",
    group: "Core",
    name: "Litigation",
    short: "Court and arbitration representation in civil and commercial disputes.",
    body: [
      "When a dispute cannot be settled, we represent clients before the High Court, the Court of Appeal and arbitral tribunals.",
      "We start by assessing your position and costs honestly, then recommend negotiation, mediation or trial based on what you want to achieve.",
    ],
    items: ["Contract and debt recovery disputes", "Shareholder and partnership disputes", "Arbitration and mediation", "Employment and tenancy disputes", "Appeals"],
  },
  {
    id: "property",
    group: "Core",
    name: "Conveyancing & Property",
    short: "Buying, selling, financing and developing property.",
    body: [
      "We handle property transactions from the first offer to the transfer of title, and keep you updated at each step.",
      "Our team also advises developers, landlords and lenders on tenancy, financing and strata matters.",
    ],
    items: ["Sale and purchase agreements", "Loan documentation and discharge of charge", "Tenancy and lease agreements", "Strata title and land matters", "Property development"],
  },
  {
    id: "family",
    group: "Other",
    name: "Family Law",
    short: "Divorce, custody, maintenance and wills.",
    body: [
      "We help families through separation and planning with clarity and discretion.",
      "We advise on divorce, child custody, maintenance, matrimonial assets and wills.",
    ],
    items: ["Divorce and separation", "Custody and maintenance", "Matrimonial assets", "Wills and estate planning"],
  },
  {
    id: "employment",
    group: "Other",
    name: "Employment Law",
    short: "Advice for employers and employees.",
    body: ["We advise on contracts, restructuring, misconduct inquiries and dismissals, and appear at the Industrial Court."],
    items: ["Employment contracts and policies", "Misconduct inquiries", "Wrongful dismissal claims", "Retrenchment and restructuring"],
  },
  {
    id: "ip",
    group: "Other",
    name: "Intellectual Property",
    short: "Trade marks, copyright and brand protection.",
    body: ["We register and enforce trade marks, advise on copyright and licensing, and help businesses protect what they have built."],
    items: ["Trade mark filing and renewal", "Copyright and licensing", "Brand enforcement", "IP clauses in commercial contracts"],
  },
];

export const LAWYERS = [
  {
    id: "aisyah-rahman",
    name: "Aisyah Rahman",
    role: "Managing Partner",
    area: "Corporate & Commercial Law",
    practiceId: "corporate",
    years: 22,
    bio: [
      "Aisyah leads the firm's corporate practice. She advises owner-managed businesses and regional groups on investments, governance and succession.",
      "She is admitted to the Malaysian Bar and sits on the firm's management committee.",
    ],
    education: ["LL.B. (Hons), University of Malaya", "Certificate in Legal Practice"],
  },
  {
    id: "david-tan",
    name: "David Tan",
    role: "Senior Partner",
    area: "Litigation",
    practiceId: "litigation",
    years: 19,
    bio: [
      "David represents clients in commercial disputes and arbitration, with a focus on shareholder and construction matters.",
      "He regularly appears before the High Court and the Court of Appeal.",
    ],
    education: ["LL.B. (Hons), University of London", "Barrister-at-Law, Lincoln's Inn"],
  },
  {
    id: "nurul-hana",
    name: "Nurul Hana Ismail",
    role: "Partner",
    area: "Conveyancing & Property",
    practiceId: "property",
    years: 14,
    bio: [
      "Nurul Hana acts for buyers, developers and banks on residential and commercial property transactions.",
      "She is known for explaining each document in plain terms before clients sign.",
    ],
    education: ["LL.B. (Hons), International Islamic University Malaysia"],
  },
  {
    id: "kevin-lee",
    name: "Kevin Lee",
    role: "Associate",
    area: "Employment & Intellectual Property",
    practiceId: "employment",
    years: 6,
    bio: ["Kevin advises employers on workplace policy and helps start-ups protect their brands."],
    education: ["LL.B. (Hons), Multimedia University"],
  },
];

export const ARTICLES = [
  {
    id: "buying-first-home",
    category: "Property",
    title: "Buying your first home: the legal steps in order",
    date: "12 October 2026",
    readTime: "5 min",
    summary: "What happens between signing the offer and receiving the keys.",
    body: [
      "A property purchase has several legal stages. Knowing them early prevents delays and surprises.",
      "First, you pay a booking fee and sign a sale and purchase agreement. Your lawyer checks the title, searches for encumbrances and confirms the seller can transfer it.",
      "Next comes financing. Your bank issues a letter of offer and your lawyer prepares the loan agreement and charge. Stamp duty is paid before the transfer is registered.",
      "Finally, the balance is released and vacant possession is handed over. Keep all signed copies in one safe place.",
    ],
  },
  {
    id: "shareholder-agreements",
    category: "Corporate",
    title: "Why every private company needs a shareholders' agreement",
    date: "28 September 2026",
    readTime: "4 min",
    summary: "The company constitution is not enough when owners disagree.",
    body: [
      "A constitution sets out how a company runs. A shareholders' agreement sets out how the owners deal with each other.",
      "It can cover how decisions are made, what happens if a shareholder leaves, and how shares are valued and sold.",
      "Agreeing these terms when relations are good is far cheaper than arguing about them later.",
    ],
  },
  {
    id: "dispute-options",
    category: "Litigation",
    title: "Court, arbitration or mediation: choosing how to resolve a dispute",
    date: "9 September 2026",
    readTime: "6 min",
    summary: "A short comparison of cost, speed and privacy.",
    body: [
      "Court judgments are public, binding and can be appealed. They suit disputes where precedent or enforcement powers matter.",
      "Arbitration is private and decided by an expert you help choose. It is often faster, but fees can be high.",
      "Mediation is non-binding and cheapest. If it works, both sides keep control of the outcome. Many contracts require you to try it first.",
    ],
  },
  {
    id: "employment-contracts",
    category: "Employment",
    title: "Five clauses to check in your employment contract",
    date: "21 August 2026",
    readTime: "3 min",
    summary: "Probation, notice, restraint, confidentiality and termination.",
    body: [
      "Read the probation period and the notice required from each side.",
      "Check any restraint-of-trade clause. Malaysian courts do not enforce clauses that unreasonably limit your right to work.",
      "Confirm confidentiality duties and how bonuses and benefits are described. Ask for changes in writing before you sign.",
    ],
  },
];

export const FAQS = [
  { q: "Do you offer a first consultation?", a: "Yes. Call, email or message us on WhatsApp to arrange a first conversation. We will tell you whether we can help and explain how our fees work before you commit." },
  { q: "How much will my matter cost?", a: "Fees depend on the work involved. Conveyancing usually follows a scale of fees, and other matters are quoted as a fixed fee or hourly rate. We give you an estimate in writing." },
  { q: "What should I bring to my first meeting?", a: "Bring your identity document, any contracts or letters about the matter, and a short timeline of events. Do not worry if your papers are incomplete." },
  { q: "Is what I tell you confidential?", a: "Yes. Communications with your lawyer are protected by legal professional privilege and our duty of confidentiality." },
  { q: "Can I contact the firm online instead of visiting?", a: "Yes. We take enquiries by phone, email and WhatsApp, and we can hold meetings by video call." },
  { q: "Do you act for clients outside Kuala Lumpur?", a: "Yes. We act for clients across Malaysia and for overseas clients with Malaysian matters." },
];
