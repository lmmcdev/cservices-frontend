// AuthContext (drop-in)
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useAgents } from "./agentsContext";
import { ENDPOINT_URLS } from "../utils/js/constants";
import { msalConfig, apiScopes, graphScopes, loginRequest } from "../utils/azureAuth";
//import { useNotification } from "./notificationsContext";

export const msalInstance = new PublicClientApplication(msalConfig);

const AuthContext = createContext(undefined);

const graphRequest = { scopes: graphScopes };
const apiRequest   = { scopes: apiScopes };

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

// util: sleep + retry con backoff exponencial suave
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withRetry(fn, { retries = 3, baseDelay = 600 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i === retries) break;
      await sleep(baseDelay * Math.pow(1.6, i));
    }
  }
  throw lastErr;
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

  //const { showNotification } = useNotification();

  const API_BASE = ENDPOINT_URLS.API;

  const login = useCallback(async () => {
    setAuthLoaded(false);
    try {
      await msalInstance.initialize();
      let account = msalInstance.getActiveAccount();

      if (!account) {
        try {
          const resp = await msalInstance.ssoSilent(loginRequest);
          account = resp.account;
          msalInstance.setActiveAccount(account);
        } catch {
          const resp = await msalInstance.loginPopup(loginRequest);
          account = resp.account;
          msalInstance.setActiveAccount(account);
        }
      }
      if (!account) throw new Error("No active account after login.");
      setUser(account);

      const [tokenApi, tokenGraph] = await Promise.all([
        withRetry(() => acquire(msalInstance, apiRequest, account), { retries: 2 }).catch(() => null),
        withRetry(() => acquire(msalInstance, graphRequest, account), { retries: 3 }).catch(() => null),
      ]);

      setAccessTokenApi(tokenApi);
      setAccessTokenGraph(tokenGraph);

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
      //showNotification("❌ Error de autenticación. Vuelve a iniciar sesión.", "error");
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
      setAuthLoaded(false);
    });
  }, []);

  // Expone token API
  const getAccessTokenForApi = useCallback(
    async (accountOverride) => {
      const account = accountOverride || msalInstance.getActiveAccount() || user;
      if (!account) return null;
      try {
        const token = await withRetry(
          () => acquire(msalInstance, apiRequest, account),
          { retries: 1 }
        );
        setAccessTokenApi(token);
        return token;
      } catch (e) {
        setAuthError(e?.message || "Failed to acquire API token");
        //showNotification("⚠️ Sesión expirada, vuelve a iniciar sesión.", "warning");
        return null;
      }
    },
    [user]
  );

  // Fetch helper
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
    [accessTokenApi, user, getAccessTokenForApi, API_BASE]
  );

  // Auto-login inicial
  useEffect(() => { login(); }, [login]);

  // Mapear agente al user
  useEffect(() => {
    if (!user) {
      setAgentData(null);
      return;
    }
    const list = agentsState?.agents || [];
    if (!Array.isArray(list) || list.length === 0) {
      setAgentData(null);
      return;
    }
    const mail = (user.username || user.idTokenClaims?.preferred_username || "").toLowerCase();
    const match = list.find(a => (a.agent_email || "").toLowerCase() === mail);
    setAgentData(match || null);
  }, [user, agentsState]);

  // 🚨 Hook global de logout forzado por setupFetchAuth
  useEffect(() => {
    window.__FORCE_LOGOUT__ = (reason) => {
      console.warn("⛔ Force logout triggered:", reason);
      //showNotification("⚠️ Sesión finalizada. Por favor vuelve a iniciar sesión.", "warning");
      logout();
    };
    return () => { delete window.__FORCE_LOGOUT__; };
  }, [logout]);

  const authReady = !!user && !!accessTokenApi;

  const value = useMemo(() => ({
    user,
    accessTokenGraph,
    accessTokenApi,
    profilePhoto,
    agentData,
    department: agentData?.agent_department || null,
    authLoaded,
    authReady,
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
    authReady,
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
