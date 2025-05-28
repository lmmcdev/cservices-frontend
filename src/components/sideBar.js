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
} from '@mui/material';
import { icons } from '../components/icons';

const drawerWidthOpen = 200;
const drawerWidthClosed = 80;

export default function CollapsibleDrawer() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const navItems = [
    { icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Dashboard' },
    { icon: <icons.callLogs style={{ fontSize: 22 }} />, label: 'Call Logs' },
    { icon: <icons.team style={{ fontSize: 22 }} />, label: 'Team' },
  ];

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
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
          {navItems.map(({ icon, label }, index) => (
            <ListItemButton
              key={label}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
              sx={{
                mb: 1,
                borderRadius: '25px',
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                color: selectedIndex === index ? '#00a1ff' : '#5B5F7B',
                backgroundColor: selectedIndex === index ? '#dff3ff' : 'transparent',
                '&:hover': {
                  backgroundColor: '#dff3ff',
                  color: '#00a1ff',
                  '& .MuiListItemIcon-root': {
                    color: '#00a1ff',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: selectedIndex === index ? '#00a1ff' : '#5B5F7B',
                }}
              >
                {icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 15, color: 'inherit' }}
                  sx={{ color: 'inherit' }}
                />
              )}
            </ListItemButton>
          ))}
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

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: open ? 'flex-end' : 'center',
            pr: open ? '10px' : 0,
            pb: 1,
          }}
        >
          <IconButton
            onClick={toggleOpen}
            disableRipple
            sx={{
              p: 0,
              '&:hover': { backgroundColor: 'transparent' },
              '&:active': { backgroundColor: 'transparent' },
            }}
          >
            {open ? <icons.collapseLeft /> : <icons.collapseRight />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}