"use client";

import { useState } from "react";
import { Target, ChevronRight, Info, Plus, X } from "lucide-react";
import { sampleProjects, type Project } from "../lib/mock-data";
import { scoreProject, type LeadScore } from "../lib/scoring-engine";
import {
  AiLoadingOverlay,
  AiSummaryBox,
  StaggeredList,
  ActionButtons,
  useAiDelay,
} from "../components/shared";

function ScoreBar({ value }: { value: number }) {
  const color =
    value >= 65
      ? "bg-[#2d8f3c]"
      : value >= 40
        ? "bg-[#e89a1b]"
        : "bg-[#e8221b]";
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}

function ProjectDetail({
  project,
  score,
  ready,
}: {
  project: Project;
  score: LeadScore;
  ready: boolean;
}) {
  const summaryText =
    score.opportunityScore >= 65
      ? `${project.name} zeigt überdurchschnittliches Potenzial. ${score.begruendung[0]}. Empfehlung: Vertrieb sofort aktivieren und technische Beratung einleiten.`
      : score.opportunityScore >= 40
        ? `${project.name} ist ein interessantes Projekt mit moderatem Potenzial. Weitere Informationen zu Wettbewerbssituation und Zeitplan empfohlen.`
        : `${project.name} hat begrenztes Potenzial für Schalungssysteme. Ressourcen auf höher priorisierte Projekte fokussieren.`;

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{project.name}</h3>
          <p className="text-sm text-muted">
            {project.id} — {project.bauunternehmen}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted uppercase tracking-wide">
            Opportunity Score
          </p>
          <p className="text-4xl font-bold">{score.opportunityScore}</p>
        </div>
      </div>

      {/* AI Summary */}
      <AiSummaryBox text={summaryText} ready={ready} />

      {/* Empfehlung + Actions */}
      <div className="flex items-center justify-between">
        <div
          className={`rounded-lg px-4 py-3 ${
            score.empfehlung === "Sofort bearbeiten"
              ? "bg-green-50 border border-green-200"
              : score.empfehlung === "Beobachten"
                ? "bg-amber-50 border border-amber-200"
                : "bg-gray-50 border border-gray-200"
          }`}
        >
          <p className="font-semibold">{score.empfehlung}</p>
        </div>
        <ActionButtons />
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded-lg p-4 border border-border">
          <p className="text-xs text-muted uppercase tracking-wide">
            Umsatzpotenzial
          </p>
          <p className="text-xl font-bold mt-1">
            {score.umsatzpotenzialMin}–{score.umsatzpotenzialMax} Tsd. €
          </p>
        </div>
        <div className="bg-background rounded-lg p-4 border border-border">
          <p className="text-xs text-muted uppercase tracking-wide">
            Abschlusswahrsch.
          </p>
          <p className="text-xl font-bold mt-1">
            {score.abschlusswahrscheinlichkeit}%
          </p>
        </div>
        <div className="bg-background rounded-lg p-4 border border-border">
          <p className="text-xs text-muted uppercase tracking-wide">
            Strateg. Relevanz
          </p>
          <p className="text-xl font-bold mt-1 capitalize">
            {score.strategischeRelevanz}
          </p>
        </div>
      </div>

      {/* Projektdaten */}
      <div>
        <h4 className="font-semibold mb-3">Projektdaten</h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {[
            ["Typ", project.typ],
            ["Region", project.region],
            ["Bauvolumen", `${project.bauvolumen.toLocaleString("de-DE")} Mio. €`],
            ["Geschosse", `${project.geschosse}`],
            ["Betonanteil", `${project.betonanteil}%`],
            [
              "Wandfläche",
              `${project.wandflaeche.toLocaleString("de-DE")} m²`,
            ],
            ["Wandhöhe", `${project.wandhoehe} m`],
            ["Bauphase", project.bauphase],
            ["Betonqualität", project.betonqualitaet],
            ["Bauzeit", `${project.bauzeit} Monate`],
          ].map(([label, val]) => (
            <div
              key={label}
              className="flex justify-between py-1 border-b border-border/50"
            >
              <span className="text-muted">{label}</span>
              <span className="font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KI-Analyse */}
      <div>
        <h4 className="font-semibold mb-3">KI-Analyse</h4>
        <StaggeredList
          items={score.begruendung}
          ready={ready}
          renderItem={(item) => (
            <div className="flex items-start gap-2 text-sm mb-2">
              <ChevronRight
                size={14}
                className="text-[#e8221b] mt-0.5 shrink-0"
              />
              {item}
            </div>
          )}
        />
      </div>

      {/* Annahmen */}
      {score.annahmen.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">
              Getroffene Annahmen
            </p>
          </div>
          <ul className="space-y-1">
            {score.annahmen.map((a, i) => (
              <li key={i} className="text-sm text-blue-700">
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---- New Project Modal ----

const defaultNewProject: Omit<Project, "id"> = {
  name: "",
  typ: "Wohnbau",
  region: "Baden-Württemberg",
  bauvolumen: 30,
  geschosse: 5,
  betonanteil: 60,
  wandflaeche: 8000,
  deckenflaeche: 5000,
  wandhoehe: 3.0,
  bauphase: "Planung",
  bauunternehmen: "",
  betonqualitaet: "Normalbeton",
  bauzeit: 14,
  komplexitaet: "mittel",
};

function NewProjectModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (p: Project) => void;
}) {
  const [form, setForm] = useState(defaultNewProject);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      ...form,
      id: `P-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: form.name || "Neues Projekt",
      bauunternehmen: form.bauunternehmen || "Noch nicht bekannt",
    });
  }

  function update(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const inputClass =
    "w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#e8221b]";
  const labelClass = "block text-xs font-medium text-muted mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-xl w-[640px] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Neues Projekt analysieren</h2>
            <p className="text-xs text-muted mt-0.5">
              Projektdaten eingeben — KI bewertet automatisch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Projektname</label>
              <input
                className={inputClass}
                placeholder="z.B. Wohnquartier am Rhein"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Projekttyp</label>
              <select
                className={inputClass}
                value={form.typ}
                onChange={(e) => update("typ", e.target.value)}
              >
                {["Wohnbau", "Gewerbe", "Krankenhaus", "Industrie", "Infrastruktur"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className={labelClass}>Region</label>
              <select
                className={inputClass}
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
              >
                {[
                  "Baden-Württemberg",
                  "Bayern",
                  "Hessen",
                  "NRW",
                  "Niedersachsen",
                  "Berlin",
                  "Sachsen",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bauvolumen (Mio. €)</label>
              <input
                type="number"
                className={inputClass}
                value={form.bauvolumen}
                onChange={(e) => update("bauvolumen", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Geschosse</label>
              <input
                type="number"
                className={inputClass}
                value={form.geschosse}
                onChange={(e) => update("geschosse", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Betonanteil (%)</label>
              <input
                type="number"
                className={inputClass}
                value={form.betonanteil}
                onChange={(e) => update("betonanteil", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Wandfläche (m²)</label>
              <input
                type="number"
                className={inputClass}
                value={form.wandflaeche}
                onChange={(e) => update("wandflaeche", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Wandhöhe (m)</label>
              <input
                type="number"
                step="0.5"
                className={inputClass}
                value={form.wandhoehe}
                onChange={(e) => update("wandhoehe", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Bauphase</label>
              <select
                className={inputClass}
                value={form.bauphase}
                onChange={(e) => update("bauphase", e.target.value)}
              >
                {["Planung", "Ausschreibung", "Rohbau"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Betonqualität</label>
              <select
                className={inputClass}
                value={form.betonqualitaet}
                onChange={(e) => update("betonqualitaet", e.target.value)}
              >
                {["Normalbeton", "Sichtbeton"].map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bauzeit (Monate)</label>
              <input
                type="number"
                className={inputClass}
                value={form.bauzeit}
                onChange={(e) => update("bauzeit", +e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Bauunternehmen</label>
              <input
                className={inputClass}
                placeholder="Optional"
                value={form.bauunternehmen}
                onChange={(e) => update("bauunternehmen", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-background"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-[#e8221b] text-white rounded-lg hover:bg-[#c41a14] transition-colors"
            >
              KI-Analyse starten
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Page ----

export default function LeadScoringPage() {
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedId, setSelectedId] = useState(sampleProjects[0].id);
  const [showModal, setShowModal] = useState(false);
  const { loading, ready } = useAiDelay(selectedId);

  const scoredProjects = projects
    .map((p) => ({ project: p, score: scoreProject(p) }))
    .sort((a, b) => b.score.opportunityScore - a.score.opportunityScore);

  const selected = scoredProjects.find((s) => s.project.id === selectedId) ||
    scoredProjects[0];

  function handleAddProject(p: Project) {
    setProjects((prev) => [...prev, p]);
    setSelectedId(p.id);
    setShowModal(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e8221b] flex items-center justify-center">
            <Target className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Lead-Scoring</h1>
            <p className="text-sm text-muted">
              KI-basierte Projektbewertung und Priorisierung
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e8221b] text-white text-sm font-medium rounded-lg hover:bg-[#c41a14] transition-colors"
        >
          <Plus size={16} />
          Neues Projekt analysieren
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Project List */}
        <div className="col-span-2 space-y-2">
          {scoredProjects.map(({ project, score }) => (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedId === project.id
                  ? "bg-card border-[#e8221b] shadow-sm"
                  : "bg-card border-border hover:border-[#e8221b]/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">{project.id}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    score.empfehlung === "Sofort bearbeiten"
                      ? "bg-green-100 text-green-700"
                      : score.empfehlung === "Beobachten"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {score.empfehlung}
                </span>
              </div>
              <p className="font-medium text-sm mb-2">{project.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {project.typ} — {project.region}
                </span>
                <ScoreBar value={score.opportunityScore} />
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="col-span-3 bg-card rounded-xl border border-border p-6 relative">
          <AiLoadingOverlay
            isLoading={loading}
            label="KI analysiert Projektdaten"
          />
          {selected && (
            <ProjectDetail
              project={selected.project}
              score={selected.score}
              ready={ready}
            />
          )}
        </div>
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProject}
        />
      )}
    </div>
  );
}
