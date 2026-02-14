"use client";

import { useEffect, useState, useRef } from "react";
import { Brain } from "lucide-react";

// ---- AI Loading Overlay ----

export function AiLoadingOverlay({
  isLoading,
  label = "KI analysiert Daten",
}: {
  isLoading: boolean;
  label?: string;
}) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={20} className="text-[#e8221b]" />
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#e8221b] ai-dot-1" />
        <div className="w-2 h-2 rounded-full bg-[#e8221b] ai-dot-2" />
        <div className="w-2 h-2 rounded-full bg-[#e8221b] ai-dot-3" />
      </div>
    </div>
  );
}

// ---- Animated Counter ----

export function AnimatedNumber({
  value,
  duration = 1200,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals).replace(".", ",")
      : Math.round(display).toLocaleString("de-DE");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ---- AI analysis hook ----

export function useAiDelay(dependency: string, ms = 1400) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(true);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setLoading(true);
    setReady(false);
    const t = setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, ms);
    return () => clearTimeout(t);
  }, [dependency, ms]);

  return { loading, ready };
}

// ---- Staggered list items ----

export function StaggeredList({
  items,
  ready,
  renderItem,
}: {
  items: string[];
  ready: boolean;
  renderItem: (item: string, index: number) => React.ReactNode;
}) {
  const [visibleCount, setVisibleCount] = useState(items.length);

  useEffect(() => {
    if (!ready) {
      setVisibleCount(0);
      return;
    }
    setVisibleCount(0);
    items.forEach((_, i) => {
      setTimeout(() => setVisibleCount((c) => c + 1), (i + 1) * 200);
    });
  }, [ready, items]);

  return (
    <>
      {items.slice(0, visibleCount).map((item, i) => (
        <div key={i} className="animate-fade-in-up">
          {renderItem(item, i)}
        </div>
      ))}
    </>
  );
}

// ---- Badges ----

export function PrioBadge({ level }: { level: "hoch" | "mittel" | "niedrig" }) {
  const styles = {
    hoch: "bg-red-100 text-[#e8221b]",
    mittel: "bg-amber-100 text-amber-800",
    niedrig: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
}

export function RiskBadge({ level }: { level: "niedrig" | "mittel" | "hoch" }) {
  const styles = {
    niedrig: "bg-green-100 text-green-800",
    mittel: "bg-amber-100 text-amber-800",
    hoch: "bg-red-100 text-[#e8221b]",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
}

// ---- AI Summary Box ----

export function AiSummaryBox({ text, ready }: { text: string; ready?: boolean }) {
  const show = ready === undefined ? true : ready;
  if (!show) return null;

  return (
    <div className="bg-[#fef9f0] border border-[#e89a1b]/30 rounded-lg p-4 mb-6 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <Brain size={16} className="text-[#e8221b] mt-0.5 shrink-0" />
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ---- Ghost Action Buttons ----

export function ActionButtons() {
  const [toast, setToast] = useState<string | null>(null);

  function handleClick(label: string) {
    setToast(label);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        {["PDF generieren", "An CRM senden", "Meeting einladen"].map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-muted hover:border-[#e8221b]/30 hover:text-foreground transition-all"
          >
            {label}
          </button>
        ))}
      </div>
      {toast && (
        <div className="absolute top-full mt-2 left-0 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-lg animate-fade-in-up">
          Verfügbar in der Vollversion — {toast}
        </div>
      )}
    </div>
  );
}
