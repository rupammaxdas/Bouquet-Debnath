/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowLeft,
  Search,
  X,
  Flame,
  Star,
  CheckCircle2,
  ChevronDown,
  Filter
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";
import { useTheme } from "../lib/ThemeContext";

export interface IndianBakeryCake {
  number: number;
  id: string;
  name: string;
  category: "Indian Mithai Fusion" | "Chocolates & Truffles" | "Classic Bakery Bestsellers" | "Fruit & Floral" | "Gourmet Specials" | "100% Eggless Specials";
  priceHalfKg: number;
  priceOneKg: number;
  image: string;
  description: string;
  tag: string;
  flavors: string[];
  egglessAvailable: boolean;
  bestseller?: boolean;
}

export const INDIAN_BAKERY_FLAVOURS: IndianBakeryCake[] = [
  {
    number: 1,
    id: "cake-black-forest",
    name: "Black Forest Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 549,
    priceOneKg: 999,
    image: "./assets/images/cake_black_forest_1792325134041.jpg",
    description: "Classic Indian bakery favorite: layers of rich chocolate sponge soaked in cherry syrup, loaded with whipped cream, dark chocolate shavings, and glossy maraschino cherries.",
    tag: "All-Time Favorite",
    flavors: ["Dark Chocolate Shavings", "Whipped Sweet Cream", "Maraschino Cherries"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 2,
    id: "cake-white-forest",
    name: "White Forest Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 549,
    priceOneKg: 999,
    image: "./assets/images/cake_berry_floral_1792324210197.jpg",
    description: "Delicate vanilla chiffon sponge layered with vanilla whipped cream, imported white chocolate curls, and red cherry compote.",
    tag: "Classic Delight",
    flavors: ["White Chocolate Curls", "Vanilla Whip", "Red Cherries"],
    egglessAvailable: true
  },
  {
    number: 3,
    id: "cake-chocolate-truffle",
    name: "Chocolate Truffle Cake",
    category: "Chocolates & Truffles",
    priceHalfKg: 699,
    priceOneKg: 1299,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Silky pure Dutch cocoa sponge smothered in rich Belgian chocolate ganache, adorned with edible garden rose petals and 24K edible gold flakes.",
    tag: "Boutique Bestseller",
    flavors: ["Belgian Couverture Ganache", "Dutch Cocoa", "24K Gold Flakes"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 4,
    id: "cake-chocolate-fudge",
    name: "Chocolate Fudge Cake",
    category: "Chocolates & Truffles",
    priceHalfKg: 649,
    priceOneKg: 1199,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Dense, gooey chocolate fudge cake with molten chocolate layers, crispy chocolate pearls, and warm caramelized cocoa glaze.",
    tag: "Ultra Rich",
    flavors: ["Molten Fudge Ganache", "Cocoa Sponge", "Crispy Chocolate Pearls"],
    egglessAvailable: true
  },
  {
    number: 5,
    id: "cake-pineapple-cream",
    name: "Pineapple Cream Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 499,
    priceOneKg: 899,
    image: "./assets/images/cake_butterscotch_1792325150158.jpg",
    description: "The timeless Indian celebration cake: ultra-moist sponge soaked in pineapple nectar, filled with juicy caramelized pineapple tidbits and fresh whipped cream.",
    tag: "Retro Bestseller",
    flavors: ["Sweet Pineapple Tidbits", "Airy Vanilla Cream", "Caramelized Glaze"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 6,
    id: "cake-butterscotch",
    name: "Butterscotch Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 549,
    priceOneKg: 999,
    image: "./assets/images/cake_butterscotch_1792325150158.jpg",
    description: "Golden vanilla sponge layered with caramelized butterscotch cream, topped with generous homemade cashew praline crunch and golden caramel drizzle.",
    tag: "Crowd Favorite",
    flavors: ["Crunchy Cashew Praline", "Brown Butter Toffee", "Caramel Drizzle"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 7,
    id: "cake-red-velvet",
    name: "Red Velvet Cake",
    category: "Gourmet Specials",
    priceHalfKg: 699,
    priceOneKg: 1299,
    image: "./assets/images/cake_red_velvet_delight_1792324542193.jpg",
    description: "Striking crimson cocoa sponge with silky whipped cream cheese frosting rosettes, edible red damask rose petals, and golden shimmer dust.",
    tag: "Romantic Classic",
    flavors: ["Cocoa Red Crumb", "Whipped Cream Cheese", "Rose Petals"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 8,
    id: "cake-vanilla",
    name: "Vanilla Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 449,
    priceOneKg: 799,
    image: "./assets/images/cake_berry_floral_1792324210197.jpg",
    description: "Light-as-air vanilla bean sponge layered with fragrant French cream and colorful celebration sprinkles. Perfect for classic gatherings.",
    tag: "Timeless Simple",
    flavors: ["Pure Vanilla Bean", "Whipped Cream", "Featherlight Sponge"],
    egglessAvailable: true
  },
  {
    number: 9,
    id: "cake-strawberry",
    name: "Strawberry Cake",
    category: "Fruit & Floral",
    priceHalfKg: 599,
    priceOneKg: 1099,
    image: "./assets/images/cake_berry_floral_1792324210197.jpg",
    description: "Pink vanilla sponge layered with Mahabaleshwar strawberry crush, fresh strawberry compote, and delicate white chocolate shavings.",
    tag: "Berry Fresh",
    flavors: ["Mahabaleshwar Strawberry", "Vanilla Creme", "White Chocolate"],
    egglessAvailable: true
  },
  {
    number: 10,
    id: "cake-mango",
    name: "Mango Cake",
    category: "Fruit & Floral",
    priceHalfKg: 649,
    priceOneKg: 1199,
    image: "./assets/images/cake_mango_floral_1792324559661.jpg",
    description: "A seasonal Indian delight: moist sponge soaked in Alphonso mango pulp, layered with fresh mango chunks and glistening golden mango glaze.",
    tag: "King of Fruits",
    flavors: ["Alphonso Mango Puree", "Juicy Mango Chunks", "Golden Glaze"],
    egglessAvailable: true
  },
  {
    number: 11,
    id: "cake-rasmalai",
    name: "Rasmalai Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 799,
    priceOneKg: 1499,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "The crown jewel of Indian fusion baking: cardamom-infused vanilla sponge soaked in saffron rabri milk, topped with mini juicy rasmalai chenna discs, slivered pistachios, and silver vark.",
    tag: "Indian Royal Specialty",
    flavors: ["Saffron Rabri Milk", "Mini Chenna Rasmalai", "Pistachio & Silver Vark"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 12,
    id: "cake-gulab-jamun",
    name: "Gulab Jamun Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 749,
    priceOneKg: 1399,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Warm cardamom sponge layered with rose-scented cream, studded with melt-in-mouth syrup-soaked mini gulab jamuns, roasted almonds, and saffron strands.",
    tag: "Mithai Fusion",
    flavors: ["Mini Gulab Jamuns", "Rose Cardamom Syrup", "Toasted Almonds"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 13,
    id: "cake-kaju-katli",
    name: "Kaju Katli Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 849,
    priceOneKg: 1599,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Rich royal cashew sponge infused with pure cashew paste and cardamom, decorated with authentic diamond-cut silver vark Kaju Katli pieces.",
    tag: "Festive Luxury",
    flavors: ["Pure Cashew Cream", "Diamond Kaju Katli", "Edible Silver Foil"],
    egglessAvailable: true
  },
  {
    number: 14,
    id: "cake-motichoor-laddu",
    name: "Motichoor Laddu Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 749,
    priceOneKg: 1399,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Festive celebration cake made with pure desi ghee motichoor pearl boondi, layered with saffron cardamom cream, roasted pistachios, and gold foil.",
    tag: "Festive Sensation",
    flavors: ["Pure Ghee Motichoor", "Kesar Cardamom Creme", "Roasted Pistachios"],
    egglessAvailable: true
  },
  {
    number: 15,
    id: "cake-kulfi",
    name: "Kulfi Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 799,
    priceOneKg: 1449,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Inspired by traditional matka kulfi: dense mawa sponge infused with condensed milk, crushed green cardamom, saffron, and roasted mixed nuts.",
    tag: "Desi Chill",
    flavors: ["Mawa & Rabri Cream", "Green Cardamom", "Nutty Pista Badam"],
    egglessAvailable: true
  },
  {
    number: 16,
    id: "cake-kesar-pista",
    name: "Kesar Pista Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 749,
    priceOneKg: 1399,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Aromatic Kashmiri saffron infused sponge generously speckled with crunchy California pistachios and wrapped in saffron-tinted velvet buttercream.",
    tag: "Kashmiri Gold",
    flavors: ["Kashmiri Kesar", "Crunchy Pistachio", "Saffron Velour"],
    egglessAvailable: true
  },
  {
    number: 17,
    id: "cake-rabri",
    name: "Rabri Cake",
    category: "Indian Mithai Fusion",
    priceHalfKg: 799,
    priceOneKg: 1499,
    image: "./assets/images/cake_rasmalai_kesar_1792325117942.jpg",
    description: "Multi-layered milk cake soaked in slow-simmered rich rabri malai with visible cream flakes, fragrant cardamom, and edible gold leaf.",
    tag: "Decadent Mithai",
    flavors: ["Slow Simmered Rabri", "Cream Malai Flakes", "Cardamom Aroma"],
    egglessAvailable: true
  },
  {
    number: 18,
    id: "cake-oreo",
    name: "Oreo Cake",
    category: "Chocolates & Truffles",
    priceHalfKg: 599,
    priceOneKg: 1099,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Crushed Oreo cookie buttercream sandwiched between moist dark chocolate sponge layers, frosted with cookie crumbs and whole mini Oreos.",
    tag: "Cookies & Cream",
    flavors: ["Oreo Cookie Buttercream", "Cocoa Sponge", "Crispy Cookie Crumb"],
    egglessAvailable: true
  },
  {
    number: 19,
    id: "cake-kitkat",
    name: "KitKat Cake",
    category: "Chocolates & Truffles",
    priceHalfKg: 699,
    priceOneKg: 1299,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Surrounded by crispy chocolate KitKat fingers with rich chocolate ganache center, finished with M&M gems and celebratory chocolate curls.",
    tag: "Chocolate Overload",
    flavors: ["KitKat Wafer Fingers", "Chocolate Ganache", "Colorful Gems"],
    egglessAvailable: true
  },
  {
    number: 20,
    id: "cake-ferrero-rocher",
    name: "Ferrero Rocher Cake",
    category: "Chocolates & Truffles",
    priceHalfKg: 899,
    priceOneKg: 1699,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Ultra-luxury roasted hazelnut praline cake infused with Nutella spread, topped with golden-wrapped Ferrero Rocher pralines and dark chocolate drip.",
    tag: "Luxury Truffle",
    flavors: ["Roasted Hazelnuts", "Ferrero Rocher Truffles", "Nutella Swirl"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 21,
    id: "cake-coffee",
    name: "Coffee Cake",
    category: "Gourmet Specials",
    priceHalfKg: 599,
    priceOneKg: 1099,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "Rich espresso-infused sponge with velvety mocha buttercream and roasted coffee beans. Perfect accompaniment for evening tea or sophisticated parties.",
    tag: "Mocha Aroma",
    flavors: ["Dark Roasted Espresso", "Mocha Buttercream", "Cocoa Dust"],
    egglessAvailable: true
  },
  {
    number: 22,
    id: "cake-fruit",
    name: "Fruit Cake",
    category: "Fruit & Floral",
    priceHalfKg: 549,
    priceOneKg: 999,
    image: "./assets/images/cake_mango_floral_1792324559661.jpg",
    description: "Traditional moist fruit loaf cake studded with golden sultanas, candied cherries, orange peel, and warm spices. Deliciously fragrant and dense.",
    tag: "Traditional Baker",
    flavors: ["Candied Cherries", "Orange Peel & Raisins", "Aromatic Spices"],
    egglessAvailable: true
  },
  {
    number: 23,
    id: "cake-plum",
    name: "Plum Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 599,
    priceOneKg: 1099,
    image: "./assets/images/cake_black_forest_1792325134041.jpg",
    description: "Authentic Anglo-Indian festive plum cake baked with dry fruits soaked for weeks in non-alcoholic fruit juices, cinnamon, nutmeg, and black treacle.",
    tag: "Heritage Recipe",
    flavors: ["Soaked Black Plums", "Cinnamon & Nutmeg", "Caramel Treacle"],
    egglessAvailable: true
  },
  {
    number: 24,
    id: "cake-honey",
    name: "Honey Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 499,
    priceOneKg: 899,
    image: "./assets/images/cake_butterscotch_1792325150158.jpg",
    description: "Iconic South Indian Iyengar-style bakery honey cake: fluffy sponge soaked in aromatic honey syrup, topped with mixed fruit jam and desiccated coconut.",
    tag: "Bakery Nostalgia",
    flavors: ["Pure Honey Syrup", "Mixed Fruit Jam", "Toasted Coconut"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 25,
    id: "cake-marble",
    name: "Marble Cake",
    category: "Classic Bakery Bestsellers",
    priceHalfKg: 499,
    priceOneKg: 899,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "A whimsical swirl of rich chocolate and fragrant vanilla batter, creating an artistic marbled pattern in every slice with milk chocolate glaze.",
    tag: "Dual Flavor",
    flavors: ["Swirled Cocoa & Vanilla", "Milk Chocolate Glaze", "Buttery Crumb"],
    egglessAvailable: true
  },
  {
    number: 26,
    id: "cake-eggless-chocolate",
    name: "Eggless Chocolate Cake",
    category: "100% Eggless Specials",
    priceHalfKg: 599,
    priceOneKg: 1099,
    image: "./assets/images/cake_chocolate_truffle_1792324189953.jpg",
    description: "100% vegetarian moist chocolate cake with zero egg compromise: silky chocolate sponge with fresh cocoa buttercream and dark chocolate curls.",
    tag: "100% Pure Veg",
    flavors: ["Pure Veg Cocoa Sponge", "Dark Chocolate Curls", "Silky Ganache"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 27,
    id: "cake-eggless-vanilla",
    name: "Eggless Vanilla Cake",
    category: "100% Eggless Specials",
    priceHalfKg: 499,
    priceOneKg: 899,
    image: "./assets/images/cake_berry_floral_1792324210197.jpg",
    description: "100% pure vegetarian vanilla sponge prepared with condensed milk and butter, frosted with fresh dairy cream and edible floral sprinkles.",
    tag: "100% Pure Veg",
    flavors: ["Pure Veg Vanilla", "Fresh Dairy Cream", "Floral Sprinkles"],
    egglessAvailable: true
  },
  {
    number: 28,
    id: "cake-fresh-fruit",
    name: "Fresh Fruit Cake",
    category: "Fruit & Floral",
    priceHalfKg: 699,
    priceOneKg: 1299,
    image: "./assets/images/cake_mango_floral_1792324559661.jpg",
    description: "Light vanilla sponge overflowing with seasonal orchard fruits: kiwi slices, pomegranate pearls, black grapes, dragonfruit, pineapple tidbits, and apricot glaze.",
    tag: "Garden Fresh",
    flavors: ["Fresh Exotic Fruits", "Apricot Fruit Glaze", "Light Vanilla Whip"],
    egglessAvailable: true,
    bestseller: true
  },
  {
    number: 29,
    id: "cake-blueberry",
    name: "Blueberry Cake",
    category: "Fruit & Floral",
    priceHalfKg: 699,
    priceOneKg: 1299,
    image: "./assets/images/cake_berry_floral_1792324210197.jpg",
    description: "Moist vanilla-blueberry sponge filled with imported tart wild blueberry compote and light purple whipped blueberry mascarpone cream.",
    tag: "Berry Bliss",
    flavors: ["Wild Blueberry Compote", "Berry Mascarpone", "White Chocolate Pearls"],
    egglessAvailable: true
  },
  {
    number: 30,
    id: "cake-lotus-biscoff",
    name: "Lotus Biscoff Cake",
    category: "Gourmet Specials",
    priceHalfKg: 849,
    priceOneKg: 1599,
    image: "./assets/images/cake_butterscotch_1792325150158.jpg",
    description: "Trendsetting patisserie creation: spiced Belgian Lotus Biscoff speculoos spread layered with caramelized cinnamon cookie crumb and crunchy Biscoff biscuits.",
    tag: "Modern Gourmet",
    flavors: ["Caramelized Biscoff Spread", "Speculoos Cookie Crumbs", "Cinnamon Cream"],
    egglessAvailable: true,
    bestseller: true
  }
];

interface CakesPageProps {
  onBackToHome: () => void;
}

export function CakesPage({ onBackToHome }: CakesPageProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currentTheme } = useTheme();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Selected Size per card toggle (half kg vs 1kg)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, "half" | "one">>({});

  // Customizer State
  const [customFlavor, setCustomFlavor] = useState<string>(INDIAN_BAKERY_FLAVOURS[10].name); // Rasmalai Cake default
  const [weightOption, setWeightOption] = useState<{ label: string; multiplier: number; size: string }>({ 
    label: "1.0 kg (Serves 8–10)", 
    multiplier: 1.0, 
    size: "1.0 kg" 
  });
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [cakeMessage, setCakeMessage] = useState<string>("Happy Birthday!");
  const [customAdded, setCustomAdded] = useState(false);

  const categories = [
    "All (30 Flavours)",
    "Indian Mithai Fusion",
    "Classic Bakery Bestsellers",
    "Chocolates & Truffles",
    "Fruit & Floral",
    "Gourmet Specials",
    "100% Eggless Specials"
  ];

  const filteredCakes = useMemo(() => {
    return INDIAN_BAKERY_FLAVOURS.filter((cake) => {
      const matchesCategory = 
        activeCategory === "All (30 Flavours)" || 
        activeCategory === "All" ||
        cake.category === activeCategory;

      const matchesSearch = 
        !searchQuery.trim() || 
        cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cake.flavors.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getCakePrice = (cake: IndianBakeryCake, size: "half" | "one") => {
    return size === "half" ? cake.priceHalfKg : cake.priceOneKg;
  };

  const handleAddCatalogCake = async (cake: IndianBakeryCake) => {
    const size = selectedSizes[cake.id] || "one";
    const price = getCakePrice(cake, size);
    const weightLabel = size === "half" ? "0.5 kg" : "1.0 kg";

    await addToCart({
      productId: `${cake.id}-${size}`,
      name: `${cake.name} (${weightLabel})`,
      price: price,
      quantity: 1,
      image: cake.image,
      type: "curated",
    });

    setQuickAddedId(`${cake.id}-${size}`);
    setTimeout(() => setQuickAddedId(null), 1800);
  };

  const handleAddCustomCake = async () => {
    const selectedCakeObj = INDIAN_BAKERY_FLAVOURS.find(c => c.name === customFlavor) || INDIAN_BAKERY_FLAVOURS[0];
    const basePrice = weightOption.size === "0.5 kg" ? selectedCakeObj.priceHalfKg : selectedCakeObj.priceOneKg;
    const finalPrice = weightOption.size === "1.5 kg" ? Math.round(selectedCakeObj.priceOneKg * 1.45) : basePrice;

    await addToCart({
      productId: `custom-cake-${Date.now()}`,
      name: `Bespoke ${customFlavor} Cake (${weightOption.size}${isEggless ? ", 100% Eggless" : ""})`,
      price: finalPrice,
      quantity: 1,
      image: selectedCakeObj.image,
      type: "bespoke",
    });

    setCustomAdded(true);
    setTimeout(() => setCustomAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 text-stone-900">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-sky-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 shadow-sm transition-all hover:scale-102"
        >
          <ArrowLeft size={14} />
          <span>Switch to 💐 Bouquet</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-sky-900 bg-sky-50/80 px-3.5 py-1.5 rounded-full border border-sky-200/60 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>30 Authentic Indian Bakery Flavours Available Daily</span>
        </div>
      </div>

      {/* Hero Banner for Indian Bakery Cakes */}
      <section className="relative overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#0f2e52] to-[#081729] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-sky-600/30 overflow-hidden">
            
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase font-mono">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>30 Signature Indian Bakery Cake Flavours</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium text-white tracking-tight leading-[1.1]">
                  Authentic Indian Bakery & Fusion Cakes
                </h1>

                <p className="text-sky-100/85 text-xs sm:text-base leading-relaxed max-w-xl">
                  From traditional mithai fusion cakes (Rasmalai, Gulab Jamun, Kaju Katli) and retro bakery classics (Black Forest, Butterscotch, Pineapple) to premium Lotus Biscoff and Ferrero Rocher. Freshly baked same-day in 100% Pure Veg (Eggless) or Gourmet options.
                </p>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-sky-700/40 text-xs text-sky-200">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-400 shrink-0" />
                    <span>Baked on delivery day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>100% Eggless for all 30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-400 shrink-0" />
                    <span>Free message & candles</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group">
                  <img
                    src="./assets/images/cake_rasmalai_kesar_1792325117942.jpg"
                    alt="Authentic Indian Rasmalai Fusion Cake"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                      INDIAN FUSION MASTERPIECE № 11
                    </span>
                    <p className="font-display text-lg font-semibold text-white">
                      Royal Saffron & Pistachio Rasmalai Cake
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Custom Cake Designer with ALL 30 Flavours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-xl">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-sky-600" />
              <span className="text-xs font-semibold tracking-widest text-sky-800 uppercase">
                Custom Celebration Order
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
              Design Your Cake from 30 Indian Bakery Flavours
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Select any of our 30 bakery flavours, customize weight (0.5kg to 1.5kg), choose dietary preferences, and write your personal chocolate piping message.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Customizer Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Flavor Dropdown / Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>1. Choose Flavour (30 Available)</span>
                  <span className="text-sky-700 font-mono text-[11px] font-semibold">
                    {INDIAN_BAKERY_FLAVOURS.find(c => c.name === customFlavor)?.tag}
                  </span>
                </label>
                
                <div className="relative">
                  <select
                    value={customFlavor}
                    onChange={(e) => setCustomFlavor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs appearance-none pr-10"
                  >
                    <optgroup label="⭐ Indian Mithai Fusion Flavours">
                      {INDIAN_BAKERY_FLAVOURS.filter(c => c.category === "Indian Mithai Fusion").map(c => (
                        <option key={c.id} value={c.name}>{c.number}. {c.name} — from ₹{c.priceHalfKg}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🍫 Chocolates & Truffles">
                      {INDIAN_BAKERY_FLAVOURS.filter(c => c.category === "Chocolates & Truffles").map(c => (
                        <option key={c.id} value={c.name}>{c.number}. {c.name} — from ₹{c.priceHalfKg}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🎂 Classic Bakery Bestsellers">
                      {INDIAN_BAKERY_FLAVOURS.filter(c => c.category === "Classic Bakery Bestsellers").map(c => (
                        <option key={c.id} value={c.name}>{c.number}. {c.name} — from ₹{c.priceHalfKg}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🍓 Fruit & Floral">
                      {INDIAN_BAKERY_FLAVOURS.filter(c => c.category === "Fruit & Floral").map(c => (
                        <option key={c.id} value={c.name}>{c.number}. {c.name} — from ₹{c.priceHalfKg}</option>
                      ))}
                    </optgroup>
                    <optgroup label="✨ Gourmet Specials & 100% Eggless">
                      {INDIAN_BAKERY_FLAVOURS.filter(c => c.category === "Gourmet Specials" || c.category === "100% Eggless Specials").map(c => (
                        <option key={c.id} value={c.name}>{c.number}. {c.name} — from ₹{c.priceHalfKg}</option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Quick Popular Flavour Chips */}
              <div>
                <span className="text-[11px] text-stone-500 font-semibold block mb-2">Popular Quick Picks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Rasmalai Cake", 
                    "Black Forest Cake", 
                    "Butterscotch Cake", 
                    "Chocolate Truffle Cake", 
                    "Red Velvet Cake", 
                    "Gulab Jamun Cake",
                    "Lotus Biscoff Cake"
                  ].map((pop) => (
                    <button
                      key={pop}
                      type="button"
                      onClick={() => setCustomFlavor(pop)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        customFlavor === pop
                          ? "bg-sky-700 text-white border-sky-700 font-bold"
                          : "bg-stone-50 hover:bg-sky-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {pop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight & Size Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  2. Select Weight & Servings
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "0.5 kg (Serves 4–6)", size: "0.5 kg", multiplier: 0.5 },
                    { label: "1.0 kg (Serves 8–10)", size: "1.0 kg", multiplier: 1.0 },
                    { label: "1.5 kg (Serves 12–15)", size: "1.5 kg", multiplier: 1.45 },
                  ].map((sz) => {
                    const activeCake = INDIAN_BAKERY_FLAVOURS.find(c => c.name === customFlavor) || INDIAN_BAKERY_FLAVOURS[0];
                    const price = sz.size === "0.5 kg" ? activeCake.priceHalfKg : sz.size === "1.0 kg" ? activeCake.priceOneKg : Math.round(activeCake.priceOneKg * 1.45);

                    return (
                      <button
                        key={sz.label}
                        type="button"
                        onClick={() => setWeightOption(sz)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          weightOption.size === sz.size
                            ? "border-sky-600 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs"
                            : "border-stone-200 hover:border-sky-300 bg-white"
                        }`}
                      >
                        <span className="block font-semibold text-xs text-stone-900">{sz.size}</span>
                        <span className="text-[10px] text-stone-500 block">{sz.label.split("(")[1].replace(")", "")}</span>
                        <span className="text-xs font-mono font-bold text-sky-800 mt-1 block">₹{price.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Option */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  3. Dietary Preference
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                      isEggless
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>100% Pure Veg (Eggless)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                      !isEggless
                        ? "border-sky-600 bg-sky-50 text-sky-900 shadow-xs"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span>Regular Bakery Recipe</span>
                  </button>
                </div>
              </div>

              {/* Custom Piping Message */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  4. Custom Piping Message on Cake (Complimentary)
                </label>
                <input
                  type="text"
                  maxLength={35}
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="e.g., Happy Birthday Priya ❤️"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Handwritten with chocolate ganache plaque + complimentary candles & knife</span>
              </div>

            </div>

            {/* Live Customizer Preview Card */}
            {(() => {
              const activeCake = INDIAN_BAKERY_FLAVOURS.find(c => c.name === customFlavor) || INDIAN_BAKERY_FLAVOURS[0];
              const calculatedPrice = weightOption.size === "0.5 kg" ? activeCake.priceHalfKg : weightOption.size === "1.0 kg" ? activeCake.priceOneKg : Math.round(activeCake.priceOneKg * 1.45);

              return (
                <div className="lg:col-span-5 bg-gradient-to-b from-sky-50/60 to-blue-50/30 p-6 rounded-2xl border border-sky-100 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-sky-100">
                      <img
                        src={activeCake.image}
                        alt={activeCake.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-sm text-[10px] text-amber-300 font-mono font-bold">
                        № {activeCake.number} of 30
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-800 block mb-1">
                      {activeCake.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-stone-900">
                      {activeCake.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      {weightOption.size} • {isEggless ? "100% Pure Veg (Eggless)" : "Regular Recipe"}
                    </p>

                    {/* Message preview plaque */}
                    {cakeMessage && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-center">
                        <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider block font-mono">
                          Chocolate Plaque Inscription:
                        </span>
                        <span className="text-xs font-serif italic text-amber-950 font-semibold block mt-0.5">
                          "{cakeMessage}"
                        </span>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-sky-100 flex items-baseline justify-between">
                      <span className="text-xs text-stone-500 font-medium">Bespoke Price</span>
                      <span className="text-2xl font-bold font-mono text-stone-900">
                        ₹{calculatedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddCustomCake}
                    disabled={customAdded}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                      customAdded
                        ? "bg-emerald-700 text-white"
                        : "bg-sky-700 hover:bg-sky-600 text-white shadow-sky-700/25"
                    }`}
                  >
                    {customAdded ? (
                      <>
                        <Check size={16} />
                        <span>Custom Cake Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>Add Bespoke {customFlavor.split(" ")[0]} to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      </section>

      {/* Complete 30-Flavour Indian Bakery Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header & Controls */}
        <div className="space-y-6 mb-10 pb-6 border-b border-sky-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  Full Menu • 30 Flavours
                </span>
                <span className="text-xs text-stone-500 font-medium">Same-Day Baking in Guwahati</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-medium text-stone-900">
                Explore All 30 Indian Bakery Cake Flavours
              </h2>
            </div>

            {/* Quick Live Search Bar */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any of 30 flavours..."
                className="w-full pl-9 pr-9 py-2 text-xs rounded-full border border-sky-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === cat
                    ? "bg-sky-700 text-white shadow-xs"
                    : "bg-white text-stone-600 border border-sky-100 hover:border-sky-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cake Cards Grid */}
        {filteredCakes.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-sky-100 p-8 shadow-sm">
            <p className="text-stone-400 font-display italic text-lg">No cake flavours matching "{searchQuery}"</p>
            <p className="text-stone-500 text-xs">Try searching for Rasmalai, Black Forest, Butterscotch, or Truffle.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All (30 Flavours)"); }}
              className="text-xs font-semibold text-sky-700 underline"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCakes.map((cake, idx) => {
              const isFav = isInWishlist(cake.id);
              const currentSize = selectedSizes[cake.id] || "one";
              const currentPrice = getCakePrice(cake, currentSize);
              const isAdded = quickAddedId === `${cake.id}-${currentSize}`;

              return (
                <motion.div
                  key={cake.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 6) * 0.04 }}
                  className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-sky-300"
                >
                  <div>
                    {/* Photo Container */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-4 border border-stone-100">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Number & Tag badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 shadow-sm">
                          № {cake.number.toString().padStart(2, "0")}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-stone-900 shadow-sm border border-stone-200/50">
                          {cake.tag}
                        </span>
                      </div>

                      {/* Pure Veg Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/95 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
                          <CheckCircle2 size={10} />
                          <span>100% Veg Option</span>
                        </span>
                      </div>

                      {/* Wishlist toggle */}
                      <button
                        onClick={() => toggleWishlist({
                          id: cake.id,
                          name: cake.name,
                          price: cake.priceOneKg,
                          image: cake.image,
                          category: cake.category
                        })}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-500 transition-colors shadow-sm"
                        aria-label="Save to Wishlist"
                      >
                        <Heart size={16} fill={isFav ? "#f43f5e" : "none"} className={isFav ? "text-rose-500" : ""} />
                      </button>
                    </div>

                    {/* Cake Title & Specs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-sky-800 font-semibold font-mono">
                        <span>{cake.category}</span>
                        <span>Daily Fresh Bake</span>
                      </div>

                      <h3 className="font-display font-semibold text-lg text-stone-900 leading-tight group-hover:text-sky-800 transition-colors">
                        {cake.name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {cake.description}
                      </p>

                      {/* Flavor notes */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cake.flavors.map((flv) => (
                          <span key={flv} className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium">
                            {flv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Size Switcher & Price Controls */}
                  <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
                    
                    {/* Size Selector Tabs */}
                    <div className="grid grid-cols-2 gap-1.5 bg-stone-100/70 p-1 rounded-xl text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [cake.id]: "half" }))}
                        className={`py-1 rounded-lg transition-all ${
                          currentSize === "half"
                            ? "bg-white text-stone-900 font-bold shadow-xs"
                            : "text-stone-500 hover:text-stone-900"
                        }`}
                      >
                        0.5 kg • ₹{cake.priceHalfKg}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [cake.id]: "one" }))}
                        className={`py-1 rounded-lg transition-all ${
                          currentSize === "one"
                            ? "bg-white text-stone-900 font-bold shadow-xs"
                            : "text-stone-500 hover:text-stone-900"
                        }`}
                      >
                        1.0 kg • ₹{cake.priceOneKg}
                      </button>
                    </div>

                    {/* Bottom Price & Add to Cart */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Total Price</span>
                        <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                          ₹{currentPrice.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddCatalogCake(cake)}
                        disabled={isAdded}
                        className={`py-2 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 min-h-[38px] shadow-xs active:scale-95 ${
                          isAdded
                            ? "bg-emerald-700 text-white cursor-default"
                            : "bg-sky-700 hover:bg-sky-600 text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}
