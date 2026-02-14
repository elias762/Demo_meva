// ============================================================
// MOCK DATA — Realistische Demo-Daten für Meva Schalungssysteme
// ============================================================

export interface Project {
  id: string;
  name: string;
  typ: string;
  region: string;
  bauvolumen: number; // in Mio. EUR
  geschosse: number;
  betonanteil: number; // Prozent
  wandflaeche: number; // m²
  deckenflaeche: number; // m²
  wandhoehe: number; // m
  bauphase: string;
  bauunternehmen: string;
  betonqualitaet: string;
  bauzeit: number; // Monate
  komplexitaet: "einfach" | "mittel" | "komplex";
}

export interface Customer {
  id: string;
  name: string;
  typ: string;
  region: string;
  umsatzLetztesJahr: number;
  umsatzVorjahr: number;
  projekte: number;
  produkte: string[];
  mietquote: number; // Prozent Mietanteil
  letzterKontakt: string;
  beziehungSeit: number; // Jahr
  serviceFaelle: number;
  zufriedenheit: number; // 1-5
  notizen: string;
}

export const sampleProjects: Project[] = [
  {
    id: "P-2026-001",
    name: "Wohnquartier Neckarpark Stuttgart",
    typ: "Wohnbau",
    region: "Baden-Württemberg",
    bauvolumen: 45,
    geschosse: 8,
    betonanteil: 65,
    wandflaeche: 12000,
    deckenflaeche: 8000,
    wandhoehe: 3.0,
    bauphase: "Ausschreibung",
    bauunternehmen: "Wolff & Müller",
    betonqualitaet: "Sichtbeton",
    bauzeit: 18,
    komplexitaet: "mittel",
  },
  {
    id: "P-2026-002",
    name: "Klinikum Erweiterung Frankfurt",
    typ: "Krankenhaus",
    region: "Hessen",
    bauvolumen: 120,
    geschosse: 12,
    betonanteil: 80,
    wandflaeche: 25000,
    deckenflaeche: 18000,
    wandhoehe: 4.0,
    bauphase: "Planung",
    bauunternehmen: "Züblin",
    betonqualitaet: "Normalbeton",
    bauzeit: 30,
    komplexitaet: "komplex",
  },
  {
    id: "P-2026-003",
    name: "Logistikzentrum A5 Darmstadt",
    typ: "Industrie",
    region: "Hessen",
    bauvolumen: 28,
    geschosse: 2,
    betonanteil: 40,
    wandflaeche: 5000,
    deckenflaeche: 12000,
    wandhoehe: 8.0,
    bauphase: "Rohbau",
    bauunternehmen: "Goldbeck",
    betonqualitaet: "Normalbeton",
    bauzeit: 10,
    komplexitaet: "einfach",
  },
  {
    id: "P-2026-004",
    name: "Autobahnbrücke A81 Heilbronn",
    typ: "Infrastruktur",
    region: "Baden-Württemberg",
    bauvolumen: 65,
    geschosse: 0,
    betonanteil: 90,
    wandflaeche: 8000,
    deckenflaeche: 3000,
    wandhoehe: 12.0,
    bauphase: "Ausschreibung",
    bauunternehmen: "PORR",
    betonqualitaet: "Sichtbeton",
    bauzeit: 24,
    komplexitaet: "komplex",
  },
  {
    id: "P-2026-005",
    name: "Bürokomplex TheSquare Mannheim",
    typ: "Gewerbe",
    region: "Baden-Württemberg",
    bauvolumen: 35,
    geschosse: 6,
    betonanteil: 55,
    wandflaeche: 7000,
    deckenflaeche: 6000,
    wandhoehe: 3.5,
    bauphase: "Planung",
    bauunternehmen: "Bilfinger",
    betonqualitaet: "Sichtbeton",
    bauzeit: 14,
    komplexitaet: "mittel",
  },
];

export const sampleCustomers: Customer[] = [
  {
    id: "K-001",
    name: "Wolff & Müller Bau GmbH",
    typ: "Generalunternehmer",
    region: "Baden-Württemberg",
    umsatzLetztesJahr: 4800000,
    umsatzVorjahr: 3900000,
    projekte: 8,
    produkte: ["Wandschalung", "Deckenschalung"],
    mietquote: 75,
    letzterKontakt: "2026-01-20",
    beziehungSeit: 2018,
    serviceFaelle: 2,
    zufriedenheit: 4,
    notizen:
      "Stammkunde, offen für neue Lösungen. Interesse an Klettersystemen bei Hochhausprojekten geäußert.",
  },
  {
    id: "K-002",
    name: "Züblin AG",
    typ: "Großunternehmen",
    region: "bundesweit",
    umsatzLetztesJahr: 12500000,
    umsatzVorjahr: 11200000,
    projekte: 15,
    produkte: [
      "Wandschalung",
      "Deckenschalung",
      "Klettersystem",
      "Engineering",
    ],
    mietquote: 60,
    letzterKontakt: "2026-02-05",
    beziehungSeit: 2012,
    serviceFaelle: 5,
    zufriedenheit: 4,
    notizen:
      "Key Account. Rahmenvertrag bis 2027. Nutzt bereits breites Produktspektrum.",
  },
  {
    id: "K-003",
    name: "Bauunternehmung Glück GmbH",
    typ: "Mittelstand",
    region: "Baden-Württemberg",
    umsatzLetztesJahr: 1350000,
    umsatzVorjahr: 1850000,
    projekte: 3,
    produkte: ["Wandschalung"],
    mietquote: 90,
    letzterKontakt: "2025-09-18",
    beziehungSeit: 2020,
    serviceFaelle: 1,
    zufriedenheit: 3,
    notizen:
      "Umsatzrückgang. Nur Basis-Wandschalung. Kein Kontakt seit mehreren Monaten.",
  },
  {
    id: "K-004",
    name: "PORR Deutschland GmbH",
    typ: "Großunternehmen",
    region: "bundesweit",
    umsatzLetztesJahr: 6200000,
    umsatzVorjahr: 5100000,
    projekte: 6,
    produkte: ["Wandschalung", "Klettersystem"],
    mietquote: 50,
    letzterKontakt: "2026-01-28",
    beziehungSeit: 2016,
    serviceFaelle: 3,
    zufriedenheit: 4,
    notizen:
      "Wachsender Kunde. Starkes Infrastruktur-Portfolio. Potenzial für Engineering-Dienstleistungen.",
  },
  {
    id: "K-005",
    name: "Reif Baugesellschaft",
    typ: "Mittelstand",
    region: "Bayern",
    umsatzLetztesJahr: 2100000,
    umsatzVorjahr: 1800000,
    projekte: 4,
    produkte: ["Wandschalung", "Deckenschalung"],
    mietquote: 85,
    letzterKontakt: "2025-12-12",
    beziehungSeit: 2021,
    serviceFaelle: 0,
    zufriedenheit: 5,
    notizen:
      "Zufriedener Kunde mit wachsendem Projektvolumen. Keine Sicherheitsplattformen im Einsatz.",
  },
];
