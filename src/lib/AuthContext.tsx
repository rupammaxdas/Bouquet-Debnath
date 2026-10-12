/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  auth, 
  db,
  login, 
  logout, 
  loginAnonymously,
  parseAuthError, 
  AuthErrorInfo 
} from './firebase';
import { onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phone?: string | null;
  isGoogleUser: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  authError: AuthErrorInfo | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: AuthErrorInfo }>;
  signInAsCustomer: (name: string, email: string, phone?: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "rupammaxdas@gmail.com";
const LOCAL_STORAGE_KEY = "debnath_customer_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);

  // Helper to sync admin rights and bootstrap if needed
  const checkAdminRights = useCallback(async (uid: string, email: string | null): Promise<boolean> => {
    if (!email) return false;
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      try {
        const adminDoc = await getDoc(doc(db, "admins", uid));
        if (!adminDoc.exists()) {
          await setDoc(doc(db, "admins", uid), {
            email: email.toLowerCase(),
            role: "admin",
            createdAt: new Date().toISOString()
          });
        }
        return true;
      } catch (err) {
        console.warn("Admin doc sync note:", err);
        return true; // Still allow admin based on verified email check
      }
    }
    try {
      const adminDoc = await getDoc(doc(db, "admins", uid));
      return adminDoc.exists();
    } catch {
      return false;
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const isAdmin = await checkAdminRights(firebaseUser.uid, firebaseUser.email);
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : "Customer"),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          phone: firebaseUser.phoneNumber,
          isGoogleUser: !firebaseUser.isAnonymous,
          isAdmin,
        });

        // Save/update local profile for seamless pre-filling
        if (firebaseUser.displayName || firebaseUser.email) {
          try {
            const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
              ...saved,
              name: firebaseUser.displayName || saved.name || "",
              email: firebaseUser.email || saved.email || "",
              uid: firebaseUser.uid,
              isGoogleUser: !firebaseUser.isAnonymous,
            }));
          } catch {}
        }
      } else {
        // Fallback: Check if there's a local customer profile previously saved
        try {
          const savedStr = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedStr) {
            const saved = JSON.parse(savedStr);
            if (saved.name && saved.email) {
              const isAdmin = saved.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
              setUser({
                uid: saved.uid || `cust_${saved.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
                displayName: saved.name,
                email: saved.email,
                phone: saved.phone || null,
                photoURL: null,
                isGoogleUser: false,
                isAdmin,
              });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [checkAdminRights]);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: AuthErrorInfo }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const cred = await login();
      const isAdmin = await checkAdminRights(cred.user.uid, cred.user.email);
      setUser({
        uid: cred.user.uid,
        displayName: cred.user.displayName,
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        phone: cred.user.phoneNumber,
        isGoogleUser: true,
        isAdmin,
      });
      return { success: true };
    } catch (err) {
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      return { success: false, error: parsed };
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsCustomer = async (name: string, email: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : "";

    let assignedUid = `cust_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Try linking to anonymous Firebase user for native Firestore rules
    try {
      const anonCred = await loginAnonymously();
      assignedUid = anonCred.user.uid;
      try {
        await updateProfile(anonCred.user, { displayName: cleanName });
      } catch {}
    } catch (anonErr) {
      console.warn("Anonymous auth note (using persistent customer profile):", anonErr);
    }

    const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const customerUser: AppUser = {
      uid: assignedUid,
      displayName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      photoURL: null,
      isGoogleUser: false,
      isAdmin,
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        uid: assignedUid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        isGoogleUser: false,
        updatedAt: new Date().toISOString(),
      }));
    } catch {}

    setUser(customerUser);
    setIsLoading(false);
    return true;
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch {}
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setUser(null);
    setAuthError(null);
    setIsLoading(false);
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        signInWithGoogle,
        signInAsCustomer,
        signOutUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
