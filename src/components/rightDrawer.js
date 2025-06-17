import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { getTicketsByStatus } from '../utils/apiStats'; // Ajusta esto según tu API
import { getTodayDate } from '@mui/x-date-pickers/internals';

export default function RightDrawer({ open, onClose, status, accessToken, date=getTodayDate() }) {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (open && status) {
      fetchTickets();
    }
  }, [open, status, date]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTickets = async () => {
    if (!accessToken || !status) return;

    setLoading(true);

    try {
      // 👉 Aquí puedes usar la fecha como filtro si está seleccionada
      const res = await getTicketsByStatus(accessToken, status, date); // La API debe aceptar date opcional

      if (res.success) {
        setTickets(res.message);
      } else {
        console.error('Error fetching tickets:', res.message);
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {`Tickets: ${status}`}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    secondary={`Agent: ${ticket.agent_assigned}`}
                    primary={ticket.patient_name || 'Paciente desconocido'}
                  />
                  <p>{`Caller ID: ${ticket.caller_id}`}</p>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tickets found.
              </Typography>
            )}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
