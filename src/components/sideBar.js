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
  Typography,
} from '@mui/material';
import { icons } from '../components/icons';
import ProfilePic from '../components/components/profilePic';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidthOpen = 200;
const drawerWidthClosed = 80;

export default function CollapsibleDrawer({ user }{ agents }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Dashboard', path: '/home' },
    { icon: <icons.callLogs style={{ fontSize: 22 }} />, label: 'Call Logs', path: '/dashboard' },
    { icon: <icons.team style={{ fontSize: 22 }} />, label: 'Team', path: '/agents' },
  ];

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
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
          {navItems.map(({ icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItemButton
                key={label}
                onClick={() => handleListItemClick(path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  mx: open ? 1 : 0,
                  justifyContent: open ? 'flex-start' : 'center',
                  backgroundColor: isActive ? '#e6f4ff' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: 'center',
                    color: isActive ? '#007bff' : '#5B5F7B',
                    backgroundColor: isActive ? '#007bff20' : 'transparent',
                    borderRadius: '50%',
                    padding: 0.7,
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 15,
                      color: isActive ? '#007bff' : 'inherit',
                      fontWeight: isActive ? 'bold' : 'normal',
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
            <Box display="flex" alignItems="center">
              <ProfilePic size={36} />
            </Box>
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
              <ProfilePic size={36} />
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
  );
}
