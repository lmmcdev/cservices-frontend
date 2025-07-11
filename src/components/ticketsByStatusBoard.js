import React, { useEffect } from 'react';

export default function StatusTicketsCard({ onOpenDrawer, accessToken, status, getTicketsByStatus, date }) {
  useEffect(() => {
    if (!accessToken || !status) return;
    // Función async para obtener tickets
    const fetchTickets = async () => {
      try {
        const res = await getTicketsByStatus(accessToken, status, date);
        if (res.success) {
          onOpenDrawer({
            status,
            tickets: res.message || []
          });
        } else {
          console.error('Error fetching tickets:', res.message);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
    // eslint-disable-next-line
  }, [status]); 
  return (
    <></>
  );
}
