import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const ADMIN_STORAGE_KEY = "canteenflow_admin_auth";
const USER_STORAGE_KEY = "canteenflow_user_auth";

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  async function loginAdmin(email, password) {
    const res = await api.adminLogin(email, password);
    if (res && res.role === "ADMIN") {
      setAdminUser(res);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res));
      return res;
    }
    throw new Error("Invalid admin credentials");
  }

  function logoutAdmin() {
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  async function loginCustomer(email, password) {
    const res = await api.customerLogin(email, password);
    if (res && res.success) {
      setCustomerUser(res);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res));
      return res;
    }
    throw new Error("Invalid credentials");
  }

  function logoutCustomer() {
    setCustomerUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        customerUser,
        isCustomerAuthenticated: !!customerUser,
        loginCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
