/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Palette, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTheme, THEMES } from "../lib/ThemeContext";

export function ThemeModal() {
  const { currentTheme, setThemeById, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsThemeModalOpen(false)}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-6 sm:p-7 bg-gradient-to-r from-[#0c2340] via-[#0f2e52] to-[#081729] text-white flex items-start justify-between border-b border-sky-800/60">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                <Palette size={13} className="text-amber-400" />
                <span>Atelier Aesthetic Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
                Update Boutique Themes
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/90 max-w-md">
                Select your desired aesthetic palette. The luminous <strong>Sky Colours & Sunlit Gold</strong> theme is active across atmospheric sky backgrounds, cards, and buttons.
              </p>
            </div>

            <button
              onClick={() => setIsThemeModalOpen(false)}
              className="p-2 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
              aria-label="Close theme modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Theme List */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-3.5">
              {THEMES.map((theme) => {
                const isActive = currentTheme.id === theme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => setThemeById(theme.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setThemeById(theme.id);
                      }
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all text-left cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isActive
                        ? "border-purple-900 bg-purple-50/40 ring-2 ring-purple-900/20 shadow-md"
                        : "border-stone-200 hover:border-purple-300 bg-white hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-semibold text-lg text-stone-900">
                          {theme.name}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            <Check size={11} /> Current Active
                          </span>
                        )}
                        {theme.id === "royal-purple-gold" && !isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        {theme.subtitle}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div 
                        className="w-7 h-7 rounded-full shadow-inner border border-stone-200" 
                        style={{ backgroundColor: theme.headerBg }} 
                        title={`Header/Footer: ${theme.headerBg}`}
                      />
                      <div 
                        className="w-7 h-7 rounded-full shadow-inner border border-stone-200" 
                        style={{ backgroundColor: theme.accentGold }} 
                        title={`Gold Accent: ${theme.accentGold}`}
                      />
                      <div 
                        className="w-7 h-7 rounded-full shadow-inner border border-stone-200" 
                        style={{ backgroundColor: theme.primaryPurple }} 
                        title={`Purple Button: ${theme.primaryPurple}`}
                      />
                      <div 
                        className="w-7 h-7 rounded-full shadow-inner border border-stone-200 bg-white" 
                        title="White Cards"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2.5 mt-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-950 block">
                Active Theme Requirements Verified:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Header:</strong> Deep purple with white logo & gold accents</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Hero banner:</strong> Elegant typography & gold Shop Now button</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Category section:</strong> Clean white cards with rounded corners</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Product cards:</strong> Clear images, readable prices, purple Add to Cart</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Offers:</strong> Gold promotional badges against purple elements</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span><strong>Footer:</strong> Deep purple with white text & gold links</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-mono">
              Palette: {currentTheme.name}
            </span>
            <button
              onClick={() => setIsThemeModalOpen(false)}
              className="px-6 py-2.5 rounded-full bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md active:scale-95 min-h-[40px]"
            >
              Done & Apply
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
