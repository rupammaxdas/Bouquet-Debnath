/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Check, 
  Info, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  Layers, 
  Palette, 
  Heart,
  ChevronRight,
  Eye
} from "lucide-react";
import { useCart } from "../lib/CartContext";

interface FlowerItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  color: string;
  scent: string;
  bloomSize: number;
  role: "focal" | "accent" | "cloud" | "greenery";
}

interface WrapItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  accentColor: string;
}

const FLOWERS: FlowerItem[] = [
  {
    id: "rose",
    name: "Red Naomi Rose",
    category: "Romantic Focal",
    price: 150,
    image: "./assets/images/flower_rose_red_1790273599173.jpg",
    color: "#be123c",
    scent: "Rich velvety damask rose",
    bloomSize: 110,
    role: "focal",
  },
  {
    id: "peony",
    name: "Sarah Bernhardt Peony",
    category: "Lush Luxury",
    price: 250,
    image: "./assets/images/flower_peony_pink_1790273612441.jpg",
    color: "#f472b6",
    scent: "Sweet springtime powder",
    bloomSize: 125,
    role: "focal",
  },
  {
    id: "lily",
    name: "Casablanca White Lily",
    category: "Dramatic Grace",
    price: 200,
    image: "./assets/images/flower_lily_white_1790273624346.jpg",
    color: "#e2e8f0",
    scent: "Intense exotic oriental perfume",
    bloomSize: 130,
    role: "focal",
  },
  {
    id: "hydrangea",
    name: "Endless Sky Hydrangea",
    category: "Cloud Volume",
    price: 220,
    image: "./assets/images/flower_hydrangea_blue_1790407851767.jpg",
    color: "#60a5fa",
    scent: "Crisp fresh morning mist",
    bloomSize: 135,
    role: "cloud",
  },
  {
    id: "ranunculus",
    name: "Golden Buttercup Ranunculus",
    category: "Artisan Accent",
    price: 180,
    image: "./assets/images/flower_ranunculus_gold_1790407866293.jpg",
    color: "#eab308",
    scent: "Delicate honey blossoms",
    bloomSize: 100,
    role: "accent",
  },
  {
    id: "eucalyptus",
    name: "Silver Dollar Eucalyptus",
    category: "Aromatic Greenery",
    price: 100,
    image: "./assets/images/flower_eucalyptus_1790273636505.jpg",
    color: "#10b981",
    scent: "Crisp soothing herbal notes",
    bloomSize: 120,
    role: "greenery",
  },
];

const WRAPS: WrapItem[] = [
  {
    id: "kraft",
    name: "Rustic Eco Kraft",
    description: "Handcrafted natural brown kraft paper with authentic texture",
    price: 150,
    image: "./assets/images/wrap_kraft_paper_1790273651373.jpg",
    accentColor: "#b45309",
  },
  {
    id: "silk",
    name: "Lustrous White Silk",
    description: "Flowing bridal silk weave with a soft pearlescent sheen",
    price: 350,
    image: "./assets/images/wrap_silk_white_1790273662268.jpg",
    accentColor: "#e2e8f0",
  },
  {
    id: "velvet",
    name: "Forest Emerald Velvet",
    description: "Opulent heavyweight velvet fabric for bespoke drama",
    price: 450,
    image: "./assets/images/wrap_velvet_green_1790273673715.jpg",
    accentColor: "#065f46",
  },
];

const RIBBONS = [
  { id: "gold", name: "Champagne Satin", color: "#d97706" },
  { id: "burgundy", name: "Royal Burgundy", color: "#881337" },
  { id: "sage", name: "Olive Grosgrain", color: "#4d7c0f" },
  { id: "onyx", name: "Midnight Charcoal", color: "#1c1917" },
];

const STYLES = [
  { id: "dome", name: "Classic Dome", tag: "Symmetric & Full" },
  { id: "cascade", name: "Modern Cascade", tag: "Architectural Height" },
  { id: "wild", name: "Whimsical Meadow", tag: "Organic & Airy" },
];

interface PresetItem {
  name: string;
  counts: Record<string, number>;
  wrap: string;
  ribbon: string;
  style: string;
}

const PRESETS: PresetItem[] = [
  {
    name: "Romantic Radiance",
    counts: { rose: 6, peony: 4, eucalyptus: 3 },
    wrap: "velvet",
    ribbon: "burgundy",
    style: "dome",
  },
  {
    name: "Pastel Cloud",
    counts: { hydrangea: 2, peony: 4, lily: 2, eucalyptus: 2 },
    wrap: "silk",
    ribbon: "gold",
    style: "cascade",
  },
  {
    name: "Sunny Garden",
    counts: { ranunculus: 5, rose: 3, lily: 2, eucalyptus: 3 },
    wrap: "kraft",
    ribbon: "sage",
    style: "wild",
  },
];

export function BouquetBuilder() {
  const [selections, setSelections] = useState<Record<string, number>>({
    rose: 3,
    peony: 2,
    eucalyptus: 2,
  });
  const [selectedWrap, setSelectedWrap] = useState<string>("kraft");
  const [selectedRibbon, setSelectedRibbon] = useState<string>("gold");
  const [arrangementStyle, setArrangementStyle] = useState<string>("dome");
  const [hoveredFlower, setHoveredFlower] = useState<string | null>(null);
  const [activeStemInfo, setActiveStemInfo] = useState<{ id: string; name: string; index: number } | null>(null);
  const [addedToast, setAddedToast] = useState(false);

  // Total stem calculations
  const totalStems = useMemo(() => 
    Object.values(selections).reduce((acc, curr) => acc + curr, 0)
  , [selections]);

  const totalPrice = useMemo(() => {
    const flowerCost = Object.entries(selections).reduce((acc, [id, count]) => {
      const flower = FLOWERS.find((f) => f.id === id);
      return acc + (flower?.price || 0) * count;
    }, 0);
    const wrapCost = WRAPS.find((w) => w.id === selectedWrap)?.price || 0;
    return flowerCost + wrapCost;
  }, [selections, selectedWrap]);

  const updateCount = (id: string, delta: number) => {
    setSelections((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const setExactCount = (id: string, count: number) => {
    setSelections((prev) => {
      if (count <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: count };
    });
  };

  const handleReset = () => {
    setSelections({});
    setActiveStemInfo(null);
  };

  const handleRandomize = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setSelections(randomPreset.counts);
    setSelectedWrap(randomPreset.wrap);
    setSelectedRibbon(randomPreset.ribbon);
    setArrangementStyle(randomPreset.style);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSelections(preset.counts);
    setSelectedWrap(preset.wrap);
    setSelectedRibbon(preset.ribbon);
    setArrangementStyle(preset.style);
  };

  const { addToCart } = useCart();

  const handleAddToBag = async () => {
    if (totalStems === 0) return;
    
    await addToCart({
      name: `Bespoke ${activeWrapObj.name} Bouquet`,
      price: totalPrice,
      quantity: 1,
      image: activeWrapObj.image,
      type: "bespoke",
      details: {
        wrap: activeWrapObj.name,
        ribbon: activeRibbonObj.name,
        style: arrangementStyle,
        stems: selections,
        totalStems,
        summary: `${totalStems} stems wrapped in ${activeWrapObj.name} with ${activeRibbonObj.name} ribbon`,
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3500);
  };

  // Bouquet Capacity Scale Label
  const bouquetTier = useMemo(() => {
    if (totalStems === 0) return { label: "Empty Canvas", color: "text-stone-400" };
    if (totalStems <= 6) return { label: "Petite Posy", color: "text-amber-700" };
    if (totalStems <= 12) return { label: "Classic Studio Bouquet", color: "text-stone-900" };
    if (totalStems <= 18) return { label: "Deluxe Grand Arrangement", color: "text-emerald-700" };
    return { label: "Masterpiece Botanical Tribute", color: "text-purple-700" };
  }, [totalStems]);

  // Compute dynamic positions for all stems based on flower roles and arrangement style
  const bouquetStems = useMemo(() => {
    interface StemData {
      key: string;
      flower: FlowerItem;
      index: number;
      x: number;
      y: number;
      rotate: number;
      scale: number;
      zIndex: number;
      stemCurve: string;
    }

    const stemsList: StemData[] = [];
    let stemCounter = 0;

    // Separate items by role for natural florist botanical layering
    const roleOrder: FlowerItem["role"][] = ["greenery", "cloud", "focal", "accent"];

    roleOrder.forEach((role) => {
      Object.entries(selections).forEach(([flowerId, count]) => {
        const flower = FLOWERS.find((f) => f.id === flowerId);
        if (!flower || flower.role !== role || count <= 0) return;

        for (let i = 0; i < count; i++) {
          stemCounter++;
          const t = count === 1 ? 0.5 : i / (count - 1);
          
          let angleRange = 40;
          let baseRadius = 140;
          let yFactor = 1;

          if (arrangementStyle === "cascade") {
            angleRange = role === "greenery" ? 56 : 32;
            baseRadius = role === "greenery" ? 175 : 135;
            yFactor = 1.25;
          } else if (arrangementStyle === "wild") {
            angleRange = 60;
            baseRadius = 160 + ((i % 3) * 15);
            yFactor = 0.95;
          } else {
            // Classic Dome
            angleRange = 44;
            baseRadius = 135;
            yFactor = 0.98;
          }

          // Greenery spreads wider to frame
          if (role === "greenery") {
            angleRange += 16;
          }

          const spreadAngle = (t - 0.5) * angleRange * 2;
          const wobble = Math.sin((stemCounter * 1.9)) * 8;
          const finalAngle = spreadAngle + wobble;

          const rad = (finalAngle * Math.PI) / 180;
          // Coordinates relative to tie point (center X: 0, tie Y: 150)
          const stemRadius = baseRadius + (Math.cos(rad) * 20) - (Math.abs(spreadAngle) * 0.4);
          
          const x = Math.sin(rad) * stemRadius;
          const y = -Math.cos(rad) * (stemRadius * yFactor) + 60;

          // Stem Bezier path to tie point (0, 160)
          const tieX = 0;
          const tieY = 160;
          const ctrlX = x * 0.45;
          const ctrlY = y + (tieY - y) * 0.55;
          const stemCurve = `M ${tieX} ${tieY} Q ${ctrlX} ${ctrlY} ${x} ${y + 35}`;

          // Scale and z-index determination
          let zIndex = 20;
          if (role === "greenery") zIndex = 12 + (i % 3);
          else if (role === "cloud") zIndex = 16 + (i % 2);
          else if (role === "focal") zIndex = 22 + (i % 4);
          else zIndex = 26 + (i % 3);

          const scale = 0.85 + (Math.sin(stemCounter) * 0.1) + (flower.bloomSize / 150) * 0.2;

          stemsList.push({
            key: `${flower.id}-${i}-${stemCounter}`,
            flower,
            index: i + 1,
            x,
            y,
            rotate: finalAngle * 0.75,
            scale,
            zIndex,
            stemCurve,
          });
        }
      });
    });

    return stemsList;
  }, [selections, arrangementStyle]);

  const activeWrapObj = WRAPS.find((w) => w.id === selectedWrap) || WRAPS[0];
  const activeRibbonObj = RIBBONS.find((r) => r.id === selectedRibbon) || RIBBONS[0];

  return (
    <section id="bespoke" className="py-24 bg-stone-50/70 border-y border-stone-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={13} className="text-amber-600" />
              <span>Interactive Atelier</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-900 tracking-tight">
              Dynamic Bouquet Builder
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Hand-select individual stems, craft your silhouette, and preview your one-of-a-kind arrangement in real-time.
            </p>
          </div>

          {/* Quick preset selector & reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRandomize}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 text-xs font-semibold transition-all shadow-sm"
              title="Surprise me with a florist mix"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>Surprise Mix</span>
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-red-600 hover:border-red-200 text-xs font-semibold transition-all shadow-sm"
              title="Clear all stems"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Controls (Left) & Dynamic Visual Canvas (Right) */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          
          {/* Controls Column */}
          <div className="flex-1 w-full space-y-10">

            {/* Presets Bar */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                Curated Starting Palettes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className="flex flex-col items-start p-3 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all text-left group"
                  >
                    <span className="text-xs font-semibold text-stone-900 group-hover:text-stone-950">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-0.5">
                      {Object.values(preset.counts).reduce((a, b) => a + b, 0)} stems • {preset.wrap}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Flowers Selection Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">1</span>
                    Choose Blooms & Stem Counts
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Tap + or - to see blooms bloom instantly in the bouquet preview</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-stone-200/80 rounded-lg text-stone-800">
                  {totalStems} Total Stems
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {FLOWERS.map((flower) => {
                  const count = selections[flower.id] || 0;
                  const isSelected = count > 0;
                  const isHovered = hoveredFlower === flower.id;

                  return (
                    <div
                      key={flower.id}
                      onMouseEnter={() => setHoveredFlower(flower.id)}
                      onMouseLeave={() => setHoveredFlower(null)}
                      className={`relative p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 bg-white ${
                        isSelected 
                          ? "border-stone-900 shadow-md ring-1 ring-stone-900/10" 
                          : "border-stone-200/90 hover:border-stone-300"
                      } ${isHovered ? "bg-amber-50/20" : ""}`}
                    >
                      {/* Image Thumbnail with Color Tag */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                        <img 
                          src={flower.image} 
                          alt={flower.name} 
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                        <span 
                          className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: flower.color }}
                          title={`Color tone: ${flower.color}`}
                        />
                      </div>

                      {/* Flower details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">
                            {flower.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{flower.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono font-medium text-stone-900">₹{flower.price}</span>
                          <span className="text-[10px] text-stone-400">• per stem</span>
                        </div>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
                          <button
                            type="button"
                            onClick={() => updateCount(flower.id, -1)}
                            disabled={count === 0}
                            className="w-7 h-7 rounded-lg bg-white disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-all shadow-xs"
                            title="Decrease stem"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold text-stone-900">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCount(flower.id, 1)}
                            className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-all shadow-xs"
                            title="Add stem"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Quick count chips */}
                        <div className="flex gap-1">
                          {[3, 6].map((qCount) => (
                            <button
                              key={qCount}
                              onClick={() => setExactCount(flower.id, count === qCount ? 0 : qCount)}
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                                count === qCount
                                  ? "bg-stone-800 text-white font-bold"
                                  : "text-stone-400 hover:text-stone-700 bg-stone-50"
                              }`}
                            >
                              +{qCount}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Silhouette Style Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">2</span>
                Arrangement Silhouette Style
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setArrangementStyle(st.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      arrangementStyle === st.id
                        ? "border-stone-900 bg-stone-900 text-white shadow-md"
                        : "border-stone-200 bg-white text-stone-900 hover:border-stone-400"
                    }`}
                  >
                    <span className="text-xs font-bold block">{st.name}</span>
                    <span className={`text-[10px] mt-1 block ${arrangementStyle === st.id ? "text-stone-300" : "text-stone-500"}`}>
                      {st.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Luxury Wrapping Paper Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">3</span>
                  Artisan Wrapping Paper
                </h3>
                <span className="text-xs text-stone-500">
                  {activeWrapObj.name} (+₹{activeWrapObj.price})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {WRAPS.map((wrap) => {
                  const isWrapSelected = selectedWrap === wrap.id;
                  return (
                    <button
                      key={wrap.id}
                      onClick={() => setSelectedWrap(wrap.id)}
                      className={`relative p-3 rounded-2xl border transition-all text-left bg-white group flex flex-col gap-3 ${
                        isWrapSelected 
                          ? "border-stone-900 ring-2 ring-stone-900/10 shadow-md" 
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60">
                        <img 
                          src={wrap.image} 
                          alt={wrap.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isWrapSelected && (
                          <div className="absolute top-2 right-2 bg-stone-900 text-white rounded-full p-1 shadow-md">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{wrap.name}</span>
                          <span className="text-[11px] font-mono text-stone-500 font-semibold">₹{wrap.price}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 leading-normal">
                          {wrap.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Silk Ribbon Finishes */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">4</span>
                Hand-Tied Silk Ribbon
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {RIBBONS.map((ribbon) => (
                  <button
                    key={ribbon.id}
                    onClick={() => setSelectedRibbon(ribbon.id)}
                    className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-medium transition-all ${
                      selectedRibbon === ribbon.id
                        ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-xs" 
                      style={{ backgroundColor: ribbon.color }}
                    />
                    <span>{ribbon.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Dynamic Visualizer (Right Sticky Column) */}
          <div className="w-full lg:w-[480px] shrink-0 sticky top-28 space-y-6">
            
            {/* Visualizer Frame */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200/90 border border-stone-200 shadow-2xl flex flex-col justify-between p-6">
              
              {/* Studio Canvas Status Header */}
              <div className="relative z-30 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-stone-800">Live Floral Studio</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm ${bouquetTier.color}`}>
                    {bouquetTier.label}
                  </span>
                </div>
              </div>

              {/* Dynamic Arrangement Core */}
              <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden select-none">
                
                {/* SVG STEM LINES (Connecting all flowers to tie point) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="-200 -180 400 400">
                  {bouquetStems.map((stem) => (
                    <path
                      key={`stem-line-${stem.key}`}
                      d={stem.stemCurve}
                      stroke="#27272a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity={hoveredFlower === stem.flower.id ? "0.9" : "0.55"}
                      fill="none"
                    />
                  ))}
                </svg>

                {/* BACK WRAPPING PAPER LAYER (Behind stems & flowers) */}
                <div 
                  className="absolute bottom-6 w-72 h-80 pointer-events-none z-0 transition-all duration-700"
                  style={{
                    backgroundImage: `url(${activeWrapObj.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    clipPath: "polygon(50% 100%, 0% 25%, 20% 0%, 80% 0%, 100% 25%)",
                    filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15)) contrast(0.95)",
                    opacity: totalStems > 0 ? 0.95 : 0.4,
                  }}
                />

                {/* EMPTY CANVAS PLACEHOLDER */}
                <AnimatePresence>
                  {totalStems === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative z-20 text-center p-8 max-w-xs bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-lg"
                    >
                      <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
                        <Sparkles size={24} />
                      </div>
                      <h4 className="font-display font-medium text-stone-900 text-lg">Your Canvas is Ready</h4>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Add roses, peonies, lilies, or eucalyptus from the list to see your bouquet take form bloom by bloom.
                      </p>
                      <button
                        onClick={handleRandomize}
                        className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-all shadow-sm"
                      >
                        Auto-Fill Surprise Bouquet
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* DYNAMIC STEMS & BLOOMS LAYER */}
                {totalStems > 0 && (
                  <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
                    {bouquetStems.map((stem) => {
                      const isHighlighted = hoveredFlower === stem.flower.id;
                      const isSelectedFlower = activeStemInfo?.id === stem.key;

                      return (
                        <motion.div
                          key={stem.key}
                          layout
                          initial={{ opacity: 0, scale: 0, y: 120, rotate: stem.rotate }}
                          animate={{ 
                            opacity: 1, 
                            scale: isHighlighted ? stem.scale * 1.12 : stem.scale,
                            x: stem.x, 
                            y: stem.y, 
                            rotate: stem.rotate,
                          }}
                          exit={{ opacity: 0, scale: 0, y: 80 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 24,
                            mass: 0.8
                          }}
                          onClick={() => setActiveStemInfo({ id: stem.key, name: stem.flower.name, index: stem.index })}
                          className="absolute cursor-pointer transition-shadow"
                          style={{ 
                            zIndex: isHighlighted ? 60 : stem.zIndex,
                            transformOrigin: "center 85%",
                          }}
                        >
                          <div className={`relative group ${isHighlighted ? "filter drop-shadow(0 0 14px rgba(251,191,36,0.85))" : "drop-shadow-lg"}`}>
                            {/* Bloom Image */}
                            <img
                              src={stem.flower.image}
                              alt={stem.flower.name}
                              className="w-36 h-36 object-contain pointer-events-none select-none mix-blend-multiply"
                              style={{
                                filter: isHighlighted ? "brightness(1.08)" : "none"
                              }}
                            />

                            {/* Hover / Click indicator dot */}
                            <span 
                              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-md transition-transform ${
                                isHighlighted ? "scale-125 ring-2 ring-amber-400" : "opacity-0 group-hover:opacity-100"
                              }`}
                              style={{ backgroundColor: stem.flower.color }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* FRONT WRAPPING COLLAR & TIE RIBBON (Overlapping lower stems) */}
                <div 
                  className="absolute bottom-2 w-64 h-48 pointer-events-none z-30 transition-all duration-700"
                  style={{
                    backgroundImage: `url(${activeWrapObj.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "bottom center",
                    clipPath: "polygon(50% 100%, 8% 0%, 92% 0%)",
                    filter: "drop-shadow(0 -8px 16px rgba(0,0,0,0.18))",
                    opacity: totalStems > 0 ? 0.98 : 0.6,
                  }}
                />

                {/* HAND-TIED SILK RIBBON & BOW */}
                {totalStems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-16 z-40 flex flex-col items-center pointer-events-none"
                  >
                    {/* Ribbon knot and loops */}
                    <div 
                      className="w-12 h-6 rounded-full shadow-lg border border-white/30 flex items-center justify-center"
                      style={{ backgroundColor: activeRibbonObj.color }}
                    >
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                    </div>
                    {/* Ribbon trailing tails */}
                    <div className="flex gap-2 -mt-1">
                      <div 
                        className="w-2.5 h-14 rounded-b-md shadow-md transform -rotate-12 origin-top"
                        style={{ backgroundColor: activeRibbonObj.color }}
                      />
                      <div 
                        className="w-2.5 h-16 rounded-b-md shadow-md transform rotate-12 origin-top"
                        style={{ backgroundColor: activeRibbonObj.color }}
                      />
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Bottom arrangement summary bar */}
              <div className="relative z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Total Investment</span>
                    <span className="text-2xl font-display font-semibold text-stone-900">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Stem Ratio</span>
                    <span className="text-xs font-mono font-medium text-stone-800">
                      {totalStems} Stems • {Object.keys(selections).length} Blooms
                    </span>
                  </div>
                </div>

                {/* Scent & Care quick tags */}
                {totalStems > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span className="truncate">Wrap: {activeWrapObj.name}</span>
                    <span className="truncate font-medium text-stone-700">Ribbon: {activeRibbonObj.name}</span>
                  </div>
                )}

                {/* Add to Bag CTA */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={totalStems === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={15} />
                  <span>Order Bespoke Arrangement</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Selected Stem Inspector Tooltip */}
            {activeStemInfo && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Inspecting stem: <strong>{activeStemInfo.name}</strong> (#{activeStemInfo.index})</span>
                </div>
                <button 
                  onClick={() => setActiveStemInfo(null)}
                  className="text-stone-400 hover:text-stone-700 font-semibold"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Florist advice card */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200/50">
                <Info size={15} />
              </div>
              <div className="text-xs text-stone-600 leading-relaxed">
                <strong className="font-semibold text-stone-900 block mb-0.5">Debnath Master Florist Tip:</strong>
                Combine 4–6 focal blooms (Peonies or Roses) with 2 sprigs of Eucalyptus to provide airy botanical breathing space and longevity.
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Add to Bag Toast */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-stone-900 text-white shadow-2xl border border-stone-700 flex items-center gap-4 text-xs font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check size={16} />
            </div>
            <div>
              <p className="font-semibold text-sm">Bespoke Bouquet Added to Bag!</p>
              <p className="text-stone-300 text-xs mt-0.5">
                {totalStems} stems hand-wrapped in {activeWrapObj.name} with {activeRibbonObj.name} ribbon.
              </p>
            </div>
            <a
              href="#collection"
              onClick={() => setAddedToast(false)}
              className="ml-3 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-[11px] font-semibold tracking-wide uppercase transition-colors"
            >
              Continue
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
