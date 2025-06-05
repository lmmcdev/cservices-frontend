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

//phone calls history
export const phoneHistory = async (dispatch, setLoading, phoneNumber) => {
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetPhoneHistory?phone=${encodeURIComponent(phoneNumber)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching calls history');
    }
    
    dispatch({ type: 'SET_PHONE_CALLS_HISTORY', payload: data.message });
    return { success: true, message: data.items || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
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

    const updatedTicket = {
      id: ticketId,
      targetAgentEmail,
    };

    dispatch({type: 'ASSIGN_AGENT', payload: updatedTicket})
    
    return updatedTicket;
    
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

    const updatedTicket = {
      id: ticketId,
      status: newStatus,
    };

    dispatch({ type: 'UPDATE_STATUS', payload: updatedTicket });
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
export const updateCallbackNumber = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientPhone) => {
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
      throw new Error(data.message || 'Error updating callback number');
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


//update work time
export const updateWorkTime = async (dispatch, setLoading, ticketId, currentAgentEmail, time, currentStatus) => {
  setLoading(true);
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateWorkTime`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        workTime: time,
        currentStatus: currentStatus
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error registering work time');
    }

    dispatch({ type: 'UPDATE_WORK_TIME', payload: time });
    return { success: true, message: data.message || 'Updated work time successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
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
          remote_agent: formData.isRemote
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
      remote_agent: formData.isRemote
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
  setLoading(true);
  
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
          remote_agent: formData.remoteAgent
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