import React, { useEffect } from 'react';

export default function IdsTicketsCard({ onOpenDrawer, accessToken, ids, getTicketsByIds, status = "ALL" }) {
  useEffect(() => {
    if (!accessToken || !ids || ids.length === 0) return;

    const fetchTickets = async () => {
      try {
        const res = await getTicketsByIds(accessToken, ids);
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
  }, [ids]); 
  return (
    <></>
  );
}
