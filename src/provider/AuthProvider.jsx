import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const logOutUser = () => {
    // 1. Remove using js-cookie with specific path
    Cookies.remove("Access-Token", { path: '/' });
    Cookies.remove("role", { path: '/' });
    
    // 2. Remove using js-cookie without specific path (if they were stuck)
    Cookies.remove("Access-Token");
    Cookies.remove("role");

    // 3. Brute force native cookie removal across common domains/paths
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    const paths = ['/', window.location.pathname];
    
    domains.forEach(domain => {
      paths.forEach(path => {
        document.cookie = `Access-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
        document.cookie = `role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
      });
    });

    // 4. Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    setUser(null);

    // 5. Hard redirect to flush any stale state
    window.location.href = "/auth/login";
  };

  const userInfo = {
    user,
    setUser,
    loading,
    setLoading,
    logOutUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
