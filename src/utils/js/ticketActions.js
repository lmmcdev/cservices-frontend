//document this file
import {
  changeStatus,
  addNotes,
  updateCollaborators,
  updateTicketDepartment,
  updatePatientName,
  updatePatientDOB,
  updateCallbackNumber,
  assignAgent,
  updateCenter,
  relateTicketsByPhone
} from '../apiTickets';

import { runTicketAction, pickUpdatedTicket } from '../../utils/tickets/ticketActionHelper';

// --- Ejemplos de refactor ---

export async function handleStatusChange({
  dispatch, setLoading, ticketId, newStatus,
  setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  return runTicketAction({
    fn: changeStatus,
    args: [ticketId, newStatus],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    // si tu endpoint devuelve el ticket, haz UPD_TICKET:
    dispatch,
    getUpdatedTicket: (res) =>
      pickUpdatedTicket(res) || { id: ticketId, status: newStatus },
    onSuccess: () => { setStatus?.(newStatus); }
  });
}

export async function handleAddNoteHandler({
  dispatch, setLoading, ticketId, agentEmail, noteContent,
  setNoteContent, setOpenNoteDialog, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen
}) {
  if (!noteContent?.trim()) return;

  const newNote = [{
    agent_email: agentEmail,
    event_type: 'user_note',
    event: noteContent.trim(),
    datetime: new Date().toISOString()
  }];

  return runTicketAction({
    fn: addNotes,
    // ojo: mantengo tu firma original (si addNotes recibe dispatch y setLoading ya no haría falta)
    args: [dispatch, setLoading, ticketId, agentEmail, newNote],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket,
    onSuccess: () => {
      setNoteContent?.('');
      setOpenNoteDialog?.(false);
    }
  });
}

// AÑADIR colaboradores
export async function updateCollaboratorsHandler({
  dispatch, setLoading, ticketId, agentEmail,
  collaborators, selectedAgents,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
}) {
  const base = Array.isArray(collaborators) ? collaborators : [];
  // dedupe por si vienen repetidos
  const updated = [...new Set([...base, ...selectedAgents.filter(a => !base.includes(a))])];

  const result = await runTicketAction({
    fn: updateCollaborators,
    args: [ticketId, agentEmail, updated],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    // para el store: si el backend no trae ticket, usamos fallback con id
    getUpdatedTicket: (res) => pickUpdatedTicket(res) || { id: ticketId, collaborators: updated },
  });

  // Recojo el ticket y devuelvo solo lo necesario para el componente
  const t = pickUpdatedTicket(result);
  return Array.isArray(t?.collaborators) ? t.collaborators : updated;
}

// REMOVER colaborador (mismo patrón)
export async function handleRemoveCollaboratorHandler({
  dispatch, setLoading, ticketId, agentEmail,
  collaborators, emailToRemove,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
}) {
  const base = Array.isArray(collaborators) ? collaborators : [];
  const updated = base.filter(c => c !== emailToRemove);

  const result = await runTicketAction({
    fn: updateCollaborators,
    args: [ticketId, agentEmail, updated],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: (res) => pickUpdatedTicket(res) || { id: ticketId, collaborators: updated },
  });

  //recojo el ticket y devuelvo solo lo necesario para el componente
  const t = pickUpdatedTicket(result);
  return Array.isArray(t?.collaborators) ? t.collaborators : updated;
}


export async function handleChangeDepartmentHandler({
  dispatch, setLoading, ticketId, agentEmail, newDept,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  if (!newDept) return;
  return runTicketAction({
    fn: updateTicketDepartment,
    args: [dispatch, setLoading, ticketId, agentEmail, newDept],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket
  });
}

export async function handleCenterHandler({
  dispatch, setLoading, ticketId, ticket, agentEmail, selectedCenter,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  if (!selectedCenter) return;

  // Primera mutación: reasignar departamento (si eso es lo que hace updateTicketDepartment)
  const res1 = await runTicketAction({
    fn: updateTicketDepartment,
    args: [dispatch, setLoading, ticketId, agentEmail, selectedCenter],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket
  });
  if (!res1?.success) return res1;

  // Segunda mutación: updateCenter
  return runTicketAction({
    fn: updateCenter,
    args: [dispatch, setLoading, ticket, selectedCenter],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket
  });
}

export async function updatePatientNameHandler({
  dispatch, setLoading, ticketId, agentEmail, newName,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  return runTicketAction({
    fn: updatePatientName,
    args: [dispatch, setLoading, ticketId, agentEmail, newName],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket
  });
}

export async function updatePatientDobHandler({
  dispatch, setLoading, ticketId, agentEmail, newDob,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen, setPatientDob
}) {
  if (!newDob) {
    setErrorMessage?.('La fecha de nacimiento está vacía.');
    setErrorOpen?.(true);
    return;
  }
  // Normalización YYYY-MM-DD -> MM/DD/YYYY
  const [year, month, day] = newDob.split('-');
  const mmddyyyy = `${month}/${day}/${year}`;

  return runTicketAction({
    fn: updatePatientDOB,
    args: [dispatch, setLoading, ticketId, agentEmail, mmddyyyy],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: (res) =>
      pickUpdatedTicket(res) || { id: ticketId, patient_dob: mmddyyyy },
    onSuccess: () => setPatientDob?.(mmddyyyy),
    errorMessage: 'Error al procesar la fecha'
  });
}

export async function updateCallbackNumberHandler({
  dispatch, setLoading, ticketId, agentEmail, newPhone,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  return runTicketAction({
    fn: updateCallbackNumber,
    args: [dispatch, setLoading, ticketId, agentEmail, newPhone],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: pickUpdatedTicket
  });
}


export async function updateAssigneeHandler({
  dispatch, setLoading, ticketId, agentEmail, selectedAgent,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) {
  return runTicketAction({
    fn: assignAgent,
    args: [ticketId, selectedAgent],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: (res) =>
      pickUpdatedTicket(res) || { id: ticketId, agent_assigned: selectedAgent }
  });
}

export const relateTicketHandler = async ({
  dispatch, setLoading, ticketId, agentEmail, action, ticketPhone, patientId,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen
}) => {
  return runTicketAction({
    fn: relateTicketsByPhone,
    args: [dispatch, setLoading, ticketId, agentEmail, action, ticketPhone, patientId,
           setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen],
    setLoading, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen,
    dispatch,
    getUpdatedTicket: (res) => {
      // Tu endpoint devolvía updated_ticket
      const u = res?.updated_ticket || pickUpdatedTicket(res);
      return u
        ? { id: u.id, linked_patient_snapshot: u.linked_patient_snapshot ?? null, patient_id: u.patient_id ?? null }
        : null;
    }
  });
};
