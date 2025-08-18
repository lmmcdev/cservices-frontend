import { useEffect, useRef } from 'react';
import { updateWorkTime } from '../../utils/apiTickets';

export function useWorkTimer({ ticketData, status, enabled }) {
  const startTimeRef = useRef(null);
  const sentRef = useRef(false); // para evitar enviar varias veces

  console.log("work timer")
  useEffect(() => {
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
        await updateWorkTime(ticketData.id, workTime, status);
      } catch (err) {
        console.error('❌ Error registrando tiempo:', err);
      }
    };

    const handleBeforeUnload = () => {
      // Importante: enviar de forma síncrona si es posible
      navigator.sendBeacon?.(
        `/api/tickets/${ticketData.id}/worktime`,
        JSON.stringify({ workTime: Math.round((Date.now() - startTimeRef.current) / 1000), status })
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
