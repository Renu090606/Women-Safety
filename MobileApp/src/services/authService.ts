import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import axios from 'axios';
import { env } from '../config/env';
import { firebaseAuth, firebaseFirestore } from './firebase';

export type UserRole = 'passenger' | 'driver';

export type AppUser = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  aadhaarVerified?: boolean;
  licenseVerified?: boolean;
  emergencyContacts?: string[];
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const usersCollection = firebaseFirestore.collection('users');
const api = axios.create({
  baseURL: env.backendBaseUrl,
  timeout: 10000,
});

const normalizeAuthError = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account exists with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and retry.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const parseUserDoc = async (firebaseUser: FirebaseAuthTypes.User): Promise<AppUser | null> => {
  const doc = await usersCollection.doc(firebaseUser.uid).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as Omit<AppUser, 'uid' | 'email'>;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    ...data,
  };
};

export const register = async ({ name, email, password, role }: RegisterPayload): Promise<AppUser> => {
  try {
    const result = await firebaseAuth.createUserWithEmailAndPassword(email.trim(), password);
    const user: AppUser = {
      uid: result.user.uid,
      email: result.user.email ?? email.trim(),
      name: name.trim(),
      role,
      aadhaarVerified: false,
      licenseVerified: false,
      emergencyContacts: [],
    };
    await usersCollection.doc(user.uid).set(user, { merge: true });
    return user;
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    throw new Error(normalizeAuthError(code));
  }
};

export const login = async (email: string, password: string): Promise<AppUser> => {
  try {
    const result = await firebaseAuth.signInWithEmailAndPassword(email.trim(), password);
    const appUser = await parseUserDoc(result.user);
    if (!appUser) {
      throw new Error('Profile not found. Complete registration first.');
    }
    return appUser;
  } catch (error) {
    if (error instanceof Error && !String(error.message).startsWith('auth/')) {
      throw error;
    }
    const code = (error as { code?: string }).code ?? '';
    throw new Error(normalizeAuthError(code));
  }
};

export const logout = async (): Promise<void> => {
  await firebaseAuth.signOut();
};

export const updateUserProfile = async (
  uid: string,
  payload: Partial<Pick<AppUser, 'role' | 'aadhaarVerified' | 'licenseVerified' | 'emergencyContacts' | 'name'>>,
): Promise<void> => {
  await usersCollection.doc(uid).set(payload, { merge: true });
};

export const getCurrentUserProfile = async (): Promise<AppUser | null> => {
  const firebaseUser = firebaseAuth.currentUser;
  if (!firebaseUser) {
    return null;
  }
  return parseUserDoc(firebaseUser);
};

export const onAuthStateChanged = (
  callback: (state: { loading: boolean; user: AppUser | null }) => void,
): (() => void) => {
  return firebaseAuth.onAuthStateChanged(async authUser => {
    if (!authUser) {
      callback({ loading: false, user: null });
      return;
    }
    const user = await parseUserDoc(authUser);
    callback({ loading: false, user });
  });
};

export const verifyAadhaar = async (aadhaarNumber: string): Promise<{ name: string }> => {
  const response = await api.post<{ found?: boolean; gender?: string; success?: boolean; user?: { name: string }; message?: string }>(
    '/auth/verify-aadhaar',
    {
    aadhaarNumber,
  });
  if (response.data.found === false || response.data.success === false) {
    throw new Error(response.data.message || 'Aadhaar verification failed.');
  }
  return response.data.user || { name: '' };
};

export const verifyLicense = async (licenseId: string): Promise<{ name: string }> => {
  const response = await api.post<{ found?: boolean; name?: string; success?: boolean; driver?: { name: string }; message?: string }>(
    '/auth/verify-license',
    {
    licenseId,
  });
  if (response.data.found === false || response.data.success === false) {
    throw new Error(response.data.message || 'License verification failed.');
  }
  return response.data.driver || { name: response.data.name || '' };
};
