"use client";

import { useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { sampleCustomers } from "../lib/mock-data";
import { analyzeUpselling, type UpsellingEmpfehlung } from "../lib/scoring-engine";
import { PrioBadge, AiLoadingOverlay, AiSummaryBox, ActionButtons, useAiDelay } from "../components/shared";

function WahrscheinlichkeitBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#e8221b]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted">{value}%</span>
    </div>
  );
}

function EmpfehlungCard({ e }: { e: UpsellingEmpfehlung }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ArrowUpRight size={16} className="text-[#e8221b]" />
          <h4 className="font-semibold text-sm">{e.produkt}</h4>
        </div>
        <PrioBadge level={e.prioritaet} />
      </div>

      <p className="text-sm text-muted mb-4">{e.begruendung}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Umsatzpotenzial</p>
          <p className="font-bold text-[#2d8f3c]">
            {e.umsatzpotenzial.toLocaleString("de-DE")} €
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Wahrscheinlichkeit</p>
          <WahrscheinlichkeitBar value={e.wahrscheinlichkeit} />
        </div>
      </div>
    </div>
  );
}

export default function UpsellingPage() {
  const [selectedId, setSelectedId] = useState(sampleCustomers[0].id);
  const customer = sampleCustomers.find((c) => c.id === selectedId)!;
  const empfehlungen = analyzeUpselling(customer);
  const { loading, ready } = useAiDelay(selectedId);

  const gesamtPotenzial = empfehlungen.reduce(
    (sum, e) => sum + e.umsatzpotenzial,
    0
  );
  const gewichtetPotenzial = empfehlungen.reduce(
    (sum, e) => sum + e.umsatzpotenzial * (e.wahrscheinlichkeit / 100),
    0
  );

  // Gesamtübersicht über alle Kunden
  const alleEmpfehlungen = sampleCustomers.map((c) => ({
    kunde: c.name,
    empfehlungen: analyzeUpselling(c),
  }));
  const gesamtAlleKunden = alleEmpfehlungen.reduce(
    (sum, k) =>
      sum + k.empfehlungen.reduce((s, e) => s + e.umsatzpotenzial, 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#333333] flex items-center justify-center">
            <TrendingUp className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cross- & Upselling</h1>
            <p className="text-sm text-muted">
              Systematische Umsatzpotenziale pro Kunde identifizieren
            </p>
          </div>
        </div>
        <ActionButtons />
      </div>

      <AiSummaryBox
        text={`Die KI hat ${sampleCustomers.length} Kundenportfolios analysiert und ein Gesamt-Upselling-Potenzial von ${(gesamtAlleKunden / 1000000).toFixed(1).replace(".", ",")} Mio. € identifiziert. Für ${customer.name} ergeben sich ${empfehlungen.length} konkrete Empfehlungen mit einem gewichteten Potenzial von ${Math.round(gewichtetPotenzial).toLocaleString("de-DE")} €. Empfehlung: Fokus auf Produkte mit hoher Abschlusswahrscheinlichkeit.`}
        ready={ready}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Gesamt-Portfolio-Potenzial
          </p>
          <p className="text-2xl font-bold mt-1 text-[#2d8f3c]">
            {(gesamtAlleKunden / 1000000).toFixed(2).replace(".", ",")} Mio. €
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Potenzial — {customer.name.split(" ")[0]}
          </p>
          <p className="text-2xl font-bold mt-1">
            {gesamtPotenzial.toLocaleString("de-DE")} €
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Gewichtetes Potenzial
          </p>
          <p className="text-2xl font-bold mt-1 text-[#e8221b]">
            {Math.round(gewichtetPotenzial).toLocaleString("de-DE")} €
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Customer List */}
        <div className="space-y-2">
          {sampleCustomers.map((c) => {
            const emps = analyzeUpselling(c);
            const pot = emps.reduce((s, e) => s + e.umsatzpotenzial, 0);
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
                <p className="font-medium text-sm">{c.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted">
                    {emps.length} Empfehlungen
                  </span>
                  <span className="text-xs font-semibold text-[#2d8f3c]">
                    {pot.toLocaleString("de-DE")} €
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empfehlungen */}
        <div className="col-span-3 relative">
          <AiLoadingOverlay isLoading={loading} label="KI analysiert Kundenpotenziale" />

          <div className="mb-4">
            <h2 className="text-lg font-semibold">{customer.name}</h2>
            <p className="text-sm text-muted">
              Aktuelle Produkte: {customer.produkte.join(", ")} | Mietquote:{" "}
              {customer.mietquote}% | {customer.projekte} Projekte/Jahr
            </p>
          </div>

          {empfehlungen.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted">
                Keine spezifischen Upselling-Empfehlungen. Kunde nutzt bereits
                ein breites Produktportfolio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {empfehlungen.map((e, i) => (
                <EmpfehlungCard key={i} e={e} />
              ))}
            </div>
          )}

          {/* Kundenvergleich */}
          <div className="mt-8 bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">
              Portfolio-Überblick: Alle Kunden
            </h3>
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a1a1a] text-xs font-medium text-white uppercase tracking-wide">
                  <th className="text-left p-3 rounded-tl-lg">Kunde</th>
                  <th className="text-left p-3">Empfehlungen</th>
                  <th className="text-left p-3">Potenzial</th>
                  <th className="text-left p-3 rounded-tr-lg">Top-Priorität</th>
                </tr>
              </thead>
              <tbody>
                {alleEmpfehlungen.map((k) => {
                  const pot = k.empfehlungen.reduce(
                    (s, e) => s + e.umsatzpotenzial,
                    0
                  );
                  const top = k.empfehlungen[0];
                  return (
                    <tr key={k.kunde} className="border-t border-border">
                      <td className="p-3 text-sm font-medium">{k.kunde}</td>
                      <td className="p-3 text-sm">{k.empfehlungen.length}</td>
                      <td className="p-3 text-sm font-semibold text-[#2d8f3c]">
                        {pot.toLocaleString("de-DE")} €
                      </td>
                      <td className="p-3 text-sm">
                        {top ? (
                          <span className="flex items-center gap-2">
                            {top.produkt}
                            <PrioBadge level={top.prioritaet} />
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
