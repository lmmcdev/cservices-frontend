// AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useAgents } from "./agentsContext";
import { ENDPOINT_URLS } from "../utils/js/constants";

// ===== CONFIG =====
const TENANT_ID = "7313ad10-b885-4b50-9c75-9dbbd975618f";
const SPA_CLIENT_ID = "08e5a940-4349-45b0-94ce-46505e0a99a3"; // "08e5a940-4349-45b0-94ce-46505e0a99a3" or "aeec4f18-85f7-4c67-8498-39d4af1440c1"


const API_SCOPE = "api://aeec4f18-85f7-4c67-8498-39d4af1440c1/access_as_user";
const GRAPH_SCOPES = ["User.Read", "User.ReadBasic.All"];
const API_BASE = ENDPOINT_URLS.API;
// eslint-disable-next-line
export const msalInstance = new PublicClientApplication({
  // eslint-disable-next-line 
  // eslint-disable-next-line 
  auth: {
    clientId: SPA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
});

const AuthContext = createContext(undefined);

const graphRequest = { scopes: GRAPH_SCOPES };
const apiRequest = { scopes: [API_SCOPE] };

async function acquire(msal, req, account) {
  try {
    const res = await msal.acquireTokenSilent({ ...req, account });
    return res.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      const res = await msal.acquireTokenPopup({ ...req, account });
      return res.accessToken;
    }
    throw e;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessTokenGraph, setAccessTokenGraph] = useState(null);
  const [accessTokenApi, setAccessTokenApi] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const { state: agentsState } = useAgents();
  const [agentData, setAgentData] = useState(null);

  const login = useCallback(async () => {
    try {
      await msalInstance.initialize();

      let account = msalInstance.getActiveAccount();
      console.log('all data account:', account)
      if (!account) {
        try {
          const resp = await msalInstance.ssoSilent(graphRequest);
          account = resp.account;
          msalInstance.setActiveAccount(account);
        } catch {
          const resp = await msalInstance.loginPopup(graphRequest);
          account = resp.account;
          msalInstance.setActiveAccount(account);
        }
      }
      if (!account) throw new Error("No active account after login.");
      setUser(account);

      const [tokenGraph, tokenApi] = await Promise.all([
        acquire(msalInstance, graphRequest, account).catch(() => null),
        acquire(msalInstance, apiRequest, account).catch(() => null),
      ]);
      setAccessTokenGraph(tokenGraph);
      setAccessTokenApi(tokenApi);
      console.log('all data tokens:', { tokenGraph, tokenApi });

      if (tokenGraph) {
        try {
          const resp = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: { Authorization: `Bearer ${tokenGraph}` },
          });
          if (resp.ok) {
            const blob = await resp.blob();
            setProfilePhoto(URL.createObjectURL(blob));
          }
        } catch {}
      }

      setAuthError(null);
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError(err?.message || "Login failed");
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  const logout = useCallback(() => {
    msalInstance.logoutPopup().finally(() => {
      setUser(null);
      setAccessTokenApi(null);
      setAccessTokenGraph(null);
      setProfilePhoto(null);
      setAgentData(null);
      setAuthError(null);
    });
  }, []);

  // ✅ useCallback: función estable
  const getAccessTokenForApi = useCallback(async (accountOverride) => {
    const account = accountOverride || msalInstance.getActiveAccount() || user;
    if (!account) return null;
    try {
      const token = await acquire(msalInstance, apiRequest, account);
      setAccessTokenApi(token);
      return token;
    } catch (e) {
      setAuthError(e?.message || "Failed to acquire API token");
      return null;
    }
  }, [user]);

  // ✅ useCallback depende de getAccessTokenForApi (estable) y accessTokenApi
  const callApi = useCallback(
    async (path, init = {}) => {
      const account = msalInstance.getActiveAccount() || user;
      let token = accessTokenApi;
      if (!token) {
        token = await getAccessTokenForApi(account);
        if (!token) throw new Error("No API token available");
      }
      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(init.headers || {}),
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
      }
      const ct = res.headers.get("content-type") || "";
      return ct.includes("application/json") ? await res.json() : undefined;
    },
    [accessTokenApi, user, getAccessTokenForApi]
  );

  // Mount: intenta login (estable)
  useEffect(() => { login(); }, [login]);

  // ✅ Evita el warning: usa agentsState.agents dentro del effect
  useEffect(() => {
    if (!user) {
      setAgentData(null);
      return;
    }
    const list = (agentsState && agentsState.agents) ? agentsState.agents : [];
    if (!Array.isArray(list) || list.length === 0) {
      setAgentData(null);
      return;
    }
    const mail = (user.username || (user.idTokenClaims && user.idTokenClaims.preferred_username) || "").toLowerCase();
    const match = list.find(a => (a.agent_email || "").toLowerCase() === mail);
    setAgentData(match || null);
  }, [user, agentsState]); // ← depende del objeto state; si prefieres, usa [user, agentsState?.agents]

  // ✅ useMemo depende de funciones estables (getAccessTokenForApi, callApi) y estados
  const value = useMemo(() => ({
    user,
    accessTokenGraph,
    accessTokenApi,
    profilePhoto,
    agentData,
    department: (agentData && agentData.agent_department) || null,
    authLoaded,
    authError,
    login,
    logout,
    getAccessTokenForApi,
    callApi,
  }), [
    user,
    accessTokenGraph,
    accessTokenApi,
    profilePhoto,
    agentData,
    authLoaded,
    authError,
    login,
    logout,
    getAccessTokenForApi,
    callApi,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/**USO del contexto
 * 
 * import { useAuth } from "../context/authContext";

function useUpdateNotes() {
  const { callApi } = useAuth();

  const updateNotes = (payload) =>
    callApi("/cosmoUpdateNotes", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

  return { updateNotes };
}

/**
 * user lleva la info de todo el account, incluido tokenClaims.groups
 */