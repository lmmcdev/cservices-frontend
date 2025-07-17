import React, { useEffect, useState, useCallback } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';

export default function StatusTicketsCard({
  accessToken,
  status,
  date,
  getTicketsByStatus,
  onTicketsUpdate
}) {
  const [tickets, setTickets] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  const fetchTickets = useCallback(async () => {
    if (!accessToken || loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await getTicketsByStatus(accessToken, status, date, {
        params: { limit, continuationToken }
      });

      const { items = [], continuationToken: nextToken } = res.message || {};

      setTickets((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !ids.has(item.id));
        const updated = [...prev, ...newItems];

        if (onTicketsUpdate) onTicketsUpdate(updated);

        return updated;
      });

      setContinuationToken(nextToken || null);
      setHasMore(!!nextToken);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, status, date, continuationToken, hasMore, loading]);

  useEffect(() => {
    setTickets([]);
    setContinuationToken(null);
    setHasMore(true);
  }, [status, date]);

  useEffect(() => {
    if (tickets.length === 0) {
      fetchTickets();
    }
  }, [fetchTickets, tickets.length]);

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      {loading && tickets.length === 0 && (
        <CircularProgress size={24} sx={{ my: 2 }} />
      )}

      {!loading && hasMore && tickets.length > 0 && (
        <Button
          variant="outlined"
          onClick={fetchTickets}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Box>
  );
}
