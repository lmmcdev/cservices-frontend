import React, { useState } from 'react';
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
import ProfilePic from '../components/profilePic';
import SettingsDialog from '../dialogs/settingsDialog';
import { useNavigate, useLocation } from 'react-router-dom';
//import { useAgents } from '../../context/agentsContext';
//import { useAuth } from '../../context/authContext';
import LogoutButton from '../components/fields/logoutAzureButton';

const drawerWidthOpen = 200;
const drawerWidthClosed = 80;

export default function CollapsibleDrawer() {
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false); // ⬅️ estado del diálogo

  const navigate = useNavigate();
  const location = useLocation();
  //const { state: allAgents } = useAgents();
  //const { user } = useAuth();
  //const agents = allAgents.agents;
  //const supEmail = user?.username;
  //const currentAgent = agents.find((a) => a.agent_email === supEmail);

  const navItems = [
    { icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Dashboard', path: '/statistics', roles: ['Supervisor'] },
    { icon: <icons.callLogs style={{ fontSize: 22 }} />, label: 'Call Logs', path: '/dashboard', roles: ['Agent', 'Customer Service', 'Switchboard', 'Supervisor'] },
    { icon: <icons.team style={{ fontSize: 22 }} />, label: 'Team', path: '/agents', roles: ['Supervisor'] },
    { icon: <icons.searchIcon style={{ fontSize: 22 }} />, label: 'Find', path: '/profile-search', roles: ['Supervisor'] },
  ];

  // ✅ Solo ítems visibles para el rol del agente actual
  /*const filteredItems = navItems.filter((item) =>
    item.roles.includes(currentAgent.agent_rol)
  );*/
  const filteredItems = navItems;

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleOpenSettings = (e) => {
    e?.stopPropagation?.();
    setOpenSettings(true);
  };

  // Accesibilidad: activar con Enter o Space
  const handleKeyActivate = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenSettings(e);
    }
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
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List sx={{ width: '100%', px: open ? 1 : 0 }}>
            {filteredItems.map(({ icon, label, path }) => {
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
            <LogoutButton />
          </Box>
                

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
              <Tooltip title="Open settings">
                <Box
                  onClick={handleOpenSettings}
                  onKeyDown={handleKeyActivate}
                  tabIndex={0}
                  role="button"
                  aria-label="Open settings"
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


                <Tooltip title="Open settings">
                  <Box
                    onClick={handleOpenSettings}
                    onKeyDown={handleKeyActivate}
                    tabIndex={0}
                    role="button"
                    aria-label="Open settings"
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

      {/* Dialog de Settings */}
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
}
