import { redirect } from "react-router-dom";

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
  
  export const loginRequest = {
    scopes: ["User.Read", "User.ReadBasic.All"], // puedes agregar más scopes según tu app
  };