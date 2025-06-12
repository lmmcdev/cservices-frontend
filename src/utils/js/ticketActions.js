// utils/ticketActions.js
import {
  changeStatus,
  addNotes,
  updateCollaborators,
  updateTicketDepartment,
  updatePatientName,
  updatePatientDOB,
  updateCallbackNumber,
  assignAgent,
  updateCenter
} from '../api';

export async function handleStatusChange({ dispatch, setLoading, ticketId, agentEmail, newStatus, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen }) {
  setLoading(true);
  const result = await changeStatus(dispatch, setLoading, ticketId, agentEmail, newStatus);
  if (result.success) {
    setSuccessMessage(result.message);
    setStatus(newStatus);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}

export async function handleAddNoteHandler({ dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen }) {
  if (!noteContent.trim()) return;
  const newNote = [{
    agent_email: agentEmail,
    event_type: 'user_note',
    content: noteContent.trim(),
    datetime: new Date().toISOString()
  }];
  const result = await addNotes(dispatch, setLoading, ticketId, agentEmail, newNote);
  if (result.success) {
    //setNotes((prev) => [...prev, ...newNote]);
    setNoteContent('');
    setOpenNoteDialog(false);
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}

export async function handleRemoveCollaboratorHandler({ dispatch, setLoading, ticketId, agentEmail, collaborators, emailToRemove, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
  const updated = collaborators.filter(c => c !== emailToRemove);
  const result = await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function handleChangeDepartmentHandler({ dispatch, setLoading, ticketId, agentEmail, newDept, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
  if (!newDept) return;
  const result = await updateTicketDepartment(dispatch, setLoading, ticketId, agentEmail, newDept);
  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function handleCenterHandler({ dispatch, setLoading, ticketId, ticket, agentEmail, selectedCenter, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
  if (!selectedCenter) return;
  const result = await updateTicketDepartment(dispatch, setLoading, ticketId, agentEmail, selectedCenter);
  if (result.success) {
    const updCenter = await updateCenter(dispatch, setLoading, ticket, selectedCenter);
    if (updCenter.success) {
              setSuccessMessage(updCenter.message);
              setSuccessOpen(true);
            } else {
              setErrorMessage(updCenter.message);
              setErrorOpen(true);
            }
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function updatePatientNameHandler({ dispatch, setLoading, ticketId, agentEmail, newName, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
  const result = await updatePatientName(dispatch, setLoading, ticketId, agentEmail, newName);
  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function updatePatientDobHandler({ dispatch, setLoading, ticketId, agentEmail, newDob, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField, setPatientDob }) {
  if (!newDob) {
    setErrorMessage("La fecha de nacimiento está vacía.");
    setErrorOpen(true);
    return;
  }
  try {
    const [year, month, day] = newDob.split('-');
    const mmddyyyy = `${month}/${day}/${year}`;
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(mmddyyyy)) throw new Error("Formato de fecha inválido");

    const result = await updatePatientDOB(dispatch, setLoading, ticketId, agentEmail, mmddyyyy);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
      setPatientDob(mmddyyyy);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
  } catch (err) {
    setErrorMessage("Error al procesar la fecha: " + err.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function updateCallbackNumberHandler({ dispatch, setLoading, ticketId, agentEmail, newPhone, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
  const result = await updateCallbackNumber(dispatch, setLoading, ticketId, agentEmail, newPhone);
  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
  //setEditField(null);
}

export async function updateCollaboratorsHandler({ dispatch, setLoading, ticketId, agentEmail, collaborators, selectedAgents, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
    const updated = [...collaborators, ...selectedAgents.filter(a => !collaborators.includes(a))];
    const result = await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
    if (result.success) {
        setSuccessMessage(result.message);
        setSuccessOpen(true);
    } else {
        setErrorMessage(result.message);
        setErrorOpen(true);
    }
  //setEditField(null);
}

export async function updateAssigneeHandler({ dispatch, setLoading, ticketId, agentEmail, selectedAgent, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setEditField }) {
    const result = await assignAgent(dispatch, setLoading, ticketId, selectedAgent, agentEmail);
    if (result.success) {
        setSuccessMessage(result.message);
        setSuccessOpen(true);
    } else {
        setErrorMessage(result.message);
        setErrorOpen(true);
    }
  //setEditField(null);
}