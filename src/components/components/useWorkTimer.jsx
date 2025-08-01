import { useEffect, useRef } from 'react';
import { updateWorkTime } from '../../utils/apiTickets';

export function useWorkTimer({ ticketData, agentEmail, status, enabled }) {
  const startTimeRef = useRef(null);
  const sentRef = useRef(false); // para evitar enviar varias veces

  useEffect(() => {
    const isAuthorized = () => {
      if (!ticketData || !agentEmail) return false;
      const assigned = ticketData.agent_assigned?.toLowerCase();
      const collaborators = (ticketData.collaborators || []).map(c => c.toLowerCase());
      return assigned === agentEmail.toLowerCase() || collaborators.includes(agentEmail.toLowerCase());
    };

    if (!enabled || !isAuthorized()) return;

    // Marcar inicio
    startTimeRef.current = Date.now();

    const sendWorkTime = async () => {
      if (sentRef.current) return;
      sentRef.current = true;

      const endTime = Date.now();
      const duration = endTime - startTimeRef.current;
      const workTime = Math.round(duration / 1000); // segundos

      if (workTime < 5) return;

      try {
        await updateWorkTime(null, null, ticketData.id, agentEmail, workTime, status);
      } catch (err) {
        console.error('❌ Error registrando tiempo:', err);
      }
    };

    const handleBeforeUnload = () => {
      // Importante: enviar de forma síncrona si es posible
      navigator.sendBeacon?.(
        `/api/tickets/${ticketData.id}/worktime`,
        JSON.stringify({ agentEmail, workTime: Math.round((Date.now() - startTimeRef.current) / 1000), status })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sendWorkTime();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketData?.id]); // ← Solo cambia si cambia de ticket
}
