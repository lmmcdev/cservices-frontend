// hooks/useTicketActionRunner.js
import { useCallback } from 'react';
import { useTickets } from '../../context/ticketsContext';
import { useLoading } from '../../providers/loadingProvider';
import { useNotification } from '../../context/notificationsContext';
import { runTicketAction } from '../../utils/tickets/ticketActionHelper';

export function useTicketActionRunner() {
  const { dispatch } = useTickets();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  // Si ya tienes snackbar global, puedes mapearlo a estos setters:
  const setSuccessMessage = (msg) => showNotification(msg, 'success');
  const setSuccessOpen = () => {}; // no hace falta con showNotification
  const setErrorMessage = (msg) => showNotification(msg, 'error');
  const setErrorOpen = () => {};

  return useCallback(
    (cfg) =>
      runTicketAction({
        dispatch,
        setLoading,
        setSuccessMessage,
        setSuccessOpen,
        setErrorMessage,
        setErrorOpen,
        ...cfg,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, setLoading, showNotification, setErrorMessage, setSuccessMessage]
  );
}
