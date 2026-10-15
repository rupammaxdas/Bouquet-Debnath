/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "curated" | "bespoke";
  details?: {
    wrap?: string;
    ribbon?: string;
    style?: string;
    stems?: Record<string, number>;
    totalStems?: number;
    summary?: string;
    aiPreview?: boolean;
  };
  addedAt: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  appliedPromo: string | null;
  deliveryFee: number;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isLoading: boolean;
}

const LOCAL_STORAGE_KEY = 'gifthubworld_floral_cart_v1';
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('debnath_floral_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firestore when logged in
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      if (!user) {
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const cartRef = collection(db, 'users', userId, 'cart');
    const q = query(cartRef, orderBy('addedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const serverItems = snapshot.docs.map(doc => doc.data() as CartItem);
      
      // If server has items, adopt them; otherwise sync local guest cart if any
      if (serverItems.length > 0) {
        setCart(serverItems);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverItems));
      } else if (cart.length > 0) {
        // Upload local guest cart to Firestore
        const batch = writeBatch(db);
        cart.forEach((item) => {
          const itemRef = doc(db, 'users', userId, 'cart', item.id);
          batch.set(itemRef, item);
        });
        batch.commit().catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `users/${userId}/cart`);
        });
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/cart`);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  // Persist locally for guests & fast reloads
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(async (itemData: Omit<CartItem, 'id' | 'addedAt'>) => {
    const existingIndex = cart.findIndex(c => 
      c.type === itemData.type && 
      c.name === itemData.name && 
      JSON.stringify(c.details) === JSON.stringify(itemData.details)
    );

    let updatedCart: CartItem[];
    const now = new Date().toISOString();

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      const newQty = existing.quantity + itemData.quantity;
      const updatedItem = { ...existing, quantity: newQty };
      updatedCart = [...cart];
      updatedCart[existingIndex] = updatedItem;

      if (userId) {
        try {
          await setDoc(doc(db, 'users', userId, 'cart', existing.id), updatedItem);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${userId}/cart/${existing.id}`);
        }
      }
    } else {
      const newId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newItem: CartItem = {
        ...itemData,
        id: newId,
        addedAt: now,
      };
      updatedCart = [newItem, ...cart];

      if (userId) {
        try {
          await setDoc(doc(db, 'users', userId, 'cart', newId), newItem);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${userId}/cart/${newId}`);
        }
      }
    }

    setCart(updatedCart);
    setIsCartOpen(true);
  }, [cart, userId]);

  const updateQuantity = useCallback(async (id: string, delta: number) => {
    const target = cart.find(item => item.id === id);
    if (!target) return;

    const newQty = target.quantity + delta;
    if (newQty <= 0) {
      await removeFromCart(id);
      return;
    }

    const updatedItem = { ...target, quantity: newQty };
    const updatedCart = cart.map(item => item.id === id ? updatedItem : item);
    setCart(updatedCart);

    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId, 'cart', id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${userId}/cart/${id}`);
      }
    }
  }, [cart, userId]);

  const removeFromCart = useCallback(async (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));

    if (userId) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'cart', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `users/${userId}/cart/${id}`);
      }
    }
  }, [userId]);

  const clearCart = useCallback(async () => {
    const currentItems = [...cart];
    setCart([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (userId && currentItems.length > 0) {
      try {
        const batch = writeBatch(db);
        currentItems.forEach(item => {
          batch.delete(doc(db, 'users', userId, 'cart', item.id));
        });
        await batch.commit();
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${userId}/cart`);
      }
    }
  }, [cart, userId]);

  // Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'BLOOM10') return Math.round(subtotal * 0.10);
    if (appliedPromo === 'WELCOME2026') return Math.min(subtotal, 300);
    return 0;
  }, [subtotal, appliedPromo]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 2000 ? 0 : 150;
  }, [subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [subtotal, discount, deliveryFee]);

  const applyPromoCode = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'BLOOM10') {
      setAppliedPromo('BLOOM10');
      return { success: true, message: '10% Artisanal discount applied!' };
    }
    if (formatted === 'WELCOME2026') {
      setAppliedPromo('WELCOME2026');
      return { success: true, message: '₹300 Welcome voucher applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try BLOOM10 or WELCOME2026' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      subtotal,
      discount,
      appliedPromo,
      deliveryFee,
      finalTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyPromoCode,
      removePromoCode,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
