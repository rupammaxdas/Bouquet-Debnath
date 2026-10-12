/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query,
  orderBy
} from 'firebase/firestore';

interface WishlistItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (product: any) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      if (!user) {
        try {
          const saved = JSON.parse(localStorage.getItem('debnath_wishlist') || '[]');
          setWishlist(saved);
        } catch {
          setWishlist([]);
        }
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const q = query(wishlistRef, orderBy('addedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as WishlistItem);
      setWishlist(items);
      setIsLoading(false);
    }, (error) => {
      console.warn("Wishlist remote sync note (using local cache):", error);
      try {
        const saved = JSON.parse(localStorage.getItem('debnath_wishlist') || '[]');
        setWishlist(saved);
      } catch {}
      setIsLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const toggleWishlist = useCallback(async (product: any) => {
    const productId = product.id.toString();
    const exists = wishlist.some(item => item.productId === productId);

    let updatedList: WishlistItem[];
    if (exists) {
      updatedList = wishlist.filter(item => item.productId !== productId);
    } else {
      const newItem: WishlistItem = {
        productId,
        name: product.name,
        price: typeof product.price === "number" ? product.price.toString() : product.price,
        image: product.image,
        addedAt: new Date().toISOString()
      };
      updatedList = [newItem, ...wishlist];
    }

    setWishlist(updatedList);
    try {
      localStorage.setItem('debnath_wishlist', JSON.stringify(updatedList));
    } catch {}

    if (userId) {
      const itemRef = doc(db, 'users', userId, 'wishlist', productId);
      try {
        if (exists) {
          await deleteDoc(itemRef);
        } else {
          await setDoc(itemRef, updatedList[0]);
        }
      } catch (error) {
        console.warn("Wishlist cloud sync note:", error);
      }
    }
  }, [userId, wishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
