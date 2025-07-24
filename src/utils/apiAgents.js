
//fetch table agents
export const fetchAgentData = async (agentAssigned) => {
  {/** Fetch the list of agents from the API
    we need to add filters so we can search through them
    never get all agents, only agents in context */}
  const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetAgents?agentAssigned=${encodeURIComponent(agentAssigned)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error fetching agents data');
  }
  return data;
};


//edit agent
export const editAgent = async (dispatch, setLoading, formData) => {
  //console
  setLoading(true);
  
  try {
    const response = await fetch('https://cservicesapi.azurewebsites.net/api/cosmoUpdateAgent', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          agentId: formData.agent_id,
          editor_email: formData.supEmail,
          agent_email: formData.email,
          agent_name: formData.displayName,
          agent_rol: formData.role,
          agent_department: formData.department,
          agent_location: formData.location,
          remote_agent: formData.isRemote,
          disabled_agent: formData.isDisable
      }),
    });


    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error editing');
    }

    const updated_agent = {
      id: formData.agent_id,
      agent_email: formData.email,
      agent_name: formData.displayName,
      agent_rol: formData.role,
      agent_department: formData.department,
      agent_location: formData.location,
      remote_agent: formData.isRemote,
      disabled_agent: formData.isDisable,
    }

    dispatch({ type: 'AGENT_EDITED', payload: updated_agent });
    return { success: true, message: data.message || 'Agent edited successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//create agent
export const createAgent = async (dispatch, setLoading, formData) => {
  //console
  //setLoading(true);
  
  try {
    const response = await fetch('https://cservicesapi.azurewebsites.net/api/cosmoInsertAgent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          editor_email: formData.supEmail,
          agent_email: formData.agentEmail,
          agent_name: formData.agentName,
          rol: formData.agentRol,
          department: formData.agentDepartment,
          agent_location: formData.location,
          remote_agent: formData.remoteAgent,
          agent_extension: formData.agentExtension
      }),
    });


    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error creating agent');
    }

    dispatch({ type: 'AGENT_CREATED', payload: data });
    return { success: true, message: data.message || 'Agent created successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};