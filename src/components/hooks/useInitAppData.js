// useInitAppData.js
import { useEffect } from 'react';
import { useTickets } from "../../context/ticketsContext";
import { useAgents } from "../../context/agentsContext";
import { useAuth } from "../../context/authContext";
import { useLoading } from "../../providers/loadingProvider";
import { fetchAgentData, fetchTableData } from "../../utils/api";

export const useInitAppData = () => {
  const { user } = useAuth();
  const { dispatch: ticketDispatch } = useTickets();
  const { dispatch: agentDispatch } = useAgents();
  const { setLoading } = useLoading();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const agents = await fetchAgentData(agentDispatch, setLoading);
        const tickets = await fetchTableData(ticketDispatch, setLoading, user?.username);
        agentDispatch({ type: 'SET_AGENTS', payload: agents.message });
        ticketDispatch({ type: 'SET_TICKETS', payload: tickets.message });
      } finally {
        setLoading(false);
      }
    };
    if (user?.username) load();
  }, [user?.username]);
};
