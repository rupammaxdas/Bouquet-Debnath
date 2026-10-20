/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Settings, Palette } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CategorySection } from "./components/CategorySection";
import { OffersSection } from "./components/OffersSection";
import { ProductGrid } from "./components/ProductGrid";
import { BouquetBuilder } from "./components/BouquetBuilder";
import { Story } from "./components/Story";
import { SocialShowcase } from "./components/SocialShowcase";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { OrdersModal } from "./components/OrdersModal";
import { AuthModal } from "./components/AuthModal";
import { ThemeModal } from "./components/ThemeModal";
import { ThemeSwitcherBar } from "./components/ThemeSwitcherBar";
import { CakesPage } from "./components/CakesPage";
import { ContactModal } from "./components/ContactModal";
import { AuthProvider } from "./lib/AuthContext";
import { WishlistProvider } from "./lib/WishlistContext";
import { CartProvider } from "./lib/CartContext";
import { ThemeProvider, useTheme } from "./lib/ThemeContext";

function FloatingThemeButton() {
  const { setIsThemeModalOpen, currentTheme } = useTheme();
  return (
    <button
      onClick={() => setIsThemeModalOpen(true)}
      className="hidden"
      aria-hidden="true"
      title={`Update Themes: ${currentTheme.name}`}
      aria-label="Update Themes"
    >
      <Palette size={15} className="text-amber-400" />
      <span className="tracking-wide">Themes</span>
    </button>
  );
}

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [highlightOrderId, setHighlightOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePage, setActivePage] = useState<"bouquets" | "cakes">("bouquets");

  const handleOrderSuccess = (orderId: string) => {
    setHighlightOrderId(orderId);
    setIsOrdersOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-sky-100/30 to-blue-50/40 font-sans text-stone-900 selection:bg-sky-200 selection:text-sky-950">
      <Navbar 
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenContact={() => setIsContactOpen(true)}
      />
      
      {/* Top Theme Quick Switcher Bar (Hidden as requested) */}
      <div className="hidden" aria-hidden="true">
        <ThemeSwitcherBar />
      </div>

      <main>
        {activePage === "cakes" ? (
          <CakesPage onBackToHome={() => setActivePage("bouquets")} />
        ) : (
          <>
            <Hero />
            <CategorySection 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <OffersSection />
            <ProductGrid 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <BouquetBuilder />
            <Story />
            <SocialShowcase />
          </>
        )}
      </main>
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Floating Theme Quick Action */}
      <FloatingThemeButton />

      {/* E-Commerce Drawers & Modals */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        highlightOrderId={highlightOrderId}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Contact Concierge Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Theme Modal */}
      <ThemeModal />

      {/* Admin Toggle */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="hidden"
        title="Admin Panel"
        aria-label="Admin Studio Panel"
      >
        <Settings size={20} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
      </button>

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ThemeProvider>
            <MainApp />
          </ThemeProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
