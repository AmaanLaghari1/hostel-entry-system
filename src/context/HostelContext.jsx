import { createContext, useContext, useEffect, useState } from "react";

const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [takePic, setTakePic] = useState(() => {
    const storedValue = localStorage.getItem("takePhoto");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const user = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData) : null;
  }

  const login = (authData) => {
    const { token } = authData;
    localStorage.setItem("token", token);
    localStorage.setItem("auth", JSON.stringify(authData?.user));

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

  const toggleTakePhoto = () => {
    setTakePic(prev => !prev);
    localStorage.setItem("takePhoto", JSON.stringify(!takePic));
  }

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
    <HostelContext.Provider value={{ login, logout, isLoggedIn, user: user(), auth: user(), toggleTakePhoto, takePic }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
