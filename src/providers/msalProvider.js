import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../utils/azureAuth";

const msalInstance = new PublicClientApplication(msalConfig);

export default function MsalProviderWrapper({ children }) {
  return (
    <MsalProvider instance={msalInstance}>
        {children}
    </MsalProvider>
  );
}