"use client";

import { useState } from "react";
import { Calculator, ChevronRight, AlertTriangle } from "lucide-react";
import { sampleProjects } from "../lib/mock-data";
import { berechneAngebot } from "../lib/scoring-engine";
import {
  AiLoadingOverlay,
  AiSummaryBox,
  ActionButtons,
  useAiDelay,
  AnimatedNumber,
} from "../components/shared";

function formatEUR(val: number) {
  return val.toLocaleString("de-DE") + " €";
}

export default function KalkulationPage() {
  const [selectedId, setSelectedId] = useState(sampleProjects[0].id);
  const project = sampleProjects.find((p) => p.id === selectedId)!;
  const angebot = berechneAngebot(project);
  const { loading, ready } = useAiDelay(selectedId);

  const summaryText = `Basierend auf ${project.wandflaeche} m² Wandfläche und ${project.deckenflaeche} m² Deckenfläche empfiehlt die KI das System ${angebot.systemEmpfehlung.system}. Das kalkulierte Angebotsvolumen beträgt ${formatEUR(angebot.kalkulation.angebotsvolumen)} (netto). ${angebot.kalkulation.mietOderKauf === "Miete" ? "Eine Mietlösung ist wirtschaftlich vorteilhafter." : angebot.kalkulation.mietOderKauf === "Kauf" ? "Ein Kaufmodell wird empfohlen." : "Eine Kombination aus Miete und Kauf ist optimal."} ${angebot.kalkulation.risiken.length > 0 ? `Hinweis: ${angebot.kalkulation.risiken.length} Risikofaktoren identifiziert.` : ""}`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#333333] flex items-center justify-center">
            <Calculator className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Angebots- & Kalkulationslogik</h1>
            <p className="text-sm text-muted">
              KI-basierte Systemauswahl und Angebotsableitung
            </p>
          </div>
        </div>
        <ActionButtons />
      </div>

      {/* Project Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sampleProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              selectedId === p.id
                ? "bg-[#e8221b] text-white border-[#e8221b]"
                : "bg-card border-border hover:border-[#e8221b]/50"
            }`}
          >
            {p.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      <AiSummaryBox text={summaryText} ready={ready} />

      <div className="grid grid-cols-3 gap-6 relative">
        <AiLoadingOverlay isLoading={loading} label="KI berechnet Angebot" />

        {/* Left: Systemempfehlung + Mengen */}
        <div className="col-span-2 space-y-6">
          {/* Systemempfehlung */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Systemempfehlung</h2>
            <div className="bg-[#f0faf0] border border-[#2d8f3c]/20 rounded-lg p-4 mb-4">
              <p className="font-bold text-[#1a1a1a]">
                {angebot.systemEmpfehlung.system}
              </p>
              <p className="text-sm text-muted mt-1">
                {angebot.systemEmpfehlung.begruendung}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Alternative
              </p>
              <p className="font-medium">
                {angebot.systemEmpfehlung.alternativSystem}
              </p>
              <p className="text-sm text-muted mt-1">
                {angebot.systemEmpfehlung.alternativBegruendung}
              </p>
            </div>
          </div>

          {/* Technische Beschreibung */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">
              Technische Kurzbeschreibung
            </h2>
            <p className="text-sm leading-relaxed">
              {angebot.technischeBeschreibung}
            </p>
          </div>

          {/* Mengenabschätzung */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Mengenabschätzung</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted">Schalungselemente</p>
                <p className="text-2xl font-bold mt-1">
                  <AnimatedNumber value={angebot.mengen.schalungselemente} />
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted">Zubehörteile</p>
                <p className="text-2xl font-bold mt-1">
                  <AnimatedNumber value={angebot.mengen.zubehoerTeile} />
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted">Sicherheitsplattformen</p>
                <p className="text-2xl font-bold mt-1">
                  <AnimatedNumber value={angebot.mengen.sicherheitsPlattformen} />
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted">Montageaufwand</p>
                <p className="text-2xl font-bold mt-1">
                  <AnimatedNumber value={angebot.mengen.montageStunden} suffix=" Std." />
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                {angebot.mengen.erklaerung}
              </p>
            </div>
          </div>

          {/* Leistungsumfang */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Leistungsumfang</h2>
            <ul className="space-y-2">
              {angebot.leistungsumfang.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight
                    size={14}
                    className="text-[#e8221b] mt-0.5 shrink-0"
                  />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Kalkulation */}
        <div className="space-y-6">
          {/* Preisübersicht */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Preisübersicht</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Materialkosten</span>
                <span>{formatEUR(angebot.kalkulation.materialkosten)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Transport</span>
                <span>{formatEUR(angebot.kalkulation.transportkosten)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Montage</span>
                <span>{formatEUR(angebot.kalkulation.montagekosten)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-sm">
                <span className="text-muted">Gesamt netto</span>
                <span className="font-semibold">
                  {formatEUR(angebot.kalkulation.gesamtNetto)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">
                  Marge ({Math.round(angebot.kalkulation.empfohleneMarge * 100)}%)
                </span>
                <span>
                  {formatEUR(
                    angebot.kalkulation.angebotsvolumen -
                      angebot.kalkulation.gesamtNetto
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold">Angebotsvolumen</span>
                <span className="font-bold text-lg text-[#e8221b]">
                  {formatEUR(angebot.kalkulation.angebotsvolumen)}
                </span>
              </div>
            </div>
          </div>

          {/* Miet-/Kaufempfehlung */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-3">Miet-/Kaufempfehlung</h2>
            <div className="bg-[#e8221b]/5 border border-[#e8221b]/20 rounded-lg p-4">
              <p className="font-bold text-[#1a1a1a]">
                {angebot.kalkulation.mietOderKauf}
              </p>
              <p className="text-sm text-muted mt-1">
                {angebot.kalkulation.mietOderKaufBegruendung}
              </p>
            </div>
          </div>

          {/* Premium-Variante */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-3">Premium-Variante</h2>
            <p className="text-sm text-muted mb-2">
              Mit erweiterter Ausstattung und Engineering
            </p>
            <p className="text-xl font-bold text-[#e8221b]">
              {formatEUR(
                angebot.kalkulation.angebotsvolumen +
                  angebot.kalkulation.premiumAufschlag
              )}
            </p>
            <p className="text-xs text-muted mt-1">
              + {formatEUR(angebot.kalkulation.premiumAufschlag)} gegenüber
              Standard
            </p>
          </div>

          {/* Zusatzleistungen */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-3">Optionale Zusatzleistungen</h2>
            <ul className="space-y-2">
              {angebot.zusatzleistungen.map((z, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-[#e8221b] mt-0.5">+</span>
                  {z}
                </li>
              ))}
            </ul>
          </div>

          {/* Risiken */}
          {angebot.kalkulation.risiken.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <h2 className="font-semibold text-amber-800">
                  Risiken & Unsicherheiten
                </h2>
              </div>
              <ul className="space-y-2">
                {angebot.kalkulation.risiken.map((r, i) => (
                  <li key={i} className="text-sm text-amber-700">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
