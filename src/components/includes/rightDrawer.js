import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TicketQuickViewDialog from '../dialogs/ticketQuickViewDialog';
import { getStatusColor } from '../../utils/js/statusColors';
import usePaginatedTickets from '../hooks/usePaginatedTickets';
import SearchTicketResults from '../components/tickets/searchTicketsResults';

export default function RightDrawer({
  open,
  onClose,
  status,
  fetchFn,
  fetchParams = {},
}) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Hook para manejar paginación
  const { tickets, loading, hasMore, fetchMore, reset } = usePaginatedTickets(fetchFn, fetchParams);

  // ✅ Cargar tickets cuando se abre el Drawer
 useEffect(() => {
  if (open && fetchFn) {
    reset();
    fetchMore();
  }
   // eslint-disable-next-line
}, [open, fetchFn, fetchParams]);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedTicket(null);
    setDialogOpen(false);
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
          pb: 2,
          px: 2,
          borderBottom: '1px solid #e0e0e0',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Viewing
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {status || 'Tickets'} — {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Ticket Cards */}
      <SearchTicketResults
                results={tickets}
                inputValue=''
                hasMore={hasMore}
                loadMore={fetchMore}
                selectedTicket={handleTicketClick}
                
              />
      

      {loading && tickets.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {hasMore && tickets.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={fetchMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}

      <TicketQuickViewDialog open={dialogOpen} onClose={handleDialogClose} ticket={selectedTicket} />
    </Box>
  );
}
