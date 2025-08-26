// src/components/sideBar.jsx
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { icons } from '../auxiliars/icons';
import ProfilePic from '../auxiliars/tickets/profilePic';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/authContext';
import { GROUP_IDS } from '../../utils/js/constants';

import { useMsal } from '@azure/msal-react';
import UserAvatarMenu from '../userAvatarMenu';
import DescriptionIcon from '@mui/icons-material/Description';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

// ✅ Carga perezosa del SettingsDialog (ruta y case correctos)
const LazySettingsDialog = lazy(() => import('../dialogs/settingsDialog'));
// (opcional) precarga para abrir más rápido
const preloadSettingsDialog = () => import('../dialogs/settingsDialog');

const drawerWidthOpen = 200;
const drawerWidthClosed = 80;

// 🔐 Helper: ¿el usuario pertenece a alguno de los grupos?
const hasAnyGroup = (userGroups = [], allowedGroups = []) =>
  Array.isArray(userGroups) &&
  Array.isArray(allowedGroups) &&
  allowedGroups.some(g => userGroups.includes(g));

export default function CollapsibleDrawer({ agent }) {
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--drawer-width', open ? '200px' : '80px');
    root.style.setProperty('--content-gap', '39px'); // gap unificado
  }, [open]);

  const { instance } = useMsal();

  const handleAvatarClick = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const navigate = useNavigate();
  const location = useLocation();

  // del authContext
  const { user = {} } = useAuth() || {};
  const groups = useMemo(() => user?.idTokenClaims?.groups || [], [user]);

  // 🎯 Menú + control de acceso por grupos AAD
  const navItems = useMemo(() => ([
    {
      icon: <icons.dashboard style={{ fontSize: 20 }} />,
      label: 'Dashboard',
      path: '/statistics',
      allowedGroups: [GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS],
    },
    {
      icon: <icons.callLogs style={{ fontSize: 20 }} />,
      label: 'Call Logs',
      path: '/dashboard',
      allowedGroups: [
        GROUP_IDS.CUSTOMER_SERVICE.AGENTS,
        GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS,
        GROUP_IDS.CUSTOMER_SERVICE.REMOTE,
      ],
    },
    {
      icon: <icons.team style={{ fontSize: 21 }} />,
      label: 'Team',
      path: '/agents',
      allowedGroups: [GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS],
    },
    {
      icon: <TravelExploreIcon style={{ fontSize: 24 }} />,
      label: 'Find',
      path: '/profile-search',
      allowedGroups: [GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS],
    },
    {
      icon: <DescriptionIcon style={{ fontSize: 24 }} />,
      label: 'Reports',
      path: '/reports',
      allowedGroups: [GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS],
    },
  ]), []);

  // 🧮 Filtrado final por grupos del usuario
  const visibleItems = useMemo(
    () => navItems.filter(item => hasAnyGroup(groups, item.allowedGroups)),
    [groups, navItems]
  );

  const handleListItemClick = (path) => navigate(path);
  const toggleOpen = () => setOpen(prev => !prev);

  // abrir settings (monta el diálogo SOLO cuando se abre)
  const handleOpenSettingsFromMenu = () => {
    preloadSettingsDialog().finally(() => setOpenSettings(true));
  };

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/' })
      .catch(e => console.error('Logout failed:', e));
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: open ? 'flex-start' : 'center',
            paddingTop: 2,
            paddingLeft: open ? 2 : 0,
            paddingRight: 0,
            borderRight: 'none',
            boxShadow: '8px 0 24px rgba(239, 241, 246, 1)',
            backgroundColor: '#fff',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List sx={{ width: '100%', px: open ? 1 : 0 }}>
            {visibleItems.map(({ icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <ListItemButton
                  key={label}
                  onClick={() => handleListItemClick(path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    mb: 1.5,
                    mx: open ? 1 : 0,
                    backgroundColor: isActive ? '#dff3ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'flex-start' : 'center',
                    pl: open ? 1.5 : 0,
                    pr: open ? 1.5 : 0,
                    gap: open ? 1.5 : 0,
                    '&:hover': {
                      backgroundColor: '#dff3ff',
                      '& .MuiListItemIcon-root': { color: '#00a1ff' },
                      '& .MuiTypography-root': { color: '#00a1ff' },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      color: isActive ? '#00a1ff' : '#5B5F7B',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: 15,
                        color: isActive ? '#00a1ff' : '#5B5F7B',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider
            sx={{
              width: open ? '90%' : '100%',
              alignSelf: 'flex-end',
              mr: open ? '10px' : 0,
              mb: 1,
            }}
          />

          {/* ProfilePic + Collapse Button */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: open ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
              px: open ? 2 : 0,
              pb: 2,
              pt: 0.2,
              gap: open ? 0 : 1,
            }}
          >
            {open ? (
              <Tooltip title="Account">
                <Box
                  onClick={handleAvatarClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAvatarClick(e);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Open account menu"
                  sx={{ cursor: 'pointer', outline: 'none' }}
                >
                  <ProfilePic size={36} />
                </Box>
              </Tooltip>
            ) : (
              <>
                <IconButton
                  onClick={toggleOpen}
                  disableRipple
                  sx={{
                    p: 0,
                    '&:hover': { backgroundColor: 'transparent' },
                    '&:active': { backgroundColor: 'transparent' },
                  }}
                >
                  <icons.collapseRight />
                </IconButton>

                <Tooltip title="Account">
                  <Box
                    onClick={handleAvatarClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAvatarClick(e);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Open account menu"
                    sx={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <ProfilePic size={36} />
                  </Box>
                </Tooltip>
              </>
            )}

            {open && (
              <IconButton
                onClick={toggleOpen}
                disableRipple
                sx={{
                  p: 0,
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' },
                }}
              >
                <icons.collapseLeft />
              </IconButton>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* ✅ Montar el diálogo solo cuando openSettings === true */}
      {openSettings && (
        <Suspense fallback={null /* puedes poner un loader si quieres */}>
          <LazySettingsDialog
            open
            onClose={() => setOpenSettings(false)}
            agent={agent}
          />
        </Suspense>
      )}

      <UserAvatarMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onSettings={handleOpenSettingsFromMenu}
        onLogout={handleLogout}
        user={user}
      />
    </>
  );
}
