import React, { ReactNode, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() : AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
  }

export function AuthProvider({ children } : AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user : User | null) {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }

  const value : AuthContextType = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}