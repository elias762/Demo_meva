"use client";

import { useState } from "react";
import {
  Users,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Phone,
  Building2,
  CalendarDays,
  Star,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { sampleCustomers, type Customer } from "../lib/mock-data";
import {
  erstelleKundenProfil,
  getNextBestActions,
  formatMio,
  formatDatum,
} from "../lib/scoring-engine";
import {
  AiLoadingOverlay,
  AiSummaryBox,
  ActionButtons,
  PrioBadge,
  RiskBadge,
  useAiDelay,
} from "../components/shared";

function TrendIcon({ customer }: { customer: Customer }) {
  if (customer.umsatzLetztesJahr > customer.umsatzVorjahr * 1.1)
    return <TrendingUp size={14} className="text-green-600" />;
  if (customer.umsatzLetztesJahr < customer.umsatzVorjahr * 0.9)
    return <TrendingDown size={14} className="text-[#e8221b]" />;
  return <Minus size={14} className="text-muted" />;
}

function MeetingAgenda({ customer }: { customer: Customer }) {
  const umsatzTrend =
    customer.umsatzLetztesJahr >= customer.umsatzVorjahr ? "positiv" : "rückläufig";

  const gespraechspunkte = [
    `Aktuelle Projektsituation und Pipeline für ${new Date().getFullYear()}`,
    customer.produkte.length < 3
      ? "Produktportfolio erweitern — Komplettlösung vorstellen"
      : "Zufriedenheit mit aktuellem Produktmix",
    customer.mietquote > 70
      ? `Miet-/Kaufoptimierung besprechen (aktuell ${customer.mietquote}% Mietquote)`
      : "Aktuelle Mietverträge und Konditionen",
    umsatzTrend === "rückläufig"
      ? "Umsatzentwicklung ansprechen — Ursachen und Lösungen"
      : "Wachstumspotenziale identifizieren",
    "Terminsicherung für nächstes Quartal",
  ];

  const einwaende = [
    "Preissensibilität bei aktueller Marktlage",
    customer.serviceFaelle > 2
      ? `Unzufriedenheit mit Service (${customer.serviceFaelle} offene Fälle)`
      : null,
    "Wettbewerb bietet günstigere Konditionen",
  ].filter(Boolean);

  const crossSell = [
    !customer.produkte.includes("Deckenschalung") ? "Deckenschalung als Ergänzung" : null,
    !customer.produkte.includes("Engineering") ? "Engineering-Services vorstellen" : null,
    !customer.produkte.includes("Klettersystem") && customer.umsatzLetztesJahr > 500000
      ? "Klettersysteme für Hochbauprojekte"
      : null,
    "Sicherheitszubehör und Arbeitsbühnen",
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Agenda-Vorschlag
        </p>
        <ol className="space-y-1.5">
          {gespraechspunkte.map((g, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-[#e8221b] font-semibold text-xs mt-0.5 w-4 shrink-0">
                {i + 1}.
              </span>
              {g}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Mögliche Einwände
        </p>
        <ul className="space-y-1.5">
          {einwaende.map((e, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Cross-Sell-Chancen
        </p>
        <ul className="space-y-1.5">
          {crossSell.map((c, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <CheckCircle
                size={14}
                className="text-[#2d8f3c] mt-0.5 shrink-0"
              />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CopilotPage() {
  const [selectedId, setSelectedId] = useState(sampleCustomers[0].id);
  const customer = sampleCustomers.find((c) => c.id === selectedId)!;
  const profil = erstelleKundenProfil(customer);
  const actions = getNextBestActions(customer);
  const { loading, ready } = useAiDelay(selectedId);

  const summaryText = profil.risikoeinschaetzung === "hoch"
    ? `Achtung: ${customer.name} zeigt erhöhtes Abwanderungsrisiko. ${profil.risikoGrund}. Sofortige Kontaktaufnahme und Ursachenanalyse empfohlen.`
    : `${customer.name} ist ein ${profil.risikoeinschaetzung === "niedrig" ? "stabiler" : "zu beobachtender"} Kunde mit ${customer.projekte} Projekten. ${actions[0]?.begruendung || "Beziehungspflege fortsetzen."}`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e8221b] flex items-center justify-center">
            <Users className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Vertriebs-Copilot</h1>
            <p className="text-sm text-muted">
              KI-Assistenz für Innen- und Außendienst
            </p>
          </div>
        </div>
        <ActionButtons />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Customer List */}
        <div className="space-y-2">
          {sampleCustomers.map((c) => {
            const cp = erstelleKundenProfil(c);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedId === c.id
                    ? "bg-card border-[#e8221b] shadow-sm"
                    : "bg-card border-border hover:border-[#e8221b]/30"
                }`}
              >
                <p className="font-medium text-sm leading-tight">
                  {c.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">{c.typ}</span>
                  <RiskBadge level={cp.risikoeinschaetzung} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Customer Detail */}
        <div className="col-span-3 space-y-6 relative">
          <AiLoadingOverlay isLoading={loading} label="KI analysiert Kundendaten" />

          <AiSummaryBox text={summaryText} ready={ready} />

          {/* Profile Card */}
          <div className="bg-card rounded-xl border border-border">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{customer.name}</h2>
                  <p className="text-sm text-muted mt-1">
                    {profil.zusammenfassung}
                  </p>
                </div>
                <RiskBadge level={profil.risikoeinschaetzung} />
              </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-4 border-b border-border">
              <div className="px-6 py-4 border-r border-border">
                <p className="text-xs text-muted mb-1 flex items-center gap-1.5">
                  <Building2 size={12} />
                  Umsatz aktuell
                </p>
                <p className="text-lg font-bold">
                  {formatMio(customer.umsatzLetztesJahr)}
                </p>
              </div>
              <div className="px-6 py-4 border-r border-border">
                <p className="text-xs text-muted mb-1 flex items-center gap-1.5">
                  <TrendIcon customer={customer} />
                  Umsatztrend
                </p>
                <p className="text-sm font-medium">{profil.umsatzTrend}</p>
              </div>
              <div className="px-6 py-4 border-r border-border">
                <p className="text-xs text-muted mb-1 flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  Letzter Kontakt
                </p>
                <p className="text-sm font-medium">
                  {formatDatum(customer.letzterKontakt)}
                </p>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-muted mb-1 flex items-center gap-1.5">
                  <Star size={12} />
                  Zufriedenheit
                </p>
                <p className="text-sm font-medium">
                  {"★".repeat(customer.zufriedenheit)}
                  {"☆".repeat(5 - customer.zufriedenheit)}
                </p>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-0">
              <div className="px-6 py-4 border-r border-b border-border">
                <p className="text-xs text-muted mb-1">Projekte</p>
                <p className="text-sm font-medium">{profil.typischeProjekte}</p>
              </div>
              <div className="px-6 py-4 border-b border-border">
                <p className="text-xs text-muted mb-1">Produkte</p>
                <div className="flex flex-wrap gap-1.5">
                  {customer.produkte.map((p) => (
                    <span
                      key={p}
                      className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-xs font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-r border-border">
                <p className="text-xs text-muted mb-1">Mietquote</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#e8221b]"
                      style={{ width: `${customer.mietquote}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {customer.mietquote}%
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-muted mb-1">Risikobewertung</p>
                <p className="text-sm font-medium">{profil.risikoGrund}</p>
              </div>
            </div>

            {/* Notizen */}
            {customer.notizen && (
              <div className="px-6 py-4 bg-[#fafafa] border-t border-border">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                  Notizen
                </p>
                <p className="text-sm">{customer.notizen}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Next Best Actions */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#e8221b]" />
                Next-Best-Action
              </h3>
              <div className="space-y-3">
                {actions.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{a.aktion}</p>
                      <PrioBadge level={a.prioritaet} />
                    </div>
                    <p className="text-xs text-muted">{a.begruendung}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Prep */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Phone size={16} className="text-[#e8221b]" />
                Meeting-Vorbereitung
              </h3>
              <MeetingAgenda customer={customer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
