// src/components/hooks/useInitAppData.js
import { useEffect, useRef } from 'react';
import { useAgents } from '../../context/agentsContext';
import { useAuth } from '../../context/authContext';
import { useLoading } from '../../providers/loadingProvider';
import { fetchAgentsFromAAD } from '../../services/fetchAgentData';
import { DEFAULT_AGENT_GROUPS } from '../../utils/js/constants';

export const useInitAppData = () => {
  const { authLoaded, accessTokenGraph } = useAuth();
  const { dispatch: agentDispatch } = useAgents();
  const { setLoading } = useLoading();

  // 🧠 CERROJO: asegura que solo cargamos una vez por sesión
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!authLoaded || !accessTokenGraph) return;
    if (loadedRef.current) return;
    loadedRef.current = true;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const agents = await fetchAgentsFromAAD(accessTokenGraph, {
          groupIds: DEFAULT_AGENT_GROUPS,
        });

        if (!cancelled) {
          // Publica en tu contexto de agentes.
          // Nota: cada agente trae { id, name, email, agent_name, agent_email, source }
          agentDispatch({ type: 'SET_AGENTS', payload: agents });
        }
      } catch (err) {
        console.error('Agents error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [authLoaded, accessTokenGraph, agentDispatch, setLoading]);
};
