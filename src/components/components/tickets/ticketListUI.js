import React from 'react';
import { Card, Box, Typography, Chip } from '@mui/material';
import EmptyState from '../../auxiliars/emptyState';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

/**
 * Renders a list of tickets with their summary and call reason.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.tickets - Array of ticket objects to display.
 * @returns {JSX.Element} The rendered list of tickets.
 */

const TicketItem = React.memo(({ ticket }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 2,
        py: 2,
        mb: 2,
        minHeight: 100, // ← altura mínima fija
        width: '100%',
        maxWidth: 850,
        margin: '5px auto',
        boxSizing: 'border-box',    
        borderRadius: '20px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#f9fbfd',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#eaf6ff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
          borderColor: '#00a1ff',
        },
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="#333"
        noWrap
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {ticket.summary || 'Sin resumen'}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#6c757d',
          fontWeight: 500,
          fontSize: '0.75rem',
          mt: 0.5,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2, // ← máximo 2 líneas
        }}
      >
        Motivo: {ticket.call_reason || 'Desconocido'}
      </Typography>

      {ticket.status && (
        <Chip
          label={ticket.status.toUpperCase()}
          size="small"
          sx={{
            mt: 1,
            fontSize: '0.65rem',
            fontWeight: 600,
            bgcolor: '#00A1FF',
            color: 'white',
            borderRadius: '999px',
            alignSelf: 'flex-start',
          }}
        />
      )}
    </Card>
  );
}, (prev, next) =>
  prev.ticket.id === next.ticket.id &&
  prev.ticket.summary === next.ticket.summary &&
  prev.ticket.call_reason === next.ticket.call_reason &&
  prev.ticket.status === next.ticket.status
);

const TicketListUI = ({ tickets = [] }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <>
      <EmptyState
        variant="card"
        title="No tickets for this patient"
        description="Create or link a ticket to get started."
        icon={<AssignmentTurnedInOutlinedIcon />}
        // action={<Button variant="contained">Create ticket</Button>} --> Crear caso desde aqui
      />
      </>
    );
  }
  return (
    <Box sx={{ px: 2 }}>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </Box>
  );
};

export default TicketListUI;
