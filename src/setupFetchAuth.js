// src/setupFetchAuth.js
import { getApiAccessToken } from "./auth/authTokenProvider";
import { ENDPOINT_URLS } from "./utils/js/constants";

// Ajusta si necesitas varias APIs:
const API_BASE = ENDPOINT_URLS.API; // ej: "https://tu-funcion.azurewebsites.net"

function shouldAttachAuth(urlString) {
  try {
    // Soporta urls relativas y absolutas
    const url = new URL(urlString, window.location.origin);
    const api = new URL(API_BASE, window.location.origin);
    // Sólo agrega Authorization si va contra tu API_BASE
    return url.origin === api.origin && url.pathname.startsWith(api.pathname);
  } catch {
    return false;
  }
}

function isFormDataOrStream(body) {
  return (
    (typeof FormData !== "undefined" && body instanceof FormData) ||
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) ||
    (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
  );
}

export function setupFetchAuth() {
  if (typeof window === "undefined" || !window.fetch || window.__FETCH_AUTH_PATCHED__) return;
  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    try {
      const urlString = typeof input === "string" ? input : input.url;

      // Si no va a tu API, deja pasar
      if (!shouldAttachAuth(urlString)) {
        return originalFetch(input, init);
      }

      // Clona headers (si venían)
      const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));

      // Si ya tiene Authorization, no hagas nada
      if (!headers.has("Authorization")) {
        let token;
        try {
          token = await getApiAccessToken();
        } catch (e) {
          // Si no hay token (no logueado / interacción requerida), lanza error 401-like
          const err = new Error("Auth required");
          err.code = "AUTH_REQUIRED";
          throw err;
        }
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Content-Type: sólo si no es FormData/stream y no viene ya
      const body = init.body;
      if (!headers.has("Content-Type") && body && !isFormDataOrStream(body)) {
        headers.set("Content-Type", "application/json");
      }

      const reqInit = { ...init, headers };
      let response = await originalFetch(input, reqInit);

      // Si expira (401), intenta 1 reintento con token fresco
      if (response.status === 401) {
        try {
          const freshToken = await getApiAccessToken();
          headers.set("Authorization", `Bearer ${freshToken}`);
          response = await originalFetch(input, { ...reqInit, headers });
        } catch {
          // Deja pasar 401 si no pudimos renovar silenciosamente
        }
      }

      return response;
    } catch (err) {
      // Preserva el comportamiento de fetch: rechaza la promesa
      return Promise.reject(err);
    }
  };

  window.__FETCH_AUTH_PATCHED__ = true;
}
