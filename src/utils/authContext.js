// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../utils/azureAuth";

const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ["User.Read"], // puedes cambiar los scopes
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const login = async () => {
    try {
      await msalInstance.initialize();

      let account = msalInstance.getActiveAccount();

      if (!account) {
        try {
          const response = await msalInstance.ssoSilent(loginRequest);
          msalInstance.setActiveAccount(response.account);
          account = response.account;
        } catch {
          const response = await msalInstance.loginPopup(loginRequest);
          msalInstance.setActiveAccount(response.account);
          account = response.account;
        }
      }

      if (account) {
        setUser(account);
        await getProfilePhoto();
      }
    } catch (error) {
      console.error("Login falló:", error);
    }
  };

  const getProfilePhoto = async () => {
    console.log("llamndo profile photo")
    try {
      const account = msalInstance.getActiveAccount();
      if (!account) return;

      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (!graphResponse.ok) throw new Error("No se pudo obtener la imagen");

      const blob = await graphResponse.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfilePhoto(imageUrl);
    } catch (error) {
      console.warn("Error cargando imagen de perfil:", error);
    }
  };


  const logout = () => {
    msalInstance.logoutPopup();
    setUser(null);
  };

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, profilePhoto, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);
