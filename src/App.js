// src/App.js
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/sideBar';
import Topbar from './components/topBar';
import TableTickets from './pages/tableTickets';
import { LoadingProvider } from './components/loadingProvider';
import MsalProviderWrapper from './providers/msalProvider';
import { getLoggedInUser } from "./utils/azureAuthService";
import { AuthProvider } from "./utils/authContext";

function App() {
  const [user, setUser] = useState(null);

   useEffect(() => {
    getLoggedInUser().then(account => {
      if (account) {
        console.log("Usuario autenticado:", account);
        setUser(account);
      } else {
        console.log("No hay usuario activo");
      }
    });
  }, [user]);

  return (
    <MsalProviderWrapper>
      <AuthProvider>
      <LoadingProvider>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Topbar />
          <Sidebar />
          <TableTickets />
        </Box>
      </LoadingProvider>
      </AuthProvider>
    </MsalProviderWrapper>
  );
}

export default App;