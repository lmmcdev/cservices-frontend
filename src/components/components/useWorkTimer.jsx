import { useEffect, useRef, useReducer } from 'react';
import { ticketReducer, initialState } from '../../store/ticketsReducer';
import { useLoading } from '../../providers/loadingProvider';
import { updateWorkTime } from '../../utils/apiTickets';

export function useWorkTimer({ ticketData, agentEmail, status, enabled }) {

    const startTimeRef = useRef(null);
    const [, dispatch] = useReducer(ticketReducer, initialState);
    const { setLoading } = useLoading();

    
  useEffect(() => {
    const isAuthorized = () => {
        if (!ticketData || !agentEmail) return false;
        const assigned = ticketData.agent_assigned?.toLowerCase();
        const collaborators = (ticketData.collaborators || []).map(c => c.toLowerCase());
        return assigned === agentEmail.toLowerCase() || collaborators.includes(agentEmail.toLowerCase());
    };

   
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


    if (!enabled || !isAuthorized()) return;

    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => sendWorkTime();

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      sendWorkTime();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, ticketData, agentEmail, status, setLoading, dispatch]);
}
