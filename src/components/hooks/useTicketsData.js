// src/hooks/useTicketsData.js
import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useTickets } from '../../context/ticketsContext';
import { useLoading } from '../../providers/loadingProvider';
import { useNotification } from '../../context/notificationsContext';
import { fetchTableData } from '../../utils/apiTickets';

/**
 * Gestiona la descarga y refresh del listado de tickets,
 * actualiza el contexto global y expone estado derivado.
 */
export function useTicketsData({ auto = true } = {}) {
  const { state, dispatch } = useTickets();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const acRef = useRef(null);

  const refresh = useCallback(async () => {
    // Cancela request previo, si existe
    if (acRef.current) acRef.current.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchTableData({ signal: ac.signal });
      const list = Array.isArray(res?.message) ? res.message : [];
      dispatch({ type: 'SET_TICKETS', payload: list });
      setLastUpdatedAt(new Date());
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e);
        showNotification(e.message || 'Failed to load tickets', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, showNotification]);

  // Carga inicial automática (si auto=true)
  useEffect(() => {
    if (!auto) return;
    refresh();
    return () => {
      if (acRef.current) acRef.current.abort();
    };
  }, [auto, refresh]);

  // Selectores mínimos derivados del reducer (usando _ticketsVersion para invalidar memos)
  const tickets = useMemo(() => state.tickets || [], [state._ticketsVersion]);
  const ticketsVersion = useMemo(() => state._ticketsVersion || 0, [state._ticketsVersion]);

  return {
    tickets,
    ticketsVersion,
    refresh,
    error,
    lastUpdatedAt,
  };
}
