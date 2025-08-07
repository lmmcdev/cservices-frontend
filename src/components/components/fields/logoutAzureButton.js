import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMsal } from '@azure/msal-react';


// Estilos más vistosos y profesionales
const stylishSx = theme => ({
  color: '#ffd60a', // Amarillo dorado brillante
  background: 'linear-gradient(135deg, #03045e 0%, #0077b6 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0077b6 0%, #03045e 100%)',
  },
  borderRadius: '50%',
  padding: 1,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.2s ease-in-out',
  '&:active': {
    transform: 'scale(0.8)',
  }
});


const LogoutButton = ({
  method = 'redirect',       // 'redirect' o 'popup'
  redirectUri = '/',        // URI a la que redirigir tras cerrar sesión
  tooltip = 'Sign out'      // Texto de acceso rápido al pasar el cursor
}) => {
  const theme = useTheme();
  const { instance } = useMsal();

  const handleLogout = () => {
    const logoutRequest = { postLogoutRedirectUri: redirectUri };

    if (method === 'popup') {
      instance.logoutPopup(logoutRequest).catch(e => console.error('Logout popup failed:', e));
    } else {
      instance.logoutRedirect(logoutRequest).catch(e => console.error('Logout redirect failed:', e));
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleLogout} sx={stylishSx}
      >
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
