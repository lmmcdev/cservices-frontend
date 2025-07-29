import { useState, useCallback } from 'react';

/**
 * Hook reutilizable para paginación de tickets con soporte para parámetros dinámicos
 * @param {Function} fetchFn - función para llamar a la API (ej: getTicketsByStatus o getTicketsByIds)
 * @param {Object} baseParams - parámetros iniciales (status, date, ids, etc.)
 */
export default function usePaginatedTickets(fetchFn, baseParams = {}) {
  const [tickets, setTickets] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // ✅ Construcción del payload para la API
      const res = await fetchFn({
        ...baseParams,
        continuationToken,
        limit: 10,
      });

      const { items = [], continuationToken: nextToken } = res.message || {};

      setTickets(prev => {
        const ids = new Set(prev.map(t => t.id));
        const newItems = items.filter(item => !ids.has(item.id));
        return [...prev, ...newItems];
      });

      setContinuationToken(nextToken || null);
      setHasMore(!!nextToken);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, baseParams, continuationToken, hasMore, loading]);

  const reset = useCallback(() => {
    setTickets([]);
    setContinuationToken(null);
    setHasMore(true);
  }, []);

  return { tickets, loading, hasMore, fetchTickets, reset };
}
