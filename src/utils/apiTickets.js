// ticketUtils.js
import { ENDPOINT_URLS } from "./js/constants";

export const fetchTableData = async (agentAssigned) => {

    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoGet`);
    if(response.status === 204) return { success: true, message: [] }; // No content
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error fetching tickets');
    return data;
  
};

//phone calls history
export const phoneHistory = async (dispatch, setLoading, phoneNumber) => {
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoGetPhoneHistory?phone=${encodeURIComponent(phoneNumber)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching calls history');
    }
    
    return { success: true, message: data.items || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


// assign agent to a ticket
//a partir de aqui los dispatch se manejan en el evento signalr
export const assignAgent = async (dispatch, setLoading, ticketId, currentAgentEmail, targetAgentEmail) => {
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/assignAgent`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        //agent_email: currentAgentEmail,
        target_agent_email: currentAgentEmail,
      }),
    });
 
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el agente');
    }
 
    return { success: true, message: data.message || 'Updated successfully' };
    
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//update agent_assigned
// assign agent to a ticket
export const changeStatus = async (dispatch, setLoading, ticketId, currentAgentEmail, newStatus) => {
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateStatus`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
        newStatus: newStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el estado');
    }

    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    //console.log('Error details:', err);
    return { success: false, message, details: err.details || null };
  } finally {
    setLoading(false);
  }
};


// add agent note to ticket
export const addNotes = async (dispatch, setLoading, ticketId, currentAgentEmail, note) => {
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateNotes`, {
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

    return { success: true, message: 'Updated successfully', ticket: data || null };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update collaborators
export const updateCollaborators = async (dispatch, setLoading, ticketId, currentAgentEmail, collaborators) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateCollaborators`, {
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
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update department on ticket
export const updateTicketDepartment = async (dispatch, setLoading, ticketId, currentAgentEmail, newDepartment) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateTicketDepartment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        agent_email: currentAgentEmail,
        newDepartment: newDepartment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error updating department');
    }

    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//transfer center
export const updateCenter = async (dispatch, setLoading, formData, center) => {
  setLoading(true);
  try {
    const response = await fetch(`https://prod-69.eastus.logic.azure.com:443/workflows/f358af2ae24b4e2e8957c471c02e7e7c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=Ztx0ECBzmsTG6JxtrVDQX-WhrqyBQge74GDN59ng4g8`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "Phone Number": formData.phone,
        "Caller ID": center,
        "First and last name": formData.patient_name,
        "Reason for Calling": formData.call_reason,
        "Date of Birth": formData.patient_dob,
        "Summary": formData.summary,
        "Audio Link": formData?.url_audio || '',
        "Family Member Name": formData?.caller_name || '',
        "Callback Number": formData?.callback_number || ''
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error updating department');
    }
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};



//update patient name
export const updatePatientName = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientName) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdatePatientName`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        nuevo_nombreapellido: newPatientName,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error updating patient name');
    }

    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update patient dob
export const updatePatientDOB = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientBOD) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdatePatientBOD`, {
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

    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

//update patient phone
export const updateCallbackNumber = async (dispatch, setLoading, ticketId, currentAgentEmail, newPatientPhone) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdatePatientPhone`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickets: ticketId,
        new_phone: newPatientPhone,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error updating callback number');
    }

    //dispatch({ type: 'UPDATE_PATIENT_PHONE', payload: newPatientPhone });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//update work time
export const updateWorkTime = async (dispatch, setLoading, ticketId, currentAgentEmail, time, currentStatus) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoUpdateWorkTime`, {
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

    //dispatch({ type: 'UPDATE_WORK_TIME', payload: time });
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
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoInsertForm`, {
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
          agent_email: formData.agent_email,
          agent_assigned: formData.agent_email
        }
      }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Error creating ticket');
    }

    //dispatch({ type: 'TICKET_CREATED', payload: data });
    return { success: true, message: data.message || 'Ticket created successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_TICKET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


//relate ticket
export const relateTicketsByPhone = async (dispatch, setLoading, ticket_id, agent_email = null, action = 'relatePast', phone = null, patient_id = null) => {
  setLoading(true);
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/updateTicketsByPhone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        ticket_id,
        phone,
        patient_id,
        agent_email
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error linking tickets');
    }

   return {
      success: true,
      message: data.message || `Action ${action} completed successfully.`,
      updated_ticket_ids: data.updated_ticket_ids || [],
      updated_ticket: data.updatedTicket || null
    };

  } catch (err) {
    const message = err.message || 'Something went wrong';
    dispatch({ type: 'SET_TICKET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};


export const searchTickets = async ({ query, page, size, filter }, accessToken) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    let url = `${ENDPOINT_URLS.API}/searchTickets`;
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`, si usas autenticación
        },
        body: JSON.stringify({
      query,
      page,
      size,
      ...(filter ? { filter } : {})
    }),
        });
        const data = await response.json();

        if (data.error !== undefined && data.error !== null) {
            return { success: false, message: data.error || 'Error fetching tickets' }; 
        }
        // Devuelve solo los datos
        return { success: true, message: data || 'Updated successfully' };
    } catch (err) {
        const message = err.message || 'Something went wrong';
        return { success: false, message };
    }
};
