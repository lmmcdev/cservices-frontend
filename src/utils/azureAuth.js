// src/authConfig.js
export const msalConfig = {
    auth: {
      clientId: "08e5a940-4349-45b0-94ce-46505e0a99a3", // 👈 desde Azure Portal
      authority: "https://login.microsoftonline.com/7313ad10-b885-4b50-9c75-9dbbd975618f",
      redirectUri: "https://cservices.lmitservices.com"
      //redirectUri: "https://proud-tree-09d93ae0f.6.azurestaticapps.net/", // o tu dominio en Azure
      //redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage", // o localStorage
      storeAuthStateInCookie: false,
    },
  };

  // Scopes de tu API expuesta (puedes añadir más si creas otros)
  export const apiScopes = [
    "api://aeec4f18-85f7-4c67-8498-39d4af1440c1/access_as_user",
  ];

  // Scopes de Graph que usas
  export const graphScopes = ["User.Read", "User.ReadBasic.All", "GroupMember.Read.All", "User.Read.All"];

  // Para el login inicial: agrega lo que quieras “pre-consentir”
  // (si no quieres pedir el scope de API en el login, quítalo de aquí)
  export const loginRequest = {
    scopes: ["openid", "profile", "email", ...graphScopes, ...apiScopes],
  };