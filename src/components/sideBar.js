// src/components/Sidebar.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, Box } from '@mui/material';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'

const drawerWidth = 100;

// Cambia esto para mover el bloque de íconos (puede ser '100px', '30%', etc.)
const iconPosition = '10%'; // 👈 AQUÍ defines la posición vertical

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const icons = [
    <LeaderboardRoundedIcon key="leaderboard" />,
    <CallRoundedIcon key="calls2" />,
    <PeopleAltRoundedIcon key="agents" />
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
         width: drawerWidth,
            boxSizing: 'border-box',
            height: '100vh', // 👈 asegura que el Drawer cubre toda la altura del viewport
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',// Necesario para usar posición absoluta dentro
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: iconPosition,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <List>
          {icons.map((icon, index) => (
            <ListItem
              button
              key={index}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
              sx={{
                justifyContent: 'center',
                color: selectedIndex === index ? 'primary.main' : 'inherit',
                mb:3,
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: 'center',
                  color: selectedIndex === index ? 'primary.main' : 'inherit',
                  minWidth: 'auto',
                }}
              >
                {icon}
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}