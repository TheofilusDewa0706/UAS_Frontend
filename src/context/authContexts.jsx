import React, { createContext, useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode"; // pastikan penulisan sesuai library jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.user_id, role: decoded.role_id });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({ id: decoded.user_id, role: decoded.role_id });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tambahkan fungsi useAuth untuk memudahkan akses ke AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
