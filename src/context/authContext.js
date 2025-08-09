import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig } from "../utils/azureAuth";
import { useAgents } from "./agentsContext";

export const msalInstance = new PublicClientApplication(msalConfig);

const AuthContext = createContext();

const loginRequest = {
  scopes: ["User.Read", "User.ReadBasic.All"],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { state } = useAgents(); // ⬅️ Aquí usas el contexto
  const agents = state.agents;
  const [agentData, setAgentData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [accessTokenMSAL, setAccessToken] = useState(null);

  //console.log(agents)
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
        await getAccessToken(account);
        await getProfilePhoto(account);
      }

    } catch (error) {
      console.error("Login falló:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoaded(true);
    }
  };

  const getAccessToken = async (account) => {
    try {
      const response = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
      setAccessToken(response.accessToken); // ← guarda el token
      console.log('all msal data', response)
      return response;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
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
    setAgentData(null);
  };

  // 🔍 Asociar user con agente del sistema
  useEffect(() => {
    if (user && agents?.length > 0) {
      const match = agents.find(agent => agent.agent_email?.toLowerCase() === user.username?.toLowerCase());
      setAgentData(match || null);
    }
  }, [user, agents]);

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      accessTokenMSAL,
      profilePhoto,
      login,
      logout,
      authError,
      authLoaded,
      agentData,
      department: agentData?.agent_department || null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
