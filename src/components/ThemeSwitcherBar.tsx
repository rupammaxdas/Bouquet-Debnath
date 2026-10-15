/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Palette, Check, Sparkles, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { useTheme, THEMES } from "../lib/ThemeContext";

export function ThemeSwitcherBar() {
  const { currentTheme, setThemeById, setIsThemeModalOpen, cycleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative z-40 bg-stone-900 text-white text-xs border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Current Active Theme Badge */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-[11px] uppercase tracking-wider border border-amber-400/30">
            <Sparkles size={12} className="text-amber-400" />
            <span>Theme: {currentTheme.name}</span>
          </div>

          <span className="hidden md:inline text-stone-400 text-[11px]">
            {currentTheme.subtitle}
          </span>
        </div>

        {/* Center / Right: Quick 1-Click Theme Presets */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider hidden lg:inline mr-1">
            Switch:
          </span>

          {THEMES.map((theme) => {
            const isActive = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setThemeById(theme.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-white text-stone-950 font-bold shadow-sm ring-2 ring-amber-400"
                    : "bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700"
                }`}
                title={theme.description}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                  style={{ backgroundColor: theme.headerBg }} 
                />
                <span className="truncate max-w-[100px] sm:max-w-none">
                  {theme.name.split(" & ")[0]}
                </span>
                {isActive && <Check size={12} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}

          {/* Full Customizer Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="ml-1 sm:ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-xs"
            title="Open Full Theme Customizer"
          >
            <Sliders size={12} />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>

      </div>
    </div>
  );
}
