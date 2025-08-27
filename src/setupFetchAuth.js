import { getApiAccessToken } from "./auth/authTokenProvider";
import { ENDPOINT_URLS } from "./utils/js/constants";

const API_BASES = [ENDPOINT_URLS.API].filter(Boolean); 

function withTrailingSlash(pathname = "") {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function toURL(u) {
  return new URL(u, window.location.origin);
}

function shouldAttachAuth(urlString) {
  try {
    const req = toURL(urlString);
    return API_BASES.some((base) => {
      const api = toURL(base);
      const reqPath = withTrailingSlash(req.pathname);
      const apiPath = withTrailingSlash(api.pathname);
      const absoluteMatch =
        req.origin === api.origin && reqPath.startsWith(apiPath);
      const sameOriginPathMatch =
        req.origin === window.location.origin && reqPath.startsWith(apiPath);
      return absoluteMatch || sameOriginPathMatch;
    });
  } catch (e) {
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

// 👇 Función global de logout (inyectada desde authContext)
function triggerGlobalLogout(reason) {
  if (typeof window.__FORCE_LOGOUT__ === "function") {
    window.__FORCE_LOGOUT__(reason);
  } else {
    console.warn("Logout no implementado. Razón:", reason);
  }
}

export function setupFetchAuth() {
  if (typeof window === "undefined" || !window.fetch || window.__FETCH_AUTH_PATCHED__) return;
  const originalFetch = window.fetch;

  window.fetch = async (input, init = {}) => {
    try {
      const urlString = typeof input === "string" ? input : input.url;

      if (!shouldAttachAuth(urlString)) {
        return originalFetch(input, init);
      }

      const headers = new Headers(
        init.headers || (typeof input !== "string" ? input.headers : undefined)
      );

      if (!headers.has("Authorization")) {
        let token;
        try {
          token = await getApiAccessToken();
        } catch (e) {
          triggerGlobalLogout("AUTH_REQUIRED");
          const err = new Error("Auth required");
          err.code = "AUTH_REQUIRED";
          throw err;
        }
        headers.set("Authorization", `Bearer ${token}`);
      }

      const body = init.body;
      if (!headers.has("Content-Type") && body && !isFormDataOrStream(body)) {
        headers.set("Content-Type", "application/json");
      }

      const reqInit = { ...init, headers };
      let response;

      try {
        response = await originalFetch(input, reqInit);
      } catch (networkErr) {
        // 👇 Captura errores tipo "Failed to fetch"
        triggerGlobalLogout("NETWORK_FAILED");
        throw networkErr;
      }

      if (response.status === 401) {
        try {
          const freshToken = await getApiAccessToken();
          headers.set("Authorization", `Bearer ${freshToken}`);
          response = await originalFetch(input, { ...reqInit, headers });

          if (response.status === 401) {
            triggerGlobalLogout("UNAUTHORIZED");
          }
        } catch {
          triggerGlobalLogout("REFRESH_FAILED");
        }
      }

      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  window.__FETCH_AUTH_PATCHED__ = true;
}
