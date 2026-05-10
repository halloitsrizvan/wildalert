"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, updateDoc, increment } from "firebase/firestore";

export type UserRole = 'user' | 'community_authority';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  communityId?: string;
  createdAt: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, extraData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const docRef = doc(db, "users", fbUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          let userData = docSnap.data() as UserProfile;

          // SELF-HEALING: If authority has no communityId, create one now
          if (userData.role === 'community_authority' && !userData.communityId) {
            const commRef = doc(collection(db, "communities"));
            const newComm = {
              name: userData.name,
              district: "Unspecified",
              description: `Operational zone for ${userData.name}`,
              memberCount: 0,
              activeAlerts: 0,
              riskLevel: "low" as const,
              createdAt: Date.now(),
              authorityId: fbUser.uid
            };
            await setDoc(commRef, newComm);
            await setDoc(docRef, { ...userData, communityId: commRef.id }, { merge: true });
            userData = { ...userData, communityId: commRef.id };
          }

          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, role: UserRole, extraData: any = {}) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    let communityId = extraData.communityId || null;

    // If authority, create a new community record
    if (role === 'community_authority' && extraData.name) {
      const commRef = doc(collection(db, "communities"));
      await setDoc(commRef, {
        name: extraData.name,
        district: extraData.district || "Unspecified",
        description: `Official intelligence zone for ${extraData.name}`,
        memberCount: 0,
        activeAlerts: 0,
        riskLevel: "low",
        createdAt: Date.now(),
        authorityId: fbUser.uid
      });
      communityId = commRef.id;
    }

    const profile: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email!,
      name: extraData.name || (role === 'community_authority' ? "Authority User" : "Community User"),
      role,
      communityId,
      createdAt: Date.now(),
      ...extraData
    };

    await setDoc(doc(db, "users", fbUser.uid), profile);

    // If citizen, increment member count in their community
    if (role === 'user' && communityId) {
      const communityRef = doc(db, "communities", communityId);
      await updateDoc(communityRef, {
        memberCount: increment(1)
      });
    }

    setUser(profile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
