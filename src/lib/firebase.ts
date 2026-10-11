/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface AuthErrorInfo {
  code: string;
  message: string;
  domain?: string;
  consoleUrl?: string;
}

export const parseAuthError = (err: unknown): AuthErrorInfo => {
  const errorObj = err as { code?: string; message?: string };
  const code = errorObj?.code || 'unknown';
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig.projectId;
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  if (code === 'auth/unauthorized-domain') {
    return {
      code,
      domain: currentHost,
      consoleUrl,
      message: `The domain "${currentHost}" is not authorized in Firebase Authentication. Add it under Firebase Console ➔ Authentication ➔ Settings ➔ Authorized Domains.`,
    };
  }

  if (code === 'auth/popup-blocked') {
    return {
      code,
      message: 'The sign-in popup window was blocked by your browser or iframe. Please allow popups for this page and try again.',
    };
  }

  if (code === 'auth/popup-closed-by-user') {
    return {
      code,
      message: 'Sign-in was cancelled before completion. Please try again.',
    };
  }

  if (code === 'auth/cancelled-popup-request') {
    return {
      code,
      message: 'A previous sign-in window was open. Please try again.',
    };
  }

  if (code === 'auth/operation-not-allowed') {
    return {
      code,
      consoleUrl: `https://console.firebase.google.com/project/${projectId}/authentication/providers`,
      message: 'Google Sign-In provider is disabled in your Firebase console. Please enable Google under Authentication ➔ Sign-in method.',
    };
  }

  return {
    code,
    message: errorObj?.message || 'An unexpected error occurred during sign in. Please try again.',
  };
};

export const login = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    const parsed = parseAuthError(err);
    console.warn('Firebase Auth Login Issue:', parsed);
    throw err;
  }
};
export const loginAnonymously = () => signInAnonymously(auth);
export const logout = () => signOut(auth);

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connected successfully.");
  } catch (error) {
    console.warn("Firestore connection check:", error);
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
