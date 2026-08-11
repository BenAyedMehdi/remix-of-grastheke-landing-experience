// DUMMY-CONTENT — Platzhalterdaten, keine echten Standorte/Produkte.
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import cityBerlin from "@/assets/city-berlin.jpg";
import cityHamburg from "@/assets/city-hamburg.jpg";
import cityKoeln from "@/assets/city-koeln.jpg";
import cityMuenchen from "@/assets/city-muenchen.jpg";
import cityLeipzig from "@/assets/city-leipzig.jpg";

export const SHOP_BASE_URL = "https://shop.grastheke.de/produkt";

export type Location = {
  id: string;
  city: string;
  pharmacy: string;
  street: string;
  zip: string;
  hours: string;
  phone: string;
  image: string;
};

export const locations: Location[] = [
  {
    id: "berlin",
    city: "Berlin",
    pharmacy: "Grastheke Partnerapotheke Mitte",
    street: "Beispielstraße 12",
    zip: "10115",
    hours: "Mo–Fr 09–19 Uhr, Sa 10–14 Uhr",
    phone: "+49 30 000000",
    image: cityBerlin,
  },
  {
    id: "hamburg",
    city: "Hamburg",
    pharmacy: "Grastheke Partnerapotheke Altona",
    street: "Musterallee 4",
    zip: "22765",
    hours: "Mo–Fr 08:30–18:30 Uhr",
    phone: "+49 40 000000",
    image: cityHamburg,
  },
  {
    id: "koeln",
    city: "Köln",
    pharmacy: "Grastheke Partnerapotheke Ehrenfeld",
    street: "Platzhalterweg 88",
    zip: "50823",
    hours: "Mo–Fr 09–18:30 Uhr, Sa 10–13 Uhr",
    phone: "+49 221 000000",
    image: cityKoeln,
  },
  {
    id: "muenchen",
    city: "München",
    pharmacy: "Grastheke Partnerapotheke Sendling",
    street: "Demostraße 27",
    zip: "81371",
    hours: "Mo–Fr 09–19 Uhr",
    phone: "+49 89 000000",
    image: cityMuenchen,
  },
  {
    id: "leipzig",
    city: "Leipzig",
    pharmacy: "Grastheke Partnerapotheke Süd",
    street: "Beispielring 3",
    zip: "04275",
    hours: "Mo–Fr 08–18 Uhr",
    phone: "+49 341 000000",
    image: cityLeipzig,
  },
];

export type Product = {
  slug: string;
  name: string;
  genetics: "Indica" | "Sativa" | "Hybrid";
  profile: "Entspannung" | "Fokus" | "Energie";
  thc: string;
  cbd: string;
  image: string;
  short: string;
  description: string;
  terpenes: { name: string; note: string }[];
  origin: string;
  irradiation: string;
};

export const products: Product[] = [
  {
    slug: "nachtflor-22",
    name: "Nachtflor 22",
    genetics: "Indica",
    profile: "Entspannung",
    thc: "20–24 %",
    cbd: "< 1 %",
    image: product1,
    short: "Ruhiges Profil, abendliche Anwendung",
    description:
      "Platzhaltertext: Indica-dominante Blüte mit dichter Struktur und erdig-süßem Aroma. Wird in der Praxis vor allem bei abendlicher Anwendung eingesetzt.",
    terpenes: [
      { name: "Myrcen", note: "erdig, krautig" },
      { name: "Linalool", note: "floral" },
      { name: "Caryophyllen", note: "pfeffrig" },
    ],
    origin: "EU-GMP, Portugal (Platzhalter)",
    irradiation: "Beta-bestrahlt",
  },
  {
    slug: "klarfeld-18",
    name: "Klarfeld 18",
    genetics: "Sativa",
    profile: "Fokus",
    thc: "16–19 %",
    cbd: "< 1 %",
    image: product2,
    short: "Klares Profil für den Tag",
    description:
      "Platzhaltertext: Sativa-dominante Genetik mit zitrischem Terpenprofil. Wird häufig für die Anwendung tagsüber gewählt.",
    terpenes: [
      { name: "Limonen", note: "zitrisch" },
      { name: "Terpinolen", note: "frisch" },
      { name: "Pinen", note: "harzig" },
    ],
    origin: "EU-GMP, Kanada (Platzhalter)",
    irradiation: "Unbestrahlt",
  },
  {
    slug: "weissharz-26",
    name: "Weißharz 26",
    genetics: "Hybrid",
    profile: "Entspannung",
    thc: "24–27 %",
    cbd: "< 1 %",
    image: product3,
    short: "Hoher THC-Gehalt, ausgewogenes Profil",
    description:
      "Platzhaltertext: Hybride Genetik mit sehr dichtem Trichombesatz und ausgewogenem Wirkprofil. Für erfahrene Patientinnen und Patienten.",
    terpenes: [
      { name: "Caryophyllen", note: "würzig" },
      { name: "Humulen", note: "hopfig" },
      { name: "Myrcen", note: "erdig" },
    ],
    origin: "EU-GMP, Dänemark (Platzhalter)",
    irradiation: "Beta-bestrahlt",
  },
  {
    slug: "bernstein-14",
    name: "Bernstein 14",
    genetics: "Sativa",
    profile: "Energie",
    thc: "12–15 %",
    cbd: "1–2 %",
    image: product4,
    short: "Milder Einstieg, warmes Aroma",
    description:
      "Platzhaltertext: Moderater THC-Gehalt mit leicht erhöhtem CBD-Anteil. Häufig für den Therapiebeginn oder eine niedrige Dosierung gewählt.",
    terpenes: [
      { name: "Pinen", note: "nadelig" },
      { name: "Limonen", note: "zitrisch" },
      { name: "Ocimen", note: "süßlich" },
    ],
    origin: "EU-GMP, Portugal (Platzhalter)",
    irradiation: "Unbestrahlt",
  },
];

export type DropCategory = "Neu" | "Restock" | "News";

export type Drop = {
  id: string;
  title: string;
  teaser: string;
  date: string;
  category: DropCategory;
  image: string;
};

export const drops: Drop[] = [
  {
    id: "d1",
    title: "Neue Genetik verfügbar: Weißharz 26",
    teaser:
      "Ab sofort in allen Partnerapotheken bestellbar. Chargenanalyse liegt vor.",
    date: "12.08.2026",
    category: "Neu",
    image: news1,
  },
  {
    id: "d2",
    title: "Lieferung KW 34: Klarfeld 18",
    teaser: "Restock nach Lieferengpass – Verfügbarkeit standortabhängig.",
    date: "05.08.2026",
    category: "Restock",
    image: news2,
  },
  {
    id: "d3",
    title: "Hinweise zur Rezeptübermittlung",
    teaser:
      "E-Rezept und Papierrezept: Was Patientinnen und Patienten beachten sollten.",
    date: "28.07.2026",
    category: "News",
    image: news3,
  },
  {
    id: "d4",
    title: "Neuer Standort in Leipzig",
    teaser: "Unsere fünfte Partnerapotheke nimmt den Betrieb auf.",
    date: "14.07.2026",
    category: "News",
    image: news1,
  },
];