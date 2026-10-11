/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db, login, logout, handleFirestoreError, OperationType } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, query } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, Trash2, LogOut, Loader2, ShieldCheck, X, Mail, Inbox, Package } from "lucide-react";

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          // Check if user is in admins collection
          const adminDoc = await getDoc(doc(db, "admins", u.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else if (u.email === "rupammaxdas@gmail.com") {
            // Bootstrap first admin
            await setDoc(doc(db, "admins", u.uid), {
              email: u.email,
              role: "admin"
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("Admin check failed", e);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  // Fetch orders from Firestore and local backup
  useEffect(() => {
    const getLocalOrders = () => {
      try {
        const saved = localStorage.getItem("debnath_orders_history");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    };

    const localList = getLocalOrders();

    try {
      const q = query(collection(db, "orders"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const remoteList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const map = new Map();
        [...remoteList, ...localList].forEach(ord => {
          if (!map.has(ord.id)) map.set(ord.id, ord);
        });
        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setOrders(combined);
      }, (err) => {
        console.warn("Admin orders Firestore listener notice:", err);
        setOrders(localList);
      });

      return unsubscribe;
    } catch {
      setOrders(localList);
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-center justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-stone-900" />
              <h2 className="text-2xl font-display font-semibold">Admin Dashboard</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {!user ? (
            <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <ShieldCheck className="mx-auto mb-4 text-stone-300" size={48} />
              <p className="text-stone-600 mb-8">Access restricted to authorized personnel.</p>
              <button
                onClick={login}
                className="px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : !isAdmin ? (
            <div className="text-center py-20">
              <p className="text-stone-900 font-medium mb-2">Access Denied</p>
              <p className="text-stone-500 text-sm mb-8">Your account ({user.email}) does not have admin privileges.</p>
              <button onClick={logout} className="text-stone-900 font-semibold border-b border-stone-900 pb-1">
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? <img src={user.photoURL} alt="" /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.displayName}</p>
                    <p className="text-xs text-stone-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-stone-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-stone-200 pb-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "orders"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <Inbox size={15} />
                  <span>Orders Inbox ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "products"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>Product Catalogue</span>
                </button>
              </div>

              {/* TAB 1: ORDERS INBOX */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 uppercase tracking-widest text-xs">Customer Orders Inbox</h3>
                      <p className="text-[11px] text-stone-500">Live incoming customer orders with automatic totals & Gmail forward</p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
                      {orders.length} Total Orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <Inbox className="mx-auto mb-3 text-stone-300" size={36} />
                      <p className="text-sm font-medium text-stone-700">No Orders in Inbox Yet</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        New orders placed via Pay on Hand Delivery or UPI will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord: any) => {
                        let parsedItems: any[] = [];
                        try {
                          parsedItems = typeof ord.items === "string" ? JSON.parse(ord.items) : (ord.items || []);
                        } catch {
                          parsedItems = [];
                        }

                        const mailtoBody = encodeURIComponent(
                          `DEBNATH FLOWER BOUTIQUE - ORDER DETAILS\n\n` +
                          `Order ID: ${ord.id}\n` +
                          `Placed: ${new Date(ord.createdAt || Date.now()).toLocaleString()}\n` +
                          `Payment: ${ord.paymentMethod === "cod" ? "Pay on Hand Delivery" : ord.paymentMethod}\n\n` +
                          `CUSTOMER DETAILS:\n` +
                          `Name: ${ord.recipientName || "N/A"}\n` +
                          `Phone: ${ord.recipientPhone || "N/A"}\n` +
                          `Delivery Address: ${ord.deliveryAddress || "N/A"}\n` +
                          `Delivery Slot: ${ord.deliveryDate || ""} (${ord.deliverySlot || ""})\n` +
                          (ord.cardMessage ? `Card Message: "${ord.cardMessage}"\n` : '') +
                          (ord.senderName ? `Sender: ${ord.senderName}\n\n` : '\n') +
                          `PRODUCT CATALOGUE ITEMS:\n` +
                          parsedItems.map((it: any) => `- ${it.name} × ${it.quantity}: ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString()}`).join('\n') + '\n\n' +
                          `AUTOMATIC TOTAL CALCULATION:\n` +
                          `Subtotal: ₹${(ord.subtotal || ord.totalAmount).toLocaleString()}\n` +
                          (ord.discount ? `Discount: -₹${ord.discount.toLocaleString()}\n` : '') +
                          `Delivery Fee: ₹${ord.deliveryFee || 0}\n` +
                          `Final Total: ₹${(ord.totalAmount || 0).toLocaleString()}\n\n` +
                          `Owner & Founder: Trisha Debnath • Debnath Flower Boutique`
                        );

                        const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=rupammaxdas@gmail.com&su=${encodeURIComponent(`Order Info: ${ord.id} - ${ord.recipientName || 'Customer'}`)}&body=${mailtoBody}`;

                        return (
                          <div key={ord.id} className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-sm text-stone-900">{ord.id}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  {ord.paymentMethod === "cod" ? "Pay on Hand Delivery" : ord.paymentMethod}
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-400">
                                {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Customer, Phone & Address */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Customer / Recipient</span>
                                <p className="font-semibold text-stone-900 mt-0.5">{ord.recipientName || "Guest Customer"}</p>
                                <p className="font-mono text-stone-600 mt-0.5">{ord.recipientPhone || "No Phone"}</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Hand Delivery Destination</span>
                                <p className="text-stone-800 mt-0.5 leading-relaxed">{ord.deliveryAddress || "N/A"}</p>
                                <p className="text-stone-500 text-[11px] mt-0.5 font-medium">Slot: {ord.deliveryDate} • {ord.deliverySlot?.toUpperCase()}</p>
                              </div>
                            </div>

                            {/* Catalogue Items */}
                            <div className="text-xs space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                                Product Catalogue & Stems ({parsedItems.length})
                              </span>
                              <div className="divide-y divide-stone-100 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                                {parsedItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between py-1 text-stone-700">
                                    <span className="truncate max-w-[260px]">
                                      {item.name} <span className="text-stone-400 font-mono">×{item.quantity}</span>
                                    </span>
                                    <span className="font-mono font-medium text-stone-900">
                                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Automatic Order Total Calculation */}
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                              <div className="text-stone-500">
                                <span>Subtotal: ₹{(ord.subtotal || ord.totalAmount).toLocaleString()}</span>
                                {ord.deliveryFee !== undefined && (
                                  <span className="ml-2">• Delivery: {ord.deliveryFee === 0 ? "Free" : `₹${ord.deliveryFee}`}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Total Payable</span>
                                <span className="font-mono font-bold text-base text-stone-900">
                                  ₹{(ord.totalAmount || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Forward / Open in Gmail Button */}
                            <div className="pt-1">
                              <a
                                href={gmailHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 text-xs font-semibold border border-red-200 transition-colors shadow-xs w-full justify-center"
                              >
                                <Mail size={14} className="text-red-600" />
                                <span>Forward Order to Admin Gmail Inbox (rupammaxdas@gmail.com)</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MANAGE PRODUCTS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-stone-900 uppercase tracking-widest text-xs">Manage Products</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors">
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  <div className="border border-stone-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 text-[10px] uppercase tracking-widest font-bold text-stone-400 border-b border-stone-100">
                        <tr>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {[
                          { id: 1, name: "The Velvet Rose", price: "₹699" },
                          { id: 2, name: "Meadow Whisper", price: "₹799" },
                          { id: 3, name: "Eternal Grace", price: "₹1,199" },
                          { id: 4, name: "Tropical Sunrise", price: "₹1,499" }
                        ].map((p) => (
                          <tr key={p.id} className="text-sm">
                            <td className="px-6 py-4 font-medium text-stone-900">{p.name}</td>
                            <td className="px-6 py-4 text-stone-500">{p.price}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-stone-300 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
