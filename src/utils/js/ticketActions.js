// src/utils/tickets/ticketActions.js
import { useCallback } from 'react';
import {
  changeStatus,
  addNotes,
  updateCollaborators,
  updateTicketDepartment,
  updatePatientName,
  updatePatientDOB,
  updateCallbackNumber,
  assignAgent,
  //updateCenter,
  relateTicketsByPhone
} from '../apiTickets';

import { useTicketActionRunner } from '../../components/hooks/useTicketActionRunner';
import { pickUpdatedTicket } from '../../utils/tickets/ticketActionHelper';
//import { useTickets } from '../../context/ticketsContext';
//import { useLoading } from '../../providers/loadingProvider';

/**
 * Hook que expone todos los handlers de ticket ya “pre cableados” con:
 * - loading global
 * - notificaciones globales
 * - dispatch global para UPD_TICKET
 *
 * Los handlers sólo piden los datos específicos de la acción.
 */
export function useTicketHandlers() {
  const run = useTicketActionRunner();        // runner ya mapea notificaciones + loading global
  //const { dispatch } = useTickets();          // para pasar a APIs legacy que lo requieren
  //const { setLoading } = useLoading();        // idem

  // -------- Status --------
  const handleStatusChange = useCallback(async ({
    ticketId,
    newStatus,
    setStatus, // opcional: si quieres también setear estado local en el componente
  }) => {
    const res = await run({
      fn: changeStatus,
      args: [ticketId, newStatus],
      // el runner ya hace loading/notify y UPD_TICKET si se lo damos:
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, status: newStatus }),
      onSuccess: () => setStatus?.(newStatus),
    });
    return res;
  }, [run]);


  // -------- Notas --------
  const handleAddNoteHandler = useCallback(async ({
    ticketId,
    noteContent,
    onDone, // opcional: callback post-éxito en el componente
  }) => {
    if (!noteContent?.trim()) return;

    const newNote = [{
      event_type: 'user_note',
      event: noteContent.trim(),
      datetime: new Date().toISOString(),
    }];

    return run({
      fn: addNotes,
      // API legacy: (dispatch, setLoading, ticketId, agentEmail, notes[])
      args: [ticketId, newNote],
      getUpdatedTicket: pickUpdatedTicket,
      onSuccess: () => onDone?.(),
    });
  }, [run]);


  // -------- Colaboradores: ADD --------
  const updateCollaboratorsHandler = useCallback(async ({
    ticketId,
    collaborators = [],
    selectedAgents = [],
  }) => {
    const base = Array.isArray(collaborators) ? collaborators : [];
    const updated = [...new Set([...base, ...selectedAgents.filter(a => !base.includes(a))])];

    const res = await run({
      fn: updateCollaborators,
      // API legacy: (dispatch, setLoading, ticketId, agentEmail, collaborators[])
      args: [ticketId, updated],
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, collaborators: updated }),
    });

    const t = pickUpdatedTicket(res);
    return Array.isArray(t?.collaborators) ? t.collaborators : updated;
  }, [run]);


  // -------- Colaboradores: REMOVE --------
  const handleRemoveCollaboratorHandler = useCallback(async ({
    ticketId,
    collaborators = [],
    emailToRemove,
  }) => {
    const base = Array.isArray(collaborators) ? collaborators : [];
    const updated = base.filter(c => c !== emailToRemove);

    const res = await run({
      fn: updateCollaborators,
      args: [ticketId, updated],
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, collaborators: updated }),
    });

    const t = pickUpdatedTicket(res);
    return Array.isArray(t?.collaborators) ? t.collaborators : updated;
  }, [run]);


  // -------- Departamento --------
  const handleChangeDepartmentHandler = useCallback(async ({
    ticketId,
    newDept,
  }) => {
    if (!newDept) return;
    return run({
      fn: updateTicketDepartment,
      args: [ticketId, newDept],
      getUpdatedTicket: pickUpdatedTicket,
    });
  }, [run]);


  // -------- Centro (dos pasos) --------
  /*const handleCenterHandler = useCallback(async ({
    ticketId,
    ticket,        // objeto ticket para updateCenter (API legacy)
    agentEmail,
    selectedCenter,
  }) => {
    if (!selectedCenter) return;

    const r1 = await run({
      fn: updateTicketDepartment,
      args: [dispatch, setLoading, ticketId, agentEmail, selectedCenter],
      getUpdatedTicket: pickUpdatedTicket,
    });
    if (!r1?.success) return r1;

    return run({
      fn: updateCenter,
      args: [dispatch, setLoading, ticket, selectedCenter],
      getUpdatedTicket: pickUpdatedTicket,
    });
  }, [run, dispatch, setLoading]);*/

  // -------- Patient Name --------
  const updatePatientNameHandler = useCallback(async ({
    ticketId,
    newName,
  }) => {
    return run({
      fn: updatePatientName,
      args: [ticketId, newName],
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, patient_name: newName }),
    });
  }, [run]);


  // -------- Patient DOB --------
  const updatePatientDobHandler = useCallback(async ({
    ticketId,
    newDob,         // YYYY-MM-DD
    onSetLocalDob,  // opcional: callback para setear estado local formateado
  }) => {
    if (!newDob) return;

    const [y, m, d] = newDob.split('-');
    const mmddyyyy = `${m}/${d}/${y}`;

    return run({
      fn: updatePatientDOB,
      args: [ticketId, mmddyyyy],
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, patient_dob: mmddyyyy }),
      onSuccess: () => onSetLocalDob?.(mmddyyyy),
    });
  }, [run]);


  // -------- Callback Number --------
  const updateCallbackNumberHandler = useCallback(async ({
    ticketId,
    newPhone,
  }) => {
    return run({
      fn: updateCallbackNumber,
      args: [ticketId, newPhone],
      getUpdatedTicket: pickUpdatedTicket,
    });
  }, [run]);


  // -------- Assign Agent --------
  const updateAssigneeHandler = useCallback(async ({
    ticketId,
    selectedAgent, // email
  }) => {
    return run({
      fn: assignAgent,
      args: [ticketId, selectedAgent],
      getUpdatedTicket: (r) => pickUpdatedTicket(r) || ({ id: ticketId, agent_assigned: selectedAgent }),
    });
  }, [run]);

  // -------- Relacionar por teléfono / patientId --------
  const relateTicketHandler = useCallback(async ({
    ticketId,
    action,       // 'link' | 'unlink' (según tu backend)
    ticketPhone,
    patientId,
  }) => {
    const res = await run({
      fn: relateTicketsByPhone,
      // API legacy extensa: pasa sólo lo que realmente use tu endpoint
      args: [ticketId, action, ticketPhone, patientId],
      getUpdatedTicket: (r) => {
        const u = r?.updated_ticket || pickUpdatedTicket(r);
        return u
          ? { id: u.id, linked_patient_snapshot: u.linked_patient_snapshot ?? null, patient_id: u.patient_id ?? null }
          : null;
      },
    });
    return res;
  }, [run]);

  return {
    handleStatusChange,
    handleAddNoteHandler,
    updateCollaboratorsHandler,
    handleRemoveCollaboratorHandler,
    handleChangeDepartmentHandler,
    //handleCenterHandler,
    updatePatientNameHandler,
    updatePatientDobHandler,
    updateCallbackNumberHandler,
    updateAssigneeHandler,
    relateTicketHandler,
  };
}
