import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TicketQuickViewDialog from './dialogs/ticketQuickViewDialog';
import { getStatusColor } from '../utils/js/statusColors'; // Asegúrate de tener esta función

export default function RightDrawer({ open, onClose, status, tickets = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
        width: 420,
        bgcolor: '#fff',
        p: 3,
        boxShadow: 4,
        overflowY: 'auto',
        position: 'fixed',
        right: open ? 0 : -420,
        top: 0,
        bottom: 0,
        transition: 'right 0.3s ease',
        zIndex: 1300,
        borderLeft: '1px solid #f0f0f0',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 2,
          paddingX: 2,
          borderBottom: '1px solid #e0e0e0',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Viewing
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {status} — {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Ticket Cards */}
      <Stack spacing={2}>
        {tickets.map((ticket) => {
          const color = getStatusColor(ticket.status); // get color by status (like 'new', 'pending', etc.)

          return (
            <Card
              key={ticket.id}
              onClick={() => handleTicketClick(ticket)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                borderRadius: 3,
                overflow: 'hidden',
                transform: selectedTicket?.id === ticket.id ? 'scale(1.015)' : 'scale(1)',
                backgroundColor: selectedTicket?.id === ticket.id ? `${color}26` : 'transparent',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  ...(selectedTicket?.id !== ticket.id && {
                    transform: 'scale(1.015)',
                    backgroundColor: `${color}15`,
                  }),
                },
              }}
            >
              {/* Color bar */}
              <Box sx={{ width: 6, backgroundColor: color }} />

              {/* Content */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {ticket.caller_id || 'No title'}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Patient:</strong> {ticket.patient_name || 'N/A'}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Agent:</strong> {ticket.agent_assigned || 'N/A'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>Department:</strong> {ticket.assigned_department || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <TicketQuickViewDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        ticket={selectedTicket}
      />
    </Box>
  );
}
