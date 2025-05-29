// ticketUtils.js
//import axios from 'axios';

//fetch table tickets
export const fetchTableData = async (dispatch, setLoading, agentAssigned) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGet?agent_assigned=${encodeURIComponent(agentAssigned)}`);
    const data = await response.json();
    
    dispatch({ type: 'SET_TICKETS', payload: data.message });
  } catch (err) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  } finally {
    setLoading(false);
  }
};

//fetch table agents
export const fetchAgentData = async (dispatch, setLoading) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetAgents`);
    const data = await response.json();

    dispatch({ type: 'SET_AGENTS', payload: data.message });
  } catch (err) {
    dispatch({ type: 'SET_A_ERROR', payload: err.message });
  } finally {
    setLoading(false);
  }
};

// assign agent to a ticket
export const assignAgent = async (dispatch, setLoading, ticketId, currentAgentEmail, targetAgentEmail) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/assignAgent`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        target_agent_email: targetAgentEmail,
      }),
    });
 
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el agente');
    }

    dispatch({type: 'ASSIGN_AGENT', payload: data.message})

  } catch (err) {
    dispatch({ type: 'SET_ASSIGNMENT_ERROR', payload: err.message });
  } finally {
    setLoading(false);
  }
};


//update agent_assigned
// assign agent to a ticket
export const changeStatus = async (dispatch, setLoading, ticketId, currentAgentEmail, newStatus) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateStatus`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
        agent_email: currentAgentEmail,
        newStatus: newStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el estado');
    }

    dispatch({ type: 'UPDATE_STATUS', payload: data.message });
  } catch (err) {
    dispatch({ type: 'SET_UPDATE_ERROR', payload: err.message });
  } finally {
    setLoading(false);
  }
};
