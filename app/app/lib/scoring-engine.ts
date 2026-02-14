// ============================================================
// SCORING & KALKULATIONS-ENGINE — Demo-Logik für Meva
// ============================================================

import type { Project, Customer } from "./mock-data";

// ---- Lead Scoring ----

export interface LeadScore {
  opportunityScore: number;
  umsatzpotenzialMin: number;
  umsatzpotenzialMax: number;
  abschlusswahrscheinlichkeit: number;
  strategischeRelevanz: "hoch" | "mittel" | "niedrig";
  begruendung: string[];
  empfehlung: "Sofort bearbeiten" | "Beobachten" | "Nicht priorisieren";
  annahmen: string[];
}

export function scoreProject(project: Project): LeadScore {
  let score = 0;
  const begruendung: string[] = [];
  const annahmen: string[] = [];

  // Relevanz für Schalungssysteme (0-30)
  if (project.betonanteil >= 70) {
    score += 25;
    begruendung.push(
      `Sehr hoher Betonanteil (${project.betonanteil}%) — starker Schalungsbedarf`
    );
  } else if (project.betonanteil >= 50) {
    score += 15;
    begruendung.push(
      `Solider Betonanteil (${project.betonanteil}%) — guter Schalungsbedarf`
    );
  } else {
    score += 5;
    begruendung.push(
      `Geringer Betonanteil (${project.betonanteil}%) — begrenzter Schalungsbedarf`
    );
  }

  // Projektgröße (0-25)
  if (project.wandflaeche > 15000) {
    score += 25;
    begruendung.push(
      `Große Wandfläche (${project.wandflaeche.toLocaleString("de-DE")} m²) — hoher Materialeinsatz`
    );
  } else if (project.wandflaeche > 5000) {
    score += 15;
    begruendung.push(
      `Mittlere Wandfläche (${project.wandflaeche.toLocaleString("de-DE")} m²)`
    );
  } else {
    score += 5;
  }

  // Komplexität & Sonderlösungen (0-15)
  if (
    project.komplexitaet === "komplex" ||
    project.wandhoehe > 6 ||
    project.betonqualitaet === "Sichtbeton"
  ) {
    score += 15;
    if (project.wandhoehe > 6)
      begruendung.push(
        `Große Wandhöhe (${project.wandhoehe} m) — Klettersystem/Sonderlösung erforderlich`
      );
    if (project.betonqualitaet === "Sichtbeton")
      begruendung.push("Sichtbeton erfordert Premium-Schalungssysteme");
  } else if (project.komplexitaet === "mittel") {
    score += 8;
  } else {
    score += 3;
  }

  // Strategische Relevanz - Region (0-10)
  if (
    project.region === "Baden-Württemberg" ||
    project.region === "Bayern"
  ) {
    score += 10;
    begruendung.push(`Kernregion ${project.region} — starke Marktpräsenz`);
  } else if (project.region === "Hessen" || project.region === "NRW") {
    score += 7;
  } else {
    score += 3;
    annahmen.push(
      `Region ${project.region} — Marktpräsenz nicht bekannt, mittlere Bewertung`
    );
  }

  // Bauphase (0-10)
  if (project.bauphase === "Planung") {
    score += 10;
    begruendung.push(
      "Frühe Planungsphase — optimaler Einstiegszeitpunkt für Beratung"
    );
  } else if (project.bauphase === "Ausschreibung") {
    score += 8;
  } else if (project.bauphase === "Rohbau") {
    score += 3;
    begruendung.push("Bereits im Rohbau — kurzfristiges Mietpotenzial");
  }

  // Bauvolumen (0-10)
  if (project.bauvolumen > 80) {
    score += 10;
  } else if (project.bauvolumen > 30) {
    score += 6;
  } else {
    score += 2;
  }

  // Abschlusswahrscheinlichkeit
  let abschluss = 30;
  if (project.bauphase === "Planung") abschluss += 20;
  if (project.bauphase === "Ausschreibung") abschluss += 30;
  if (project.bauphase === "Rohbau") abschluss += 10;
  if (project.betonanteil > 60) abschluss += 10;
  if (
    project.region === "Baden-Württemberg" ||
    project.region === "Bayern"
  )
    abschluss += 10;
  abschluss = Math.min(abschluss, 90);

  // Umsatzpotenzial-Schätzung (vereinfacht: ~20-40 EUR/m² Wandfläche)
  const basisProQm = project.betonqualitaet === "Sichtbeton" ? 35 : 22;
  const umsatzMin = Math.round(
    (project.wandflaeche * basisProQm * 0.7) / 1000
  );
  const umsatzMax = Math.round(
    ((project.wandflaeche + project.deckenflaeche * 0.5) * basisProQm * 1.2) /
      1000
  );
  annahmen.push(
    `Umsatzschätzung basierend auf ~${basisProQm} €/m² Wandfläche (${project.betonqualitaet})`
  );

  // Strategische Relevanz
  let strategisch: LeadScore["strategischeRelevanz"] = "niedrig";
  if (score >= 70) strategisch = "hoch";
  else if (score >= 45) strategisch = "mittel";

  // Empfehlung
  let empfehlung: LeadScore["empfehlung"] = "Nicht priorisieren";
  if (score >= 65) empfehlung = "Sofort bearbeiten";
  else if (score >= 40) empfehlung = "Beobachten";

  return {
    opportunityScore: Math.min(score, 100),
    umsatzpotenzialMin: umsatzMin,
    umsatzpotenzialMax: umsatzMax,
    abschlusswahrscheinlichkeit: abschluss,
    strategischeRelevanz: strategisch,
    begruendung,
    empfehlung,
    annahmen,
  };
}

// ---- Angebotskalkulation ----

export interface SystemEmpfehlung {
  system: string;
  begruendung: string;
  alternativSystem: string;
  alternativBegruendung: string;
}

export interface Mengenabschaetzung {
  schalungselemente: number;
  zubehoerTeile: number;
  sicherheitsPlattformen: number;
  montageStunden: number;
  erklaerung: string;
}

export interface Kalkulation {
  materialkosten: number;
  transportkosten: number;
  montagekosten: number;
  gesamtNetto: number;
  empfohleneMarge: number;
  angebotsvolumen: number;
  mietOderKauf: "Miete" | "Kauf" | "Kombination";
  mietOderKaufBegruendung: string;
  premiumAufschlag: number;
  risiken: string[];
}

export interface Angebot {
  systemEmpfehlung: SystemEmpfehlung;
  mengen: Mengenabschaetzung;
  kalkulation: Kalkulation;
  technischeBeschreibung: string;
  leistungsumfang: string[];
  zusatzleistungen: string[];
}

export function berechneAngebot(project: Project): Angebot {
  // Systemauswahl
  let system = "Standard-Wandschalung (Mammut 350)";
  let begruendung = "Standard-Wandhöhe bis 3,5 m, wirtschaftlichste Lösung";
  let altSystem = "Großflächenschalung (MevaDec)";
  let altBegruendung = "Höhere Taktung bei großen Flächen möglich";

  if (project.wandhoehe > 6) {
    system = "Klettersystem (MevaClimb)";
    begruendung = `Wandhöhe von ${project.wandhoehe} m erfordert Klettersystem für sichere, effiziente Taktung`;
    altSystem = "Kranabhängige Großflächenschalung";
    altBegruendung = "Alternative bei verfügbarer Krankapazität";
  } else if (project.wandhoehe > 3.5 || project.wandflaeche > 10000) {
    system = "Großflächenschalung (Mammut 350+)";
    begruendung = `${project.wandhoehe > 3.5 ? "Erhöhte Wandhöhe" : "Große Fläche"} — Großflächenschalung für maximale Effizienz`;
    altSystem = "Klettersystem (MevaClimb)";
    altBegruendung = "Bei wiederholenden vertikalen Takten wirtschaftlicher";
  }

  if (project.betonqualitaet === "Sichtbeton") {
    system = system.replace(")", " / Sichtbetonklasse)");
    begruendung += ". Sichtbeton erfordert spezielle Schalhaut und erhöhte Qualitätskontrolle";
  }

  // Mengenabschätzung
  const elementeProQm = project.komplexitaet === "komplex" ? 0.8 : 0.6;
  const schalungselemente = Math.round(project.wandflaeche * elementeProQm / 10);
  const zubehoer = Math.round(schalungselemente * 3.5);
  const plattformen = Math.round(project.wandflaeche / 50);
  const montageStunden = Math.round(
    (schalungselemente * 0.8 + plattformen * 0.3) * (project.komplexitaet === "komplex" ? 1.4 : 1.0)
  );

  const erklaerung = `Bei ${project.wandflaeche.toLocaleString("de-DE")} m² Wandfläche und ${project.wandhoehe} m Höhe: ca. ${schalungselemente} Schalungselemente (${elementeProQm} Elemente/10 m²), ${zubehoer} Zubehörteile, ${plattformen} Sicherheitsplattformen. Geschätzter Montageaufwand: ${montageStunden} Stunden.`;

  // Kalkulation
  const preisProElement = project.betonqualitaet === "Sichtbeton" ? 280 : 200;
  const materialkosten = schalungselemente * preisProElement + zubehoer * 25 + plattformen * 150;
  const transportkosten = Math.round(materialkosten * 0.08);
  const montagekosten = montageStunden * 65;
  const gesamtNetto = materialkosten + transportkosten + montagekosten;
  const marge = 0.18;
  const angebotsvolumen = Math.round(gesamtNetto * (1 + marge));

  // Miete oder Kauf
  let mietKauf: Kalkulation["mietOderKauf"] = "Miete";
  let mietKaufGrund =
    "Projektbezogener Einsatz — Miete wirtschaftlicher bei einmaligem Bedarf";
  if (project.bauzeit > 18) {
    mietKauf = "Kombination";
    mietKaufGrund = `Lange Bauzeit (${project.bauzeit} Monate) — Kernsystem kaufen, Spitzenmengen mieten`;
  }

  const premiumAufschlag = project.betonqualitaet === "Sichtbeton"
    ? Math.round(gesamtNetto * 0.25)
    : Math.round(gesamtNetto * 0.12);

  const risiken: string[] = [];
  if (project.komplexitaet === "komplex")
    risiken.push("Komplexe Geometrie kann Sonderlösungen erfordern — Aufschlag möglich");
  if (project.bauzeit > 20)
    risiken.push("Lange Bauzeit erhöht Mietkosten — Kaufoption prüfen");
  if (project.betonqualitaet === "Sichtbeton")
    risiken.push("Sichtbeton erfordert erhöhten Qualitätssicherungsaufwand");
  if (project.wandhoehe > 8)
    risiken.push("Große Höhen erfordern spezielle Sicherheitskonzepte");

  return {
    systemEmpfehlung: {
      system,
      begruendung,
      alternativSystem: altSystem,
      alternativBegruendung: altBegruendung,
    },
    mengen: {
      schalungselemente,
      zubehoerTeile: zubehoer,
      sicherheitsPlattformen: plattformen,
      montageStunden,
      erklaerung,
    },
    kalkulation: {
      materialkosten,
      transportkosten,
      montagekosten,
      gesamtNetto,
      empfohleneMarge: marge,
      angebotsvolumen,
      mietOderKauf: mietKauf,
      mietOderKaufBegruendung: mietKaufGrund,
      premiumAufschlag,
      risiken,
    },
    technischeBeschreibung: `${system} für ${project.name}. ${project.wandflaeche.toLocaleString("de-DE")} m² Wandfläche, ${project.deckenflaeche.toLocaleString("de-DE")} m² Deckenfläche, ${project.geschosse} Geschosse. ${begruendung}.`,
    leistungsumfang: [
      `${schalungselemente} Schalungselemente inkl. Schalhaut`,
      `${zubehoer} Zubehörteile (Ankersystem, Spanner, Richtstützen)`,
      `${plattformen} Sicherheitsplattformen / Arbeitsbühnen`,
      "Schalungsplanung und Einsatzberatung",
      "Lieferung und Abholung frei Baustelle",
      "Einweisung des Baustellenpersonals",
    ],
    zusatzleistungen: [
      "Engineering-Service: Detaillierte Schalungsplanung (+ 8% Aufschlag)",
      "Baustellenberatung: Vor-Ort-Support während Schalungsarbeiten",
      "Premium-Schalhaut für Sichtbeton-Anforderungen",
      "Erweiterte Sicherheitsausstattung nach aktueller DGUV",
    ],
  };
}

// ---- Cross-/Upselling ----

export interface UpsellingEmpfehlung {
  produkt: string;
  umsatzpotenzial: number;
  wahrscheinlichkeit: number;
  begruendung: string;
  prioritaet: "hoch" | "mittel" | "niedrig";
}

export function analyzeUpselling(customer: Customer): UpsellingEmpfehlung[] {
  const empfehlungen: UpsellingEmpfehlung[] = [];

  const hatProdukt = (p: string) =>
    customer.produkte.some((prod) => prod.toLowerCase().includes(p.toLowerCase()));

  if (!hatProdukt("Deckenschalung") && customer.projekte >= 3) {
    empfehlungen.push({
      produkt: "Deckenschalung (MevaDec)",
      umsatzpotenzial: Math.round(customer.umsatzLetztesJahr * 0.4),
      wahrscheinlichkeit: 70,
      begruendung:
        "Kunde nutzt Wandschalung, aber keine Deckenschalung. Bei regelmäßigen Projekten hohe Synergie durch Komplettlösung.",
      prioritaet: "hoch",
    });
  }

  if (!hatProdukt("Klettersystem") && customer.umsatzLetztesJahr > 500000) {
    empfehlungen.push({
      produkt: "Klettersystem (MevaClimb)",
      umsatzpotenzial: Math.round(customer.umsatzLetztesJahr * 0.35),
      wahrscheinlichkeit: 45,
      begruendung:
        "Großkunde mit Potenzial für Hochbauprojekte. Klettersystem erschließt neues Segment.",
      prioritaet: "mittel",
    });
  }

  if (!hatProdukt("Engineering")) {
    empfehlungen.push({
      produkt: "Engineering-Service",
      umsatzpotenzial: Math.round(customer.umsatzLetztesJahr * 0.12),
      wahrscheinlichkeit: 60,
      begruendung:
        "Kein Engineering-Service gebucht. Schalungsplanung kann Bauzeit verkürzen und Fehler reduzieren.",
      prioritaet: customer.projekte >= 5 ? "hoch" : "mittel",
    });
  }

  if (customer.mietquote > 70 && customer.projekte >= 4) {
    const sparPotenzial = Math.round(customer.umsatzLetztesJahr * 0.15);
    empfehlungen.push({
      produkt: "Kauf statt Miete (Systemumstellung)",
      umsatzpotenzial: Math.round(customer.umsatzLetztesJahr * 1.8),
      wahrscheinlichkeit: 35,
      begruendung: `Mietquote bei ${customer.mietquote}% — bei ${customer.projekte} Projekten/Jahr wirtschaftlicher Kauf möglich. Einsparpotenzial ca. ${sparPotenzial.toLocaleString("de-DE")} €/Jahr für den Kunden.`,
      prioritaet: "mittel",
    });
  }

  if (!hatProdukt("Sicherheit") && customer.projekte >= 2) {
    empfehlungen.push({
      produkt: "Sicherheitsplattformen & Zubehör",
      umsatzpotenzial: Math.round(customer.umsatzLetztesJahr * 0.08),
      wahrscheinlichkeit: 75,
      begruendung:
        "Keine Sicherheitsplattformen im Einsatz. Arbeitssicherheit ist gesetzlich gefordert und erhöht Effizienz.",
      prioritaet: "hoch",
    });
  }

  if (customer.umsatzLetztesJahr < customer.umsatzVorjahr * 0.85) {
    empfehlungen.push({
      produkt: "Rückgewinnung / Reaktivierung",
      umsatzpotenzial: Math.round(customer.umsatzVorjahr - customer.umsatzLetztesJahr),
      wahrscheinlichkeit: 50,
      begruendung: `Umsatzrückgang von ${Math.round(((customer.umsatzVorjahr - customer.umsatzLetztesJahr) / customer.umsatzVorjahr) * 100)}% gegenüber Vorjahr. Ursachenanalyse und aktive Ansprache empfohlen.`,
      prioritaet: "hoch",
    });
  }

  return empfehlungen.sort((a, b) => {
    const prio = { hoch: 0, mittel: 1, niedrig: 2 };
    return prio[a.prioritaet] - prio[b.prioritaet];
  });
}

// ---- Copilot: Kundenprofil & Next-Best-Action ----

export interface KundenProfil {
  zusammenfassung: string;
  typischeProjekte: string;
  genutzteProdukte: string;
  umsatzTrend: string;
  risikoeinschaetzung: "niedrig" | "mittel" | "hoch";
  risikoGrund: string;
}

export interface NextBestAction {
  aktion: string;
  begruendung: string;
  prioritaet: "hoch" | "mittel" | "niedrig";
}

function formatMio(val: number): string {
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1).replace(".", ",") + " Mio. €";
  }
  return Math.round(val / 1000).toLocaleString("de-DE") + " Tsd. €";
}

function formatDatum(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export { formatMio, formatDatum };

export function erstelleKundenProfil(customer: Customer): KundenProfil {
  const trend =
    customer.umsatzLetztesJahr > customer.umsatzVorjahr * 1.1
      ? "steigend"
      : customer.umsatzLetztesJahr < customer.umsatzVorjahr * 0.9
        ? "fallend"
        : "stabil";

  let risiko: KundenProfil["risikoeinschaetzung"] = "niedrig";
  let risikoGrund = "Stabile Geschäftsbeziehung, regelmäßige Projekte";

  if (trend === "fallend" || customer.zufriedenheit < 3) {
    risiko = "hoch";
    risikoGrund =
      trend === "fallend"
        ? "Umsatzrückgang — Abwanderungsgefahr"
        : "Niedrige Zufriedenheit — Handlungsbedarf";
  } else if (customer.serviceFaelle > 3 || customer.zufriedenheit === 3) {
    risiko = "mittel";
    risikoGrund = "Erhöhte Servicefälle oder mittlere Zufriedenheit";
  }

  const trendPfeil = trend === "steigend" ? "↑" : trend === "fallend" ? "↓" : "→";

  return {
    zusammenfassung: `${customer.typ} aus ${customer.region}, Kunde seit ${customer.beziehungSeit}. ${customer.projekte} aktive Projekte, Umsatz ${trend} ${trendPfeil}`,
    typischeProjekte: `${customer.projekte} Projekte/Jahr, Schwerpunkt ${customer.typ === "Großunternehmen" ? "Großprojekte bundesweit" : "regionale Projekte"}`,
    genutzteProdukte: customer.produkte.join(", "),
    umsatzTrend: `${formatMio(customer.umsatzVorjahr)} → ${formatMio(customer.umsatzLetztesJahr)} (${trendPfeil} ${trend})`,
    risikoeinschaetzung: risiko,
    risikoGrund,
  };
}

export function getNextBestActions(customer: Customer): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // Letzter Kontakt prüfen
  const letzterKontakt = new Date(customer.letzterKontakt);
  const tageOhneKontakt = Math.floor(
    (Date.now() - letzterKontakt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (tageOhneKontakt > 90) {
    actions.push({
      aktion: "Kontaktaufnahme — Beziehungspflege",
      begruendung: `Kein Kontakt seit ${tageOhneKontakt} Tagen. Aktive Ansprache stärkt Kundenbindung.`,
      prioritaet: "hoch",
    });
  }

  if (customer.umsatzLetztesJahr < customer.umsatzVorjahr * 0.85) {
    actions.push({
      aktion: "Ursachenanalyse Umsatzrückgang",
      begruendung: `Umsatz um ${Math.round(((customer.umsatzVorjahr - customer.umsatzLetztesJahr) / customer.umsatzVorjahr) * 100)}% gesunken. Gründe klären, ggf. Sonderkonditionen.`,
      prioritaet: "hoch",
    });
  }

  if (customer.serviceFaelle > 3) {
    actions.push({
      aktion: "Service-Review durchführen",
      begruendung: `${customer.serviceFaelle} Servicefälle — proaktiv Ursachen klären und Verbesserungen zeigen.`,
      prioritaet: "hoch",
    });
  }

  if (customer.mietquote > 70 && customer.projekte >= 4) {
    actions.push({
      aktion: "Kauf-/Mietberatung anbieten",
      begruendung: `Mietquote ${customer.mietquote}% bei ${customer.projekte} Projekten — Kaufoption könnte wirtschaftlicher sein.`,
      prioritaet: "mittel",
    });
  }

  if (customer.produkte.length < 3) {
    actions.push({
      aktion: "Produktportfolio-Beratung",
      begruendung: `Nur ${customer.produkte.length} Produktgruppen im Einsatz. Potenzial für Komplettlösung.`,
      prioritaet: "mittel",
    });
  }

  actions.push({
    aktion: "Technische Beratung für nächstes Projekt",
    begruendung:
      "Frühzeitige Einbindung bei Projektplanung sichert Aufträge und zeigt Kompetenz.",
    prioritaet: "mittel",
  });

  return actions;
}
