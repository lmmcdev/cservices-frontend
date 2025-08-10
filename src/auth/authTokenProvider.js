// src/auth/tokenProvider.js
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance } from "../context/authContext";
// Usa el mismo scope que en tu AuthProvider:
const API_SCOPE = "api://aeec4f18-85f7-4c67-8498-39d4af1440c1/access_as_user";

const apiRequest = { scopes: [API_SCOPE] };

async function acquire(msal, req, account) {
  try {
    const res = await msal.acquireTokenSilent({ ...req, account });
    return res.accessToken;
  } catch (e) {
    // En un interceptor global, evita abrir popups.
    // Deja que el caller maneje el error (o maneja un callback).
    if (e instanceof InteractionRequiredAuthError) throw e;
    throw e;
  }
}

export async function getApiAccessToken() {
  await msalInstance.initialize(); // idempotente
  const account = msalInstance.getActiveAccount();
  if (!account) throw new Error("No active account");
  return acquire(msalInstance, apiRequest, account);
}
