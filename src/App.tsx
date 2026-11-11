/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Settings, Palette } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
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
  const [priceFilter, setPriceFilter] = useState("all");

  const handleOrderSuccess = (orderId: string) => {
    setHighlightOrderId(orderId);
    setIsOrdersOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#e5e9f0] py-0 sm:py-4 px-0 sm:px-2 font-sans text-slate-800">
      
      {/* Fixed-Width Centered Portal Container (1240px) */}
      <div className="max-w-[1240px] mx-auto bg-white border-x border-b border-slate-300 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Gradient Header & Navigation Bar */}
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

        {/* Main Body: Desktop-First 12-Column Layout */}
        <main className="p-3 sm:p-5 bg-slate-50/70 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Classic Sidebar Menus (3 cols) */}
            <div className="lg:col-span-3">
              <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                activePage={activePage}
                onNavigate={setActivePage}
                onOpenContact={() => setIsContactOpen(true)}
                priceFilter={priceFilter}
                onSelectPriceFilter={setPriceFilter}
              />
            </div>

            {/* Right Column: Main Content Area (9 cols) */}
            <div className="lg:col-span-9 space-y-5 min-w-0">
              {activePage === "cakes" ? (
                <CakesPage onBackToHome={() => setActivePage("bouquets")} />
              ) : (
                <>
                  {/* Box 1: Hero Featured Collection */}
                  <Hero onNavigate={setActivePage} />

                  {/* Box 2: Category Department Cards */}
                  <CategorySection 
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Box 3: Limited-Time Privileges & Coupons */}
                  <OffersSection />

                  {/* Box 4: Curated Product Catalog Grid */}
                  <ProductGrid 
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    priceFilter={priceFilter}
                  />

                  {/* Box 5: Interactive 3D Bouquet Atelier */}
                  <BouquetBuilder />

                  {/* Box 6: Founder's Story & Heritage */}
                  <Story />

                  {/* Box 7: Daily Studio Showcase */}
                  <SocialShowcase />
                </>
              )}
            </div>

          </div>
        </main>

        {/* Traditional Footer */}
        <Footer onOpenContact={() => setIsContactOpen(true)} />

      </div>

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
