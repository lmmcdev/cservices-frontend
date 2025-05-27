// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig } from "../utils/azureAuth";

const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ["User.Read"], // puedes cambiar los scopes
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      await msalInstance.initialize();

      const currentAccount = msalInstance.getActiveAccount();
      if (currentAccount) {
        setUser(currentAccount);
        return;
      }

      const response = await msalInstance.ssoSilent(loginRequest);
      msalInstance.setActiveAccount(response.account);
      setUser(response.account);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await msalInstance.loginPopup(loginRequest);
          msalInstance.setActiveAccount(response.account);
          setUser(response.account);
        } catch (popupError) {
          console.error("Login interactivo falló:", popupError);
        }
      } else {
        console.error("Login falló:", error);
      }
    }
  };

  const logout = () => {
    msalInstance.logoutPopup();
    setUser(null);
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);
