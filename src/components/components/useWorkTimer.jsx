import { useEffect, useRef, useReducer, useState } from 'react';
import { ticketReducer, initialState } from '../../utils/ticketsReducer';
import { useLoading } from '../loadingProvider';
import { updateWorkTime } from '../../utils/api'; // Este es tu helper correcto

export function useWorkTimer({ ticketData, agentEmail, status, enabled }) {

    const startTimeRef = useRef(null);
    const [, dispatch] = useReducer(ticketReducer, initialState);
    const [setErrorOpen] = useState(false);
    const [setSuccessOpen] = useState(false);
    const [setSuccessMessage] = useState('');

    const [setErrorMessage] = useState('');

    const { setLoading } = useLoading();

    const isAuthorized = () => {
        if (!ticketData || !agentEmail) return false;
        const assigned = ticketData.agent_assigned?.toLowerCase();
        const collaborators = (ticketData.collaborators || []).map(c => c.toLowerCase());
        return assigned === agentEmail.toLowerCase() || collaborators.includes(agentEmail.toLowerCase());
    };

    console.log(ticketData.status, status)
   
  const sendWorkTime = async () => {
    const endTime = Date.now();
    const duration = endTime - startTimeRef.current;
    const workTime = Math.round(duration / 1000); // segundos

    if (workTime < 5) return; // evitar registros mínimos

    try {
      await updateWorkTime(dispatch, setLoading, ticketData.id, agentEmail, workTime, status);
    } catch (err) {
        console.error('❌ Error registrando tiempo:', err);
    }
  };

  useEffect(() => {
    if (!enabled || !isAuthorized()) return;

    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => sendWorkTime();

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      sendWorkTime();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, ticketData, agentEmail]);
}
