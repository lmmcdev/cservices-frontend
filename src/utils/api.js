// ticketUtils.js
//import axios from 'axios';

//fetch table tickets
export const fetchTableData = async (dispatch, setLoading, agentAssigned) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGet?agent_assigned=${encodeURIComponent(agentAssigned)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching tickets');
    }
    
    dispatch({ type: 'SET_TICKETS', payload: data.message });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//fetch table agents
export const fetchAgentData = async (dispatch, setLoading) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetAgents`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching agents data');
    }

    dispatch({ type: 'SET_AGENTS', payload: data.message });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
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
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
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
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


// add agent note to ticket
export const addNotes = async (dispatch, setLoading, ticketId, currentAgentEmail, note) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateNotes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
        agent_email: currentAgentEmail,
        notes: note,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error updating notes');
    }

    dispatch({ type: 'UPDATE_NOTE', payload: data.message });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update collaborators
export const updateCollaborators = async (dispatch, setLoading, ticketId, currentAgentEmail, collaborators) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateCollaborators`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId,
        agent_email: currentAgentEmail,
        collaborators,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error updating collaborators');
    }

    dispatch({ type: 'UPDATE_COLLABORATORS', payload: collaborators });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update department on ticket
export const updateTicketDepartment = async (dispatch, setLoading, ticketId, currentAgentEmail, newDepartment) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateTicketDepartment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
        agent_email: currentAgentEmail,
        new_department: newDepartment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error updating department');
    }

    dispatch({ type: 'UPDATE_TICKET_DEPARTMENT', payload: newDepartment });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//update patient name
export const updatePatientName = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientName) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdatePatientName`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        nuevo_nombreapellido: newPatientName,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error updating patient name');
    }

    dispatch({ type: 'UPDATE_PATIENT_NAME', payload: newPatientName });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update patient dob
export const updatePatientDOB = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientBOD) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdatePatientBOD`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        nueva_fechanacimiento: newPatientBOD,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error updating patient bod');
    }

    dispatch({ type: 'UPDATE_PATIENT_BOD', payload: newPatientBOD });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update patient phone
export const updatePatientPhone = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientPhone) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdatePatientPhone`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        new_phone: newPatientPhone,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error updating patient phone');
    }

    dispatch({ type: 'UPDATE_PATIENT_PHONE', payload: newPatientPhone });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_PATIENT_NAME_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//create new case
export const createNewTicket = async (dispatch, setLoading, formData) => {
  //console
  setLoading(true);
  try {
    const response = await fetch('https://cservicesapi.azurewebsites.net/api/cosmoInsertForm', {
    //const response = await fetch('http://localhost:7072/api/cosmoInsertForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form: {
          patient_name: formData.patientName,
          patient_dob: formData.patientDOB,
          phone: formData.phone,
          summary: formData.summary,
          status: formData.status, // backend lo completa como "new"
          caller_id: formData.callDepartment,
          call_reason: formData.callReason,
          agent_note: formData.notes,
          assigned_department: formData.callDepartment,
          agent_email: formData.agent_email
        }
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error creating ticket');
    }

    dispatch({ type: 'TICKET_CREATED', payload: data });
    return { success: true, message: data.message || 'Ticket created successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_TICKET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};
