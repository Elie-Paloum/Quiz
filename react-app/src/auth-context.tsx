import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // <-- Added

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    fetch("http://localhost:8085/logout.php", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())

      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };
  useEffect(() => {
    fetch("http://localhost:8085/check-session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.authenticated);
        setLoading(false); // <-- Done loading
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
