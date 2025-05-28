// ticketUtils.js
//import axios from 'axios';

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


export const fetchAgentData = async (dispatch, setLoading) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetAgents`);
    const data = await response.json();
    console.log(data.message)
    dispatch({ type: 'SET_AGENTS', payload: data.message });
  } catch (err) {
    dispatch({ type: 'SET_A_ERROR', payload: err.message });
  } finally {
    setLoading(false);
  }
};
