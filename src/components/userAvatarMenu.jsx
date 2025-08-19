// src/components/userAvatarMenu.jsx
import React from 'react';
import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { Icon } from '@iconify/react';

const PRIMARY = '#00A1FF';

function displayNameFrom(user) {
  return user?.name || user?.displayName || user?.idTokenClaims?.name || '';
}
function emailFrom(user) {
  return (
    user?.username ||
    user?.email ||
    user?.idTokenClaims?.preferred_username ||
    ''
  );
}

export default function UserAvatarMenu({
  anchorEl,
  open,
  onClose,
  onSettings,
  onLogout,
  user,
}) {
  const name = displayNameFrom(user);
  const email = emailFrom(user);

  const handleSettings = () => { onClose?.(); onSettings?.(); };
  const handleLogout   = () => { onClose?.(); onLogout?.(); };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      marginThreshold={0}
      MenuListProps={{ disablePadding: true }} 
      slotProps={{
        paper: {
          sx: (theme) => ({
            mt: -1.25,
            ml: 1,
            minWidth: 280,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? '#0B1220' : '#FFFFFF',
            color: theme.palette.mode === 'dark' ? '#E5E7EB' : '#0F172A',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(148,163,184,0.22)'
              : '1px solid #E6EEF8',
            boxShadow:
              '0 16px 40px rgba(2,12,27,0.12), 0 2px 6px rgba(2,12,27,0.06)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              display: 'block',
              height: 3,
              width: '100%',
              background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY}80 70%, transparent)`,
              pb: 0.5,
            },
            '& .MuiDivider-root': { my: 0.5 },
            /* 🔧 Ajustes para acercar icono y label */
            '& .MuiMenuItem-root': {
                minHeight: 0,        // ← sin alto mínimo que desbalancea
                mx: 1,
                my: 0.75,             // ← margen vertical simétrico
                py: 0.75,            // ← padding vertical parejo
                px: 1.25,            // (mantiene tu padding horizontal)
                borderRadius: 2,
                gap: 0.75,
                transition: 'background-color 120ms ease, transform 120ms ease',
                '& .MuiListItemIcon-root': {
                    minWidth: 24,
                    mr: 0.5,           // ← icono más cerca del label
                    color: PRIMARY,
                },
                '& .MuiListItemText-root': { m: 0 },
                '&:hover': {
                    backgroundColor:
                    theme.palette.mode === 'dark'
                        ? 'rgba(0,161,255,0.12)'
                        : '#EAF6FF',
                },
            },
          }),
        },
      }}
    >
      <Box
        role="presentation"
        sx={{
          px: 2,
          pt: 1.75,
          pb: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {name ? (
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }} noWrap title={name}>
              {name}
            </Typography>
          ) : null}
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap title={email}>
            {email || 'Signed in'}
          </Typography>
        </Box>
        <Icon icon="ri:checkbox-circle-fill" width={18} height={18} style={{ color: PRIMARY, opacity: 0.9 }} />
      </Box>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem onClick={handleSettings}>
        <ListItemIcon>
          <Icon icon="lucide:settings" width={20} height={20} />
        </ListItemIcon>
        <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600 }} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Icon icon="lucide:log-out" width={20} height={20} />
        </ListItemIcon>
        <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 600 }} />
      </MenuItem>
    </Menu>
  );
}
