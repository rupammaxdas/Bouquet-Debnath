/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  headerBg: string;
  footerBg: string;
  navBorder: string;
  primaryPurple: string;
  primaryPurpleHover: string;
  accentGold: string;
  accentGoldHover: string;
  goldBadgeBg: string;
  goldBadgeText: string;
  previewColors: {
    primary: string;
    accent: string;
    surface: string;
    highlight: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    id: "sky-colours",
    name: "Sky Colours & Sunlit Gold",
    subtitle: "Active Default • Luminous Celestial Sky Edition",
    description: "Atmospheric dawn & azure sky backgrounds, deep twilight sky header (#0c2340), sunlit morning gold accents, clean white cards, and celestial cerulean buttons.",
    headerBg: "#0c2340",
    footerBg: "#081729",
    navBorder: "rgba(56, 189, 248, 0.4)",
    primaryPurple: "#0284c7", // Sky Cerulean
    primaryPurpleHover: "#0369a1",
    accentGold: "#f59e0b", // Sunlit Gold
    accentGoldHover: "#d97706",
    goldBadgeBg: "#e0f2fe",
    goldBadgeText: "#0369a1",
    previewColors: {
      primary: "#0c2340",
      accent: "#38bdf8",
      surface: "#f0f9ff",
      highlight: "#f59e0b"
    }
  },
  {
    id: "royal-purple-gold",
    name: "Royal Purple & Gold",
    subtitle: "Classic Boutique Theme",
    description: "Deep amethyst purple header and footer (#23093b), radiant gold accents, clean white product cards, and royal purple Add to Cart buttons.",
    headerBg: "#23093b",
    footerBg: "#1D062B",
    navBorder: "rgba(107, 33, 168, 0.45)",
    primaryPurple: "#581c87", // purple-900
    primaryPurpleHover: "#6b21a8", // purple-800
    accentGold: "#fbbf24", // amber-400
    accentGoldHover: "#f59e0b", // amber-500
    goldBadgeBg: "#fef3c7",
    goldBadgeText: "#92400e",
    previewColors: {
      primary: "#23093b",
      accent: "#fbbf24",
      surface: "#ffffff",
      highlight: "#7e22ce"
    }
  },
  {
    id: "midnight-velvet-gold",
    name: "Midnight Velvet & Royal Gold",
    subtitle: "Ultra Luxury Atelier Edition",
    description: "Inky midnight plum header and footer with celestial 24k molten gold accents and deep midnight plum action buttons.",
    headerBg: "#170326",
    footerBg: "#0f0119",
    navBorder: "rgba(147, 51, 234, 0.4)",
    primaryPurple: "#3b0764", // purple-950
    primaryPurpleHover: "#581c87",
    accentGold: "#facc15", // yellow-400
    accentGoldHover: "#eab308",
    goldBadgeBg: "#fef9c3",
    goldBadgeText: "#854d0e",
    previewColors: {
      primary: "#170326",
      accent: "#facc15",
      surface: "#ffffff",
      highlight: "#581c87"
    }
  },
  {
    id: "rose-velvet-champagne",
    name: "Rose Velvet & Champagne Gold",
    subtitle: "Romantic Couture Edition",
    description: "Deep romantic wine-purple header and footer paired with warm champagne gold highlights and velvety burgundy accents.",
    headerBg: "#2d0824",
    footerBg: "#1f0518",
    navBorder: "rgba(190, 24, 93, 0.4)",
    primaryPurple: "#701a75", // fuchsia-900
    primaryPurpleHover: "#86198f",
    accentGold: "#fde047", // yellow-300
    accentGoldHover: "#facc15",
    goldBadgeBg: "#fdf4ff",
    goldBadgeText: "#86198f",
    previewColors: {
      primary: "#2d0824",
      accent: "#fde047",
      surface: "#ffffff",
      highlight: "#86198f"
    }
  },
  {
    id: "mystic-violet-gold",
    name: "Mystic Violet & Tuscan Gold",
    subtitle: "Vibrant Contemporary Edition",
    description: "Vivid royal violet tones balanced with warm Tuscan gold and crisp white architectural cards.",
    headerBg: "#2e1065",
    footerBg: "#1e1b4b",
    navBorder: "rgba(168, 85, 247, 0.45)",
    primaryPurple: "#6b21a8", // purple-800
    primaryPurpleHover: "#7e22ce",
    accentGold: "#f59e0b", // amber-500
    accentGoldHover: "#d97706",
    goldBadgeBg: "#fef3c7",
    goldBadgeText: "#78350f",
    previewColors: {
      primary: "#2e1065",
      accent: "#f59e0b",
      surface: "#ffffff",
      highlight: "#9333ea"
    }
  },
  {
    id: "emerald-botanica-gold",
    name: "Emerald Botanica & Royal Gold",
    subtitle: "Fresh Garden Atelier Edition",
    description: "Deep forest botanica header and footer paired with imperial gold accents and rich evergreen action buttons.",
    headerBg: "#052e24",
    footerBg: "#031f18",
    navBorder: "rgba(16, 185, 129, 0.35)",
    primaryPurple: "#065f46", // emerald-800
    primaryPurpleHover: "#047857",
    accentGold: "#fbbf24", // amber-400
    accentGoldHover: "#f59e0b",
    goldBadgeBg: "#ecfdf5",
    goldBadgeText: "#065f46",
    previewColors: {
      primary: "#052e24",
      accent: "#fbbf24",
      surface: "#ffffff",
      highlight: "#059669"
    }
  }
];

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setThemeById: (id: string) => void;
  cycleTheme: () => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  allThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("gift_hub_world_theme");
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch (e) {
      // Ignore
    }
    return "sky-colours";
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  const setThemeById = (id: string) => {
    if (THEMES.some(t => t.id === id)) {
      setCurrentThemeId(id);
      try {
        localStorage.setItem("gift_hub_world_theme", id);
      } catch (e) {
        // Ignore
      }
    }
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === currentTheme.id);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setThemeById(THEMES[nextIndex].id);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-header-bg", currentTheme.headerBg);
    root.style.setProperty("--theme-footer-bg", currentTheme.footerBg);
    root.style.setProperty("--theme-primary-purple", currentTheme.primaryPurple);
    root.style.setProperty("--theme-primary-purple-hover", currentTheme.primaryPurpleHover);
    root.style.setProperty("--theme-accent-gold", currentTheme.accentGold);
    root.style.setProperty("--theme-accent-gold-hover", currentTheme.accentGoldHover);
    root.style.setProperty("--theme-badge-bg", currentTheme.goldBadgeBg);
    root.style.setProperty("--theme-badge-text", currentTheme.goldBadgeText);
    root.style.setProperty("--theme-nav-border", currentTheme.navBorder);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setThemeById,
        cycleTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
        allThemes: THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
