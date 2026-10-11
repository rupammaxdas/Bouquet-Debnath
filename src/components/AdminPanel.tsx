/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db, login, logout, handleFirestoreError, OperationType } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, Trash2, LogOut, Loader2, ShieldCheck, X } from "lucide-react";

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
                        { id: 1, name: "The Velvet Rose", price: "₹2,499" },
                        { id: 2, name: "Meadow Whisper", price: "₹1,599" }
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
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
