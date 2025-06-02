// src/utils/graphHelpers.js
import { msalInstance } from "../utils/authContext";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const loginRequest = {
  scopes: ["User.ReadBasic.All"], // asegúrate de tener este scope habilitado
};

export const getUserPhotoByEmail = async (email) => {
  try {
    const account = msalInstance.getActiveAccount();
    if (!account) throw new Error("No active account");

    let tokenResponse;
    try {
      tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        tokenResponse = await msalInstance.acquireTokenPopup({
          ...loginRequest,
          account,
        });
      } else {
        throw error;
      }
    }

    const graphUrl = `https://graph.microsoft.com/v1.0/users/${email}/photo/$value`;

    const photoResponse = await fetch(graphUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    if (!photoResponse.ok) {
      throw new Error(`No se pudo obtener la imagen de ${email}`);
    }

    const blob = await photoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn(`Error obteniendo imagen de ${email}:`, error.message);
    return null; // fallback para mostrar iniciales si no hay imagen
  }
};
