// src/setupFetchAuth.js
import { getApiAccessToken } from "./auth/authTokenProvider";
import { ENDPOINT_URLS } from "./utils/js/constants";

// Puedes soportar varias APIs (si no, deja solo ENDPOINT_URLS.API)
const API_BASES = [ENDPOINT_URLS.API].filter(Boolean); 
// Ej: ["https://cservicesapi.azurewebsites.net/api"]

function withTrailingSlash(pathname = "") {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function toURL(u) {
  // Soporta relativas y absolutas
  return new URL(u, window.location.origin);
}

function shouldAttachAuth(urlString) {
  try {
    const req = toURL(urlString);

    return API_BASES.some((base) => {
      const api = toURL(base);

      // Normalizamos ambos pathnames
      const reqPath = withTrailingSlash(req.pathname);
      const apiPath = withTrailingSlash(api.pathname);

      // Caso A: match absoluto (mismo origin y mismo prefijo de path)
      const absoluteMatch =
        req.origin === api.origin && reqPath.startsWith(apiPath);

      // Caso B: match por PATH en el mismo origen actual (útil si en dev usas proxy /api -> dominio externo)
      const sameOriginPathMatch =
        req.origin === window.location.origin && reqPath.startsWith(apiPath);

      // Opcional: si quieres permitir que /api en el origen actual cuente como la API
      // aunque API_BASE sea absoluto a otro dominio, dejamos sameOriginPathMatch activado.
      // Si NO quieres esto, comenta la siguiente línea y deja solo absoluteMatch.
      return absoluteMatch || sameOriginPathMatch;
    });
  } catch (e) {
    // Si la URL no es válida, no tocamos la request
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

  // IMPORTANTE: llama a setupFetchAuth() lo más temprano posible (ej. en src/main.jsx)
  // para que todas las peticiones ya usen el fetch parcheado.

  window.fetch = async (input, init = {}) => {
    try {
      const urlString = typeof input === "string" ? input : input.url;

      if (!shouldAttachAuth(urlString)) {
        return originalFetch(input, init);
      }

      // Clona headers existentes
      const headers = new Headers(
        init.headers || (typeof input !== "string" ? input.headers : undefined)
      );

      // Si no trae Authorization, lo agregamos
      if (!headers.has("Authorization")) {
        let token;
        try {
          token = await getApiAccessToken();
        } catch (e) {
          const err = new Error("Auth required");
          err.code = "AUTH_REQUIRED";
          throw err;
        }
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Content-Type sólo si aplica
      const body = init.body;
      if (!headers.has("Content-Type") && body && !isFormDataOrStream(body)) {
        headers.set("Content-Type", "application/json");
      }

      const reqInit = { ...init, headers };
      let response = await originalFetch(input, reqInit);

      // Reintento en 401 con token fresco
      if (response.status === 401) {
        try {
          const freshToken = await getApiAccessToken();
          headers.set("Authorization", `Bearer ${freshToken}`);
          response = await originalFetch(input, { ...reqInit, headers });
        } catch {
          // Si no se puede renovar, deja pasar el 401
        }
      }

      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  window.__FETCH_AUTH_PATCHED__ = true;
}
