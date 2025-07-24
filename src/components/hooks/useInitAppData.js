// useInitAppData.js
import { useEffect } from 'react';
import { useTickets } from "../../context/ticketsContext";
import { useAgents } from "../../context/agentsContext";
import { useAuth } from "../../context/authContext";
import { useLoading } from "../../providers/loadingProvider";
import { fetchTableData } from "../../utils/apiTickets";
import { fetchAgentData } from '../../utils/apiAgents';
import { useNavigate } from 'react-router-dom';

export const useInitAppData = () => {
  const { user } = useAuth();
  const { dispatch: ticketDispatch } = useTickets();
  const { dispatch: agentDispatch } = useAgents();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const agents = await fetchAgentData(user?.username);
        const tickets = await fetchTableData(user?.username);
        console.log(agents.message)
        agentDispatch({ type: 'SET_AGENTS', payload: agents.message.agents });
        ticketDispatch({ type: 'SET_TICKETS', payload: tickets.message });
      } 
      catch(err) {
        navigate('/404');
      }
      finally {
        setLoading(false);
      }
    };
    if (user?.username) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);
};
