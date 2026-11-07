// Pages that are not managed in the admin area (practice areas and FAQ).
export const PRACTICE_AREAS = [
  {
    id: "corporate", group: "Core", name: "Corporate & Commercial Law",
    short: "Company formation, contracts, mergers and shareholder matters.",
    body: [
      "We act for founders, family businesses and listed companies on the legal side of running and growing a business.",
      "We draft and negotiate commercial contracts, advise boards on directors' duties, and guide clients through investments, joint ventures and restructurings.",
    ],
    items: ["Company incorporation and governance", "Shareholder and joint venture agreements", "Mergers, acquisitions and investments", "Commercial contracts and licensing", "Regulatory compliance"],
  },
  {
    id: "litigation", group: "Core", name: "Litigation",
    short: "Court and arbitration representation in civil and commercial disputes.",
    body: [
      "When a dispute cannot be settled, we represent clients before the courts and arbitral tribunals.",
      "We start by assessing your position and costs honestly, then recommend negotiation, mediation or trial based on what you want to achieve.",
    ],
    items: ["Contract and debt recovery disputes", "Shareholder and partnership disputes", "Arbitration and mediation", "Employment and tenancy disputes", "Appeals"],
  },
  {
    id: "property", group: "Core", name: "Conveyancing & Property",
    short: "Buying, selling, financing and developing property.",
    body: [
      "We handle property transactions from the first offer to the transfer of title, and keep you updated at each step.",
      "Our team also advises developers, landlords and lenders on tenancy, financing and strata matters.",
    ],
    items: ["Sale and purchase agreements", "Loan documentation and discharge of charge", "Tenancy and lease agreements", "Strata title and land matters", "Property development"],
  },
  {
    id: "family", group: "Other", name: "Family Law",
    short: "Divorce, custody, maintenance and wills.",
    body: ["We help families through separation and planning with clarity and discretion.", "We advise on divorce, child custody, maintenance, matrimonial assets and wills."],
    items: ["Divorce and separation", "Custody and maintenance", "Matrimonial assets", "Wills and estate planning"],
  },
  {
    id: "employment", group: "Other", name: "Employment Law",
    short: "Advice for employers and employees.",
    body: ["We advise on contracts, restructuring, misconduct inquiries and dismissals, and appear at the Industrial Court."],
    items: ["Employment contracts and policies", "Misconduct inquiries", "Wrongful dismissal claims", "Retrenchment and restructuring"],
  },
  {
    id: "ip", group: "Other", name: "Intellectual Property",
    short: "Trade marks, copyright and brand protection.",
    body: ["We register and enforce trade marks, advise on copyright and licensing, and help businesses protect what they have built."],
    items: ["Trade mark filing and renewal", "Copyright and licensing", "Brand enforcement", "IP clauses in commercial contracts"],
  },
];

export const FAQS = [
  { q: "Do you offer a first consultation?", a: "Yes. Call, email or message us to arrange a first conversation. We will tell you whether we can help and explain how our fees work before you commit." },
  { q: "How much will my matter cost?", a: "Fees depend on the work involved. Conveyancing usually follows a scale of fees, and other matters are quoted as a fixed fee or hourly rate. We give you an estimate in writing." },
  { q: "What should I bring to my first meeting?", a: "Bring your identity document, any contracts or letters about the matter, and a short timeline of events. Do not worry if your papers are incomplete." },
  { q: "Is what I tell you confidential?", a: "Yes. Communications with your lawyer are protected by legal professional privilege and our duty of confidentiality." },
  { q: "Can I contact the firm online instead of visiting?", a: "Yes. We take enquiries by phone and email, and we can hold meetings by video call." },
  { q: "Do you act for clients outside Kuantan and Mentakab?", a: "Yes. We act for clients across Pahang and the rest of Malaysia, and for overseas clients with Malaysian matters." },
];
