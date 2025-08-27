// src/components/auxiliars/FloatingSettingsPopover.jsx
import React from 'react';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DateRangeIcon } from '@mui/x-date-pickers';

export default function FloatingSettingsPopover({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const id = open ? 'floating-settings-popover' : undefined;

  const navigate = useNavigate();
  
  // 👉 Items del menú
  const navItems = [
    { 
      icon: <TodayIcon sx={{ fontSize: 22 }} />, 
      label: 'Today Statistics', 
      path: '/statistics', 
      roles: ['Supervisor'] 
    },
    { 
      icon: <DateRangeIcon sx={{ fontSize: 22 }} />, 
      label: 'Daily Statistics', 
      path: '/historical_statistics', 
      roles: ['Supervisor'] 
    },
    { 
      icon: <CalendarMonthIcon sx={{ fontSize: 22 }} />, 
      label: 'Monthly Statistics', 
      path: '/monthly_statistics', 
      roles: ['Supervisor'] 
    },
  ];

  const handleNavigate = (path, label) => {
    let state = {};
    
    if (label === 'Daily Statistics') {
      state = { openDateSelector: true, mode: 'day' };
    } else if (label === 'Monthly Statistics') {
      state = { openDateSelector: true, mode: 'month' }; // 👈 aquí se manda la lógica para mes + año
    }

    navigate(path, { state });
    onClose();
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 4,
          width: 260,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ ml: 2, mb: 1, mt: 0.5, fontWeight: 600, color: '#5B5F7B' }}>
          Quick Menu
        </Typography>

        <List>
          {navItems.map(({ icon, label, path }) => (
            <ListItem disablePadding key={label}>
              <ListItemButton
                onClick={() => handleNavigate(path, label)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  gap: 1.5,
                  backgroundColor: 'transparent',
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
                    color: '#5B5F7B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#5B5F7B',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
}
