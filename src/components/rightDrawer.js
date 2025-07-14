import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TicketQuickViewDialog from './dialogs/ticketQuickViewDialog';

export default function RightDrawer({ open, onClose, status, tickets = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(tickets)
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
  };

  return (
    <Box
      sx={{
        width: 400,
        bgcolor: '#fff',
        p: 2,
        boxShadow: 4,
        overflowY: 'auto',
        position: 'fixed',
        right: open ? 0 : -400,
        top: 0,
        bottom: 0,
        transition: 'right 0.3s ease',
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {status} — {tickets.length} Tickets
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {tickets.map((ticket) => (
          <React.Fragment key={ticket.id}>
            <ListItem
              button
              onClick={() => handleTicketClick(ticket)}
            >
              <ListItemText
                primary={`${ticket.caller_id || 'No title'}`}
                secondary={`Agent: ${ticket.agent_assigned || 'N/A'}`}
              />
              <Typography variant="p">
                Patient Name: {ticket.patient_name}
              </Typography>
              <Typography variant="p">
                Assigned Dept: {ticket.assigned_department}
              </Typography>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <TicketQuickViewDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        ticket={selectedTicket}
      />
    </Box>
  );
}
