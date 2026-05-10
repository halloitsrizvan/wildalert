"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
export type UserRole = 'user' | 'community_authority';

interface User {
  id: string;
  name: string;
  role: UserRole;
  communityId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole, communityId?: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("wildalert_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole, communityId?: string, name?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || (role === 'community_authority' ? "Authority User" : "Community User"),
      role,
      communityId
    };
    setUser(newUser);
    localStorage.setItem("wildalert_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wildalert_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
