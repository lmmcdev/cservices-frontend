// src/hooks/useTicketWorkTimer.js
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
import { updateWorkTime } from '../../utils/apiTickets';

// normaliza a snake_case para el backend (p.ej. "In Progress" -> "in_progress")
const normStatus = (s) => (s || '').toLowerCase().replace(/\s+/g, '_');

export function useTicketWorkTimer({
  ticketId,
  statusProvider,           // () => string | obtiene el status actual cuando se envía
  sendIntervalMs = 0,       // opcional: envíos parciales cada X ms (0 = solo al salir)
  includeAgentEmail = true, // si tu endpoint lo necesita, se adjunta agent_email
}) {
  const { user } = useAuth();

  const startRef = useRef(null);   // ts del último "resume"
  const accMsRef = useRef(0);      // tiempo acumulado en ms
  const activeRef = useRef(false); // ¿está corriendo el timer ahora?
  const intervalRef = useRef(null);
  const flushedOnceRef = useRef(false); // evita doble flush en unmount

  const now = () => Date.now();

  const pause = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    if (startRef.current != null) {
      accMsRef.current += now() - startRef.current;
      startRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    startRef.current = now();
  }, []);

  const getElapsedSeconds = useCallback(() => {
    let total = accMsRef.current;
    if (activeRef.current && startRef.current != null) {
      total += now() - startRef.current;
    }
    return Math.max(0, Math.round(total / 1000));
  }, []);

  const flushNow = useCallback(async (reason = 'unmount') => {
    // pausa para consolidar el tiempo antes de tomar la foto
    pause();
    // si ya flusheaste en este ciclo de vida, evita duplicar (en unmount/visibilidad/etc.)
    if (reason !== 'interval' && flushedOnceRef.current) return;

    const workTime = getElapsedSeconds();
    if (workTime <= 0) return;

    const payload = {
      tickets: ticketId,
      workTime,
      currentStatus: statusProvider?.() || 'In Progress',
    };

    // adjunta correo si tu backend lo requiere
    /*if (includeAgentEmail && user?.username) {
      payload.agent_email = user.username;
    }*/

    try {
      await updateWorkTime(ticketId, workTime, statusProvider?.() || 'In Progress')
      /*await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateWorkTime`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // permite que el fetch se complete aunque la pestaña se esté cerrando
        keepalive: true,
      });*/
      // si el flush fue por unmount / pagehide, marcamos como enviado
      if (reason !== 'interval') {
        flushedOnceRef.current = true;
      }
      // si usas interval, resetea el acumulado para la siguiente ventana
      if (reason === 'interval') {
        accMsRef.current = 0;
        startRef.current = now();
        activeRef.current = true;
      }
    } catch (e) {
      // no bloquees la navegación por errores de red
      // (si quieres, aquí puedes guardar en localStorage para reintentar)
      // console.error('work timer flush error:', e);
    }
  }, [ticketId, statusProvider, user?.username, pause, getElapsedSeconds]);

  useEffect(() => {
    // arranca el cronómetro
    startRef.current = now();
    activeRef.current = true;
    flushedOnceRef.current = false;

    // pausa/resume cuando cambia visibilidad o foco
    const onVis = () => (document.hidden ? pause() : resume());
    const onBlur = pause;
    const onFocus = resume;

    // flush al abandonar la página
    const onLeave = () => flushNow('pagehide');

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pagehide', onLeave);
    window.addEventListener('beforeunload', onLeave);

    // envíos parciales (opcional)
    if (sendIntervalMs > 0) {
      intervalRef.current = setInterval(() => flushNow('interval'), sendIntervalMs);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pagehide', onLeave);
      window.removeEventListener('beforeunload', onLeave);
      flushNow('unmount');
    };
  }, [flushNow, pause, resume, sendIntervalMs]);

  return {
    flushNow,            // por si quieres mandar manualmente (ej: al pulsar “Guardar”)
    getElapsedSeconds,   // por si quieres mostrarlo en pantalla
    pause,
    resume,
  };
}
