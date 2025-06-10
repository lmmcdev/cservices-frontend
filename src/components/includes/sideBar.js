import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import { icons } from '../auxiliars/icons';
import ProfilePic from '../components/profilePic';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidthOpen = 200;
const drawerWidthClosed = 80;

export default function CollapsibleDrawer({ agents }) {
  const [open, setOpen] = useState(false);
  //const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Dashboard', path: '/home' },
    { icon: <icons.callLogs style={{ fontSize: 22 }} />, label: 'Call Logs', path: '/dashboard' },
    { icon: <icons.team style={{ fontSize: 22 }} />, label: 'Team', path: '/agents' },
    { icon: <icons.searchIcon style={{ fontSize: 22 }} />, label: 'Find', path: '/profile-search' },
  ];

  const handleListItemClick = (path) => {
    navigate(path);
    //setSelectedIndex(path);
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
                    '& .MuiListItemIcon-root': {
                      color: '#00a1ff',
                    },
                    '& .MuiTypography-root': {
                      color: '#00a1ff',
                    },
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
              <Box display="flex" alignItems="center">
                <ProfilePic size={36} />
            </Box>
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
