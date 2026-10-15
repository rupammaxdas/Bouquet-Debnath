/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  HeartHandshake, 
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { auth, db, login, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: string;
}

interface OrderRecord {
  id: string;
  items: string; // JSON
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlot: string;
  cardMessage?: string;
  senderName?: string;
  paymentMethod: string;
  status: "placed" | "crafting" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
  userId?: string;
  userEmail?: string;
}

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightOrderId?: string | null;
  onOpenAuth?: () => void;
}

const STATUS_STEPS = [
  { key: "placed", label: "Order Received", desc: "Studio reviewed specification" },
  { key: "crafting", label: "Master Florist Crafting", desc: "Hand-arranging fresh stems" },
  { key: "out_for_delivery", label: "Out for Hand Delivery", desc: "In climate-controlled van" },
  { key: "delivered", label: "Delivered with Care", desc: "Handed to recipient" },
];

export function OrdersModal({ isOpen, onClose, highlightOrderId, onOpenAuth }: OrdersModalProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const code = searchOrderId.trim().toUpperCase();
    if (!code) return;

    // Check if in local list
    const found = orders.find(o => o.id.toUpperCase() === code);
    if (found) {
      setSelectedOrderId(found.id);
      return;
    }

    setIsSearching(true);
    try {
      const docSnap = await getDoc(doc(db, "orders", code));
      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() } as OrderRecord;
        setOrders(prev => [orderData, ...prev]);
        setSelectedOrderId(orderData.id);
        try {
          const saved = JSON.parse(localStorage.getItem("gifthubworld_orders_history") || localStorage.getItem("debnath_orders_history") || "[]");
          localStorage.setItem("gifthubworld_orders_history", JSON.stringify([orderData, ...saved]));
        } catch {}
      } else {
        setSearchError(`No order found matching "${code}". Please check your order receipt code.`);
      }
    } catch {
      setSearchError("Unable to locate order. Please check the code and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Load locally saved orders
    const getLocalOrders = (): OrderRecord[] => {
      try {
        const saved = localStorage.getItem("gifthubworld_orders_history") || localStorage.getItem("debnath_orders_history");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    };

    const localOrders = getLocalOrders();
    const fbUser = auth.currentUser;

    if (!fbUser) {
      const matchingLocal = user?.email
        ? localOrders.filter(o => o.userEmail?.toLowerCase() === user.email?.toLowerCase() || o.userId === user.uid)
        : localOrders;

      const displayOrders = matchingLocal.length > 0 ? matchingLocal : localOrders;
      displayOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(displayOrders);
      setLoading(false);

      if (highlightOrderId) {
        setSelectedOrderId(highlightOrderId);
      } else if (displayOrders.length > 0 && !selectedOrderId) {
        setSelectedOrderId(displayOrders[0].id);
      }
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", fbUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteRecords: OrderRecord[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data() as Omit<OrderRecord, "id">,
      }));

      // Combine remote and local records, deduplicated by id
      const orderMap = new Map<string, OrderRecord>();
      [...remoteRecords, ...localOrders].forEach((ord) => {
        if (!orderMap.has(ord.id)) {
          orderMap.set(ord.id, ord);
        }
      });

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(merged);
      setLoading(false);

      if (highlightOrderId) {
        setSelectedOrderId(highlightOrderId);
      } else if (merged.length > 0 && !selectedOrderId) {
        setSelectedOrderId(merged[0].id);
      }
    }, (err) => {
      console.warn("Orders listener note, using local boutique records:", err);
      localOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(localOrders);
      setLoading(false);

      if (highlightOrderId) {
        setSelectedOrderId(highlightOrderId);
      } else if (localOrders.length > 0 && !selectedOrderId) {
        setSelectedOrderId(localOrders[0].id);
      }
    });

    return unsubscribe;
  }, [isOpen, highlightOrderId]);

  if (!isOpen) return null;

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStepIndex = (status: OrderRecord["status"]) => {
    if (status === "placed") return 0;
    if (status === "crafting") return 1;
    if (status === "out_for_delivery") return 2;
    if (status === "delivered") return 3;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-medium text-stone-900">
                Order History & Live Tracking
              </h2>
              <p className="text-xs text-stone-500">
                Monitor the floral craftsmanship and doorstep delivery of your bouquets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
              <Loader2 size={32} className="animate-spin text-stone-900" />
              <p className="text-xs font-medium">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-stone-300 border border-stone-100">
                <Package size={30} />
              </div>
              <div>
                <h3 className="font-display font-medium text-xl text-stone-900">Track Your Bouquet Order</h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Enter your order receipt number (e.g. <strong>DNF-123456</strong>) to trace live floral crafting and hand delivery status.
                </p>
              </div>

              {/* Order Search Bar */}
              <form onSubmit={handleLookupOrder} className="flex gap-2">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="Enter Order Code (e.g. DNF-482910)"
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-stone-900 uppercase"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchOrderId.trim()}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                  <span>Track</span>
                </button>
              </form>

              {searchError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{searchError}</p>
              )}

              {!user ? (
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <p className="text-[11px] text-stone-400">Placed an order while signed into Google or Customer account?</p>
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth();
                      else login();
                    }}
                    className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Sign In to View All Orders
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-stone-100 space-y-1 text-center">
                  <p className="text-[11px] text-stone-500 font-medium">
                    Signed in as <strong>{user.displayName || user.email}</strong>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Sync hint banner or user status */}
              {!user ? (
                <div className="mb-6 p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Tracking active orders on this device. Sign in to sync across devices.</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth();
                      else login();
                    }}
                    className="px-4 py-1.5 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors shrink-0 text-[11px]"
                  >
                    Sign In (Google or Customer)
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Viewing orders for <strong>{user.displayName || user.email}</strong></span>
                  </div>
                  <button
                    onClick={() => onOpenAuth?.()}
                    className="px-3.5 py-1 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors shrink-0 text-[11px]"
                  >
                    Manage Account
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Select Sidebar */}
              <div className="space-y-3 lg:border-r lg:border-stone-100 lg:pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Your Orders ({orders.length})
                </span>
                {orders.map((ord) => {
                  const isSelected = (activeOrder?.id === ord.id);
                  let parsedItems: OrderItem[] = [];
                  try {
                    parsedItems = JSON.parse(ord.items);
                  } catch {
                    parsedItems = [];
                  }

                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-stone-900 bg-stone-900 text-white shadow-md"
                          : "border-stone-200 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold tracking-tight">{ord.id}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                        To: {ord.recipientName}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/40 text-xs">
                        <span className="font-mono font-bold">₹{ord.totalAmount.toLocaleString()}</span>
                        <span className={`text-[10px] ${isSelected ? "text-stone-400" : "text-stone-400"}`}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Order Detail & Live Pipeline */}
              {activeOrder && (
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Overview Header */}
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">Tracking Order</span>
                        <span className="font-mono text-sm font-bold text-stone-900">{activeOrder.id}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Total Amount</span>
                      <span className="text-xl font-display font-bold text-stone-900 font-mono">
                        ₹{activeOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Pipeline */}
                  <div className="p-6 rounded-2xl border border-stone-200 bg-white shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-6">
                      Live Delivery Progress
                    </h3>

                    <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                      {STATUS_STEPS.map((st, idx) => {
                        const currentIdx = getStepIndex(activeOrder.status);
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={st.key} className="relative flex items-start gap-4">
                            <span 
                              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isDone 
                                  ? "bg-stone-900 border-stone-900 text-white" 
                                  : "bg-white border-stone-300 text-transparent"
                              }`}
                            >
                              <CheckCircle2 size={12} className={isDone ? "text-white" : "opacity-0"} />
                            </span>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-xs font-bold ${isCurrent ? "text-stone-900 text-sm" : isDone ? "text-stone-800" : "text-stone-400"}`}>
                                  {st.label}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                    Current Phase
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 mt-0.5">{st.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery & Recipient Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1">
                        <MapPin size={12} /> Recipient & Address
                      </span>
                      <p className="font-semibold text-stone-900">{activeOrder.recipientName}</p>
                      <p className="text-stone-600 leading-relaxed">{activeOrder.deliveryAddress}</p>
                      <p className="font-mono text-stone-500">{activeOrder.recipientPhone}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Schedule Slot
                      </span>
                      <p className="font-semibold text-stone-900">{activeOrder.deliveryDate}</p>
                      <p className="text-stone-600">Slot: {activeOrder.deliverySlot}</p>
                      <p className="text-stone-500 font-medium">Payment: {activeOrder.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Card Message Preview if present */}
                  {activeOrder.cardMessage && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                      <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block mb-1">
                        Complimentary Card Message
                      </span>
                      <p className="font-display italic text-stone-800 leading-relaxed">
                        "{activeOrder.cardMessage}"
                      </p>
                      {activeOrder.senderName && (
                        <p className="text-right text-[11px] font-display text-stone-600 mt-2">
                          — {activeOrder.senderName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Items Purchased List */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
                      Arrangements in this Order
                    </span>
                    <div className="space-y-2">
                      {(() => {
                        let parsed: OrderItem[] = [];
                        try {
                          parsed = JSON.parse(activeOrder.items);
                        } catch {
                          parsed = [];
                        }
                        return parsed.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/70 bg-white">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-semibold text-stone-900 truncate">{item.name}</h5>
                              <p className="text-[10px] text-stone-400">{item.type === "bespoke" ? "Bespoke Hand-Tied" : "Curated Bouquet"}</p>
                            </div>
                            <div className="text-right font-mono text-xs">
                              <span className="text-stone-500">x{item.quantity}</span>
                              <strong className="text-stone-900 ml-2">₹{(item.price * item.quantity).toLocaleString()}</strong>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Need assistance with your arrangement?</span>
          <a 
            href="https://www.facebook.com/share/1YFvXyHpju/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-stone-900 font-semibold hover:underline"
          >
            Contact Gift Hub World Concierge
          </a>
        </div>
      </motion.div>
    </div>
  );
}
