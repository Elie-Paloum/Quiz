import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Define the shape of your user data

export interface User {
  id: number;
  email: string;
  first_name: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User;
  loading: boolean;
  login: (user: User) => void; // login function will now accept user data
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiBase = () => {
  if (import.meta.env.DEV) {
    // Check if we're accessing from a mobile device
    const isMobile =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    return isMobile ? "http://172.20.10.3:8085" : "http://localhost:8085";
  }
  // Use your InfinityFree backend URL in production
  return "https://logicalquiz.free.nf";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({
    id: 0,
    email: "",
    first_name: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);

  // Updated login function to accept and store user data
  const login = (user: User) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ id: 0, email: "", first_name: "", role: "" });
    fetch(`${getApiBase()}/index.php/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  useEffect(() => {
    // Add a 1-second delay before checking the session
    const timer = setTimeout(() => {
      fetch(`${getApiBase()}/index.php/check-session`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
          }
          setLoading(false);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setLoading(false);
        });
    }, 1000); // 1-second delay

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
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
