// src/components/RightDrawer.jsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function RightDrawer({ open, onClose, status, tickets = [] }) {
  console.log(tickets)
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {`Tickets: ${status}`}
        </Typography>

        <List>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={ticket.patient_name || 'Paciente desconocido'}
                  secondary={`Agent: ${ticket.agent_assigned}`}
                />
                <Typography variant="caption">{`Caller ID: ${ticket.caller_id}`}</Typography>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No tickets found.
            </Typography>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
