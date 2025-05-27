import { msalConfig } from "./azureAuth";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ["User.Read"], // O tus propios scopes
};

export async function getLoggedInUser() {
  try {
    await msalInstance.initialize();

    const currentAccount = msalInstance.getActiveAccount();
    if (currentAccount) return currentAccount;

    const response = await msalInstance.ssoSilent(loginRequest);
    msalInstance.setActiveAccount(response.account);
    return response.account;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      try {
        // Fallback interactivo
        const response = await msalInstance.loginPopup(loginRequest);
        msalInstance.setActiveAccount(response.account);
        return response.account;
      } catch (popupError) {
        console.error("Error en login interactivo:", popupError);
        return null;
      }
    }

    console.error("Login falló:", error);
    return null;
  }
}
