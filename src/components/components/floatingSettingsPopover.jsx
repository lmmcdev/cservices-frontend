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
import { icons } from '../auxiliars/icons';

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
    { icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Today Statistics', path: '/statistics', roles: ['Supervisor'] },
    {icon: <icons.dashboard style={{ fontSize: 22 }} />, label: 'Daily Statistics', path: '/historical_statistics', roles: ['Supervisor'] },
    { icon: <icons.callLogs style={{ fontSize: 22 }} />, label: 'Call Logs', path: '/dashboard', roles: ['Agent', 'Customer Service', 'Switchboard', 'Supervisor'] },
    { icon: <icons.team style={{ fontSize: 22 }} />, label: 'Team', path: '/agents', roles: ['Supervisor'] },
    { icon: <icons.searchIcon style={{ fontSize: 22 }} />, label: 'Find', path: '/profile-search', roles: ['Supervisor'] },
  ];

  const filteredItems = navItems.filter(item =>
    item.roles.includes(currentAgent?.agent_rol)
  );

  const handleNavigate = (path) => {
    navigate(path);
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
      PaperProps={{ sx: { p: 2, borderRadius: 3, width: 250 } }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Menú rápido</Typography>

        <List>
          {filteredItems.map(({ icon, label, path }) => (
            <ListItem disablePadding key={label}>
              <ListItemButton onClick={() => handleNavigate(path)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
}
