"use client";

import {
  Target,
  Calculator,
  Users,
  TrendingUp,
  Brain,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sampleProjects, sampleCustomers } from "./lib/mock-data";
import { scoreProject, analyzeUpselling } from "./lib/scoring-engine";
import { AnimatedNumber, AiSummaryBox } from "./components/shared";

const modules = [
  {
    href: "/lead-scoring",
    icon: Target,
    title: "Lead-Scoring",
    desc: "Bauprojekte intelligent bewerten und Vertriebsprioritäten setzen",
    color: "bg-[#e8221b]",
  },
  {
    href: "/kalkulation",
    icon: Calculator,
    title: "Angebotskalkulation",
    desc: "Aus Projektdaten technische Lösungen und Preisstrukturen ableiten",
    color: "bg-[#333333]",
  },
  {
    href: "/copilot",
    icon: Users,
    title: "Vertriebs-Copilot",
    desc: "Kundenprofile, Meeting-Vorbereitung, Next-Best-Action",
    color: "bg-[#e8221b]",
  },
  {
    href: "/upselling",
    icon: TrendingUp,
    title: "Cross-/Upselling",
    desc: "Systematisch Umsatzpotenziale pro Kunde identifizieren",
    color: "bg-[#333333]",
  },
];

export default function Dashboard() {
  const scoredProjects = sampleProjects
    .map((p) => ({ ...p, score: scoreProject(p) }))
    .sort((a, b) => b.score.opportunityScore - a.score.opportunityScore);

  const topProjects = scoredProjects.slice(0, 3);

  const gesamtUmsatz = sampleCustomers.reduce(
    (sum, c) => sum + c.umsatzLetztesJahr,
    0
  );

  const gesamtPotenzial = sampleCustomers.reduce(
    (sum, c) =>
      sum +
      analyzeUpselling(c).reduce((s, e) => s + e.umsatzpotenzial, 0),
    0
  );

  const topCount = scoredProjects.filter(
    (p) => p.score.opportunityScore >= 65
  ).length;

  // Revenue bar chart data
  const customerBars = sampleCustomers
    .map((c) => ({
      name: c.name.split(" ")[0],
      umsatz: c.umsatzLetztesJahr,
      potenzial: analyzeUpselling(c).reduce(
        (s, e) => s + e.umsatzpotenzial,
        0
      ),
    }))
    .sort((a, b) => b.umsatz - a.umsatz);

  const maxBar = Math.max(...customerBars.map((c) => c.umsatz + c.potenzial));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/meva-logo.png"
                alt="MEVA"
                width={100}
                height={25}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted border-l border-border pl-3">
                Sales Cockpit
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mt-2">
              Vertriebsregion Baden-Württemberg Süd
            </h1>
            <p className="text-sm text-muted mt-0.5">
              KI-gestützte Vertriebssteuerung — Schalungssysteme & Services
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-muted justify-end mb-1">
              <Clock size={12} />
              Letzte Aktualisierung: vor 3 Stunden
            </div>
            <p className="text-sm font-semibold">
              {new Date().toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <AiSummaryBox
        text={`Die KI hat ${sampleProjects.length} aktive Projekte analysiert und ${topCount} Top-Opportunitäten identifiziert. Das Klinikum Frankfurt (Score: ${scoredProjects[0].score.opportunityScore}) zeigt das höchste Potenzial. Über alle Kunden ergibt sich ein zusätzliches Umsatzpotenzial von ${(gesamtPotenzial / 1000000).toFixed(1).replace(".", ",")} Mio. € durch Cross- und Upselling. Empfehlung: Fokus auf die Projekte in Planungs- und Ausschreibungsphase.`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-muted" />
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Projekte analysiert
            </p>
          </div>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={sampleProjects.length} />
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-[#e8221b]" />
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Top-Opportunitäten
            </p>
          </div>
          <p className="text-3xl font-bold text-[#e8221b]">
            <AnimatedNumber value={topCount} />
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-muted" />
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Kunden im Portfolio
            </p>
          </div>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={sampleCustomers.length} />
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[#2d8f3c]" />
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              KI-Umsatzpotenzial
            </p>
          </div>
          <p className="text-3xl font-bold text-[#2d8f3c]">
            <AnimatedNumber
              value={gesamtPotenzial / 1000000}
              decimals={1}
              suffix=" Mio €"
            />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-3 bg-card rounded-xl border border-border p-6">
          <h2 className="text-sm font-semibold mb-1">
            Umsatz & Potenzial nach Kunde
          </h2>
          <p className="text-xs text-muted mb-5">
            Aktueller Jahresumsatz + KI-identifiziertes Zusatzpotenzial
          </p>
          <div className="space-y-3">
            {customerBars.map((c) => {
              const uPct = (c.umsatz / maxBar) * 100;
              const pPct = (c.potenzial / maxBar) * 100;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium w-16">{c.name}</span>
                    <span className="text-xs text-muted">
                      {(c.umsatz / 1000000).toFixed(1).replace(".", ",")} Mio +{" "}
                      {(c.potenzial / 1000000).toFixed(1).replace(".", ",")} Mio
                    </span>
                  </div>
                  <div className="flex h-5 rounded overflow-hidden bg-[#f0f0f0]">
                    <div
                      className="bg-[#1a1a1a] rounded-l transition-all duration-1000"
                      style={{ width: `${uPct}%` }}
                    />
                    <div
                      className="bg-[#e8221b] transition-all duration-1000 delay-300"
                      style={{ width: `${pPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#1a1a1a]" /> Ist-Umsatz
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#e8221b]" /> KI-Potenzial
            </span>
          </div>
        </div>

        {/* Modules Quick Access */}
        <div className="col-span-2 space-y-3">
          <h2 className="text-sm font-semibold mb-1">KI-Module</h2>
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex items-center gap-3 bg-card rounded-xl border border-border p-4 hover:border-[#e8221b]/40 hover:shadow-sm transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${mod.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="text-white" size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#e8221b] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-muted truncate">{mod.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Top Opportunities Table */}
      <h2 className="text-sm font-semibold mb-3">Top-Opportunitäten</h2>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a1a1a] text-xs font-medium text-white uppercase tracking-wide">
              <th className="text-left p-4">Projekt</th>
              <th className="text-left p-4">Typ</th>
              <th className="text-left p-4">Score</th>
              <th className="text-left p-4">Umsatzpotenzial</th>
              <th className="text-left p-4">Empfehlung</th>
            </tr>
          </thead>
          <tbody>
            {topProjects.map((p) => (
              <tr
                key={p.id}
                className="border-t border-border hover:bg-[#fafafa] transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted">{p.id}</div>
                </td>
                <td className="p-4 text-sm">{p.typ}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${p.score.opportunityScore}%`,
                          backgroundColor:
                            p.score.opportunityScore >= 65
                              ? "#2d8f3c"
                              : p.score.opportunityScore >= 40
                                ? "#e89a1b"
                                : "#e8221b",
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {p.score.opportunityScore}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {p.score.umsatzpotenzialMin}–{p.score.umsatzpotenzialMax} Tsd. €
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.score.empfehlung === "Sofort bearbeiten"
                        ? "bg-green-100 text-green-800"
                        : p.score.empfehlung === "Beobachten"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.score.empfehlung}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
