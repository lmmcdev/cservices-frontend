/*import { useState, useCallback } from 'react';
import { getTicketsByStatus } from '../../utils/apiStats';

export const useFetchTicketsByStatus = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async (status, date, accessToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTicketsByStatus(accessToken, status, date);
      setTickets(response.message);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Error fetching tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tickets, loading, error, fetchTickets };
};*/
