// hooks/useTicketActionRunner.js
import { useCallback } from 'react';
import { useTickets } from '../../context/ticketsContext';
import { useLoading } from '../../providers/loadingProvider';
import { useNotification } from '../../context/notificationsContext';

/**
 * Runner unificado para acciones de tickets.
 * - setLoading(true/false)
 * - notifica éxito/error
 * - si se provee getUpdatedTicket(res) y devuelve { id, ... },
 *   despacha automáticamente { type: 'UPD_TICKET', payload: updated }
 *
 * Uso:
 * const run = useTicketActionRunner();
 * await run({
 *   fn: apiFn,
 *   args: [/* ... *-/],
 *   getUpdatedTicket: (res) => res?.data?.ticket || ({ id, ...patch }),
 *   successMessage: 'Guardado',
 *   errorMessage: 'No se pudo guardar',
 *   onSuccess: (res) => {}, // opcional
 *   onError: (e) => {},     // opcional
 * });
 */
export function useTicketActionRunner() {
  const { dispatch } = useTickets();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(async ({
    fn,
    args = [],
    getUpdatedTicket,         // (res) => ticket|patch con { id }
    onSuccess,
    onError,
    successMessage = 'Saved',
    errorMessage = 'Operation failed',
  }) => {
    setLoading(true);
    try {
      const res = await fn(...args);

      // 🔁 Merge global si el caller nos dice qué actualizar
      if (typeof getUpdatedTicket === 'function') {
        let updated = null;
        try { updated = getUpdatedTicket(res); } catch { /* noop */ }
        if (updated && updated.id) {
          dispatch({ type: 'UPD_TICKET', payload: updated });
        }
      }

      onSuccess?.(res);
      if (successMessage) showNotification(successMessage, 'success');
      return res;
    } catch (e) {
      onError?.(e);
      if (errorMessage) showNotification(e?.message || errorMessage, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, showNotification]);
}
