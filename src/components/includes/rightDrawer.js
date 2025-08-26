import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TicketQuickViewDialog from '../dialogs/ticketQuickViewDialog';
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
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        bgcolor: '#fff',
        borderLeft: '1px solid #f0f0f0',
        boxShadow: 4,
        overflowY: 'auto',

        // 👇 Anchos responsive
        width: { xs: '100vw', sm: 400, md: 460, lg: 520 },

        // 👇 Padding responsive
        p: { xs: 2, sm: 3 },

        // 👇 Animación de entrada/salida
        transform: open ? 'translateX(0%)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          px: { xs: 1, sm: 2 },
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
        inputValue=""
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
