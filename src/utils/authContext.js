import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig } from "../utils/azureAuth";

export const msalInstance = new PublicClientApplication(msalConfig);

const AuthContext = createContext();

const loginRequest = {
  scopes: ["User.Read", "User.ReadBasic.All"],
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
        await getProfilePhoto(account);
      }
    } catch (error) {
      console.error("Login falló:", error);
    }
  };

  const getAccessToken = async (account) => {
    try {
      return await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Intenta recuperar el token mediante interacción (popup)
        return await msalInstance.acquireTokenPopup({ ...loginRequest, account });
      } else {
        throw error;
      }
    }
  };

  const getProfilePhoto = async (accountOverride) => {
    try {
      const account = accountOverride || msalInstance.getActiveAccount();
      if (!account) return;

      const tokenResponse = await getAccessToken(account);
      const graphResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      if (!graphResponse.ok) throw new Error("No se pudo obtener la imagen");

      const blob = await graphResponse.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProfilePhoto(imageUrl);
    } catch (error) {
      console.warn("Error cargando imagen de perfil:", error.message);
    }
  };

  const logout = () => {
    msalInstance.logoutPopup();
    setUser(null);
    setProfilePhoto(null);
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

export const useAuth = () => useContext(AuthContext);
