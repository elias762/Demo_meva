"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Calculator,
  Users,
  TrendingUp,
  Database,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lead-scoring", label: "Lead-Scoring", icon: Target },
  { href: "/kalkulation", label: "Kalkulation", icon: Calculator },
  { href: "/copilot", label: "Vertriebs-Copilot", icon: Users },
  { href: "/upselling", label: "Cross-/Upselling", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-text flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/meva-logo.png"
            alt="MEVA"
            width={110}
            height={28}
            className="brightness-0 invert"
            priority
          />
          <div className="w-2 h-2 rounded-full bg-[#e8221b] animate-live-pulse" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-text/50 mt-2 font-medium">
          AI Sales Intelligence
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-text hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-3 border-t border-white/10">
        <div className="px-3 py-2 rounded-lg bg-white/5">
          <p className="text-[10px] uppercase tracking-wide text-sidebar-text/40 mb-0.5">
            Region
          </p>
          <p className="text-xs text-sidebar-text/80 font-medium">
            Baden-Württemberg Süd
          </p>
        </div>
        <div className="px-3 py-2 rounded-lg bg-white/5">
          <p className="text-[10px] uppercase tracking-wide text-sidebar-text/40 mb-1.5 flex items-center gap-1">
            <Database size={9} />
            Datenquellen
          </p>
          <div className="flex flex-wrap gap-1">
            {["CRM", "BKI", "DTVP", "ERP"].map((src) => (
              <span
                key={src}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-sidebar-text/50"
              >
                {src}
              </span>
            ))}
          </div>
        </div>
        <div className="px-3 py-1 text-[10px] text-sidebar-text/30">
          Prototyp / Demo
        </div>
      </div>
    </aside>
  );
}
