import React from 'react';
import { useMsal } from '@azure/msal-react';
import { msalConfig } from "../../../utils/azureAuth";
import { Button } from '@mui/material';


const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(msalConfig) // Or instance.loginRedirect(loginRequest)
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogin}>Login on Azure</Button>
  );
};

export default LoginButton;
