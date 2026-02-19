import { createContext, useContext, useEffect, useState } from "react";

const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const login = (authData) => {
    const { token } = authData;
    localStorage.setItem("token", token);

    const decoded = parseJwt(token);
    const expiryTime = decoded.exp * 1000;
    const timeout = expiryTime - Date.now();

    setTimeout(() => {
      logout();
    }, timeout);

    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = parseJwt(token);

      if (decoded && decoded.exp * 1000 > Date.now()) {
        setLoggedIn(true);
      } else {
        logout();
      }
    }
  }, []);

  return (
    <HostelContext.Provider value={{ login, logout, isLoggedIn }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
