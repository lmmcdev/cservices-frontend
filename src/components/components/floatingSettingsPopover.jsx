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
import { useAgents } from '../../context/agentsContext';
import { useAuth } from '../../context/authContext';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function FloatingSettingsPopover({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const id = open ? 'floating-settings-popover' : undefined;

  const navigate = useNavigate();
  const { state: allAgents } = useAgents();
  const { user } = useAuth();

  const agents = allAgents.agents;
  const supEmail = user?.username;
  const currentAgent = agents.find(a => a.agent_email === supEmail);

  // 👉 Mismos items del sidebar
  const navItems = [
    { icon: <TodayIcon sx={{ fontSize: 22 }} />, label: 'Today Statistics', path: '/statistics', roles: ['Supervisor'] },
    { icon: <CalendarMonthIcon sx={{ fontSize: 22 }} />, label: 'Daily Statistics', path: '/historical_statistics', roles: ['Supervisor'] },
  ];

  const filteredItems = navItems.filter(item =>
    item.roles.includes(currentAgent?.agent_rol)
  );

  const handleNavigate = (path, label) => {
    navigate(path, { state: { openDateSelector: label === 'Daily Statistics' } });
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
          {filteredItems.map(({ icon, label, path }) => (
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
                  color: '#5B5F7B', // 👈 color gris por defecto
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
