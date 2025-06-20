import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple fake auth: admin if email contains "admin"
      if (!email || !password) throw new Error("Email et mot de passe requis");

      const loggedUser: User = {
        id: "123",
        email,
        firstName: "John",
        lastName: "Doe",
        role: email.includes("admin") ? "admin" : "user",
      };
      setUser(loggedUser);
      localStorage.setItem("authUser", JSON.stringify(loggedUser));
    } catch (e: any) {
      setError(e.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
