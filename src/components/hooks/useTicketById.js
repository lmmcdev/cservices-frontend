// hooks/useTicketById.js
import { useMemo } from 'react';
import { useTickets } from '../../context/ticketsContext';

export function useTicketById(ticketId) {
  const { state: ticketsAll } = useTickets();
  const { tickets } = ticketsAll;

  // Memoiza la búsqueda: solo recalcula cuando tickets cambia de longitud
  const ticket = useMemo(
    () => tickets.find(t => t.id === ticketId),
    // eslint-disable-next-line
    [tickets.length, ticketId]
  );

  return ticket;
}
