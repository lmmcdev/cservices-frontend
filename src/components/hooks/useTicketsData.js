// src/hooks/useTicketsData.js
import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useTickets } from '../../context/ticketsContext';
import { useLoading } from '../../providers/loadingProvider';
import { useNotification } from '../../context/notificationsContext';
import { fetchTableData } from '../../utils/apiTickets';

/**
 * Carga inicial (una sola vez) y expone refresh() manual.
 * No re-consulta al backend cuando el store cambia por SignalR.
 */
export function useTicketsData({ auto = true } = {}) {
  const { state, dispatch } = useTickets();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const acRef = useRef(null);
  const fetchedOnceRef = useRef(false); // ⬅️ evita re-fetch por renders o por SignalR

  // Parser tolerante a distintos shapes de respuesta
  const parseList = (resJson) => {
    if (Array.isArray(resJson)) return resJson;
    if (Array.isArray(resJson?.message)) return resJson.message;
    if (Array.isArray(resJson?.data)) return resJson.data;
    if (Array.isArray(resJson?.data?.items)) return resJson.data.items;
    return [];
  };

  const doFetch = useCallback(async () => {
    // Cancela request previo, si existe
    try { acRef.current?.abort(); } catch {}
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchTableData({ signal: ac.signal });
      const list = parseList(res);
      dispatch({ type: 'SET_TICKETS', payload: list });
      setLastUpdatedAt(new Date());
    } catch (e) {
      if (e?.name !== 'AbortError') {
        setError(e);
        showNotification(e?.message || 'Failed to load tickets', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, showNotification]);

  // 🚀 Carga inicial UNA sola vez (no depende de cambios del store / SignalR)
  useEffect(() => {
    if (!auto) return;
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;
    doFetch();

    return () => {
      try { acRef.current?.abort(); } catch {}
    };
  }, [auto, doFetch]);

  // Refresh manual (no cambia la política de “solo una vez”)
  const refresh = useCallback(async () => {
    fetchedOnceRef.current = true;
    await doFetch();
  }, [doFetch]);

  // Selectores derivados del reducer (usando _ticketsVersion para memo)
  const ticketsVersion = state?._ticketsVersion || 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tickets = useMemo(() => state.tickets || [], [ticketsVersion]);

  return {
    tickets,
    ticketsVersion,
    refresh,
    error,
    lastUpdatedAt,
  };
}
