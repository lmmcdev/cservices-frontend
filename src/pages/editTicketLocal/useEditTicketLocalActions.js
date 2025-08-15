// src/components/hooks/useEditTicketLocalActions.js
import { useCallback } from 'react';
import setIfChanged from '../../utils/js/state';

// ⬇️ importa el hook que expone todos los handlers ya “pre cableados”
import { useTicketHandlers } from '../../utils/js/ticketActions';
// (opcional) por si quieres extraer ticket del result en algunos casos
import { pickUpdatedTicket } from '../../utils/tickets/ticketActionHelper';

export function useEditTicketLocalActions({
  ticketId,
  agentEmail,
  navigate,

  // setters locales del componente
  setStatus,
  setNotes,
  setNoteContent,
  setOpenNoteDialog,
  setCollaborators,
  setEditField,
  setAgentAssigned,
  setLinkedPatientSnapshot,

  // valores locales
  collaborators,
  noteContent,
}) {
  const {
    handleStatusChange,
    handleAddNoteHandler,
    updateCollaboratorsHandler,
    handleRemoveCollaboratorHandler,
    handleChangeDepartmentHandler,
    updatePatientNameHandler,
    updatePatientDobHandler,
    updateCallbackNumberHandler,
    updateAssigneeHandler,
    handleCenterHandler,
    relateTicketHandler,
  } = useTicketHandlers();

  // ---- STATUS ----
  const handleStatusChangeUI = useCallback(async (newStatus) => {
    const res = await handleStatusChange({
      ticketId,
      newStatus,
      setStatus, // el handler llamará esto en onSuccess
    });
    if (res?.success) setIfChanged(setStatus, newStatus);
  }, [handleStatusChange, ticketId, setStatus]);

  // ---- NOTAS ----
  const handleAddNote = useCallback(async () => {
    if (!noteContent?.trim()) return;

    const res = await handleAddNoteHandler({
      ticketId,
      agentEmail,
      noteContent,
      // al terminar, limpia UI local
      onDone: () => {
        setNoteContent?.('');
        setOpenNoteDialog?.(false);
      },
    });

    // si el backend devolvió el ticket con notas, actualiza el estado local
    const t = pickUpdatedTicket(res);
    if (t?.notes) {
      setIfChanged(setNotes, t.notes, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    }
  }, [handleAddNoteHandler, ticketId, agentEmail, noteContent, setNoteContent, setOpenNoteDialog, setNotes]);

  // ---- COLABORADORES (ADD) ----
  const onAddCollaboratorCb = useCallback(async (selectedAgents) => {
    const list = await updateCollaboratorsHandler({
      ticketId,
      agentEmail,
      collaborators,
      selectedAgents,
    });
    // el handler devuelve SIEMPRE el array final de colaboradores
    setIfChanged(setCollaborators, list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    setEditField?.(null);
  }, [updateCollaboratorsHandler, ticketId, agentEmail, collaborators, setCollaborators, setEditField]);

  // ---- COLABORADORES (REMOVE) ----
  const handleRemoveCollaborator = useCallback(async (emailToRemove) => {
    const list = await handleRemoveCollaboratorHandler({
      ticketId,
      agentEmail,
      collaborators,
      emailToRemove,
    });
    setIfChanged(setCollaborators, list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    setEditField?.(null);
  }, [handleRemoveCollaboratorHandler, ticketId, agentEmail, collaborators, setCollaborators, setEditField]);

  // ---- DEPARTAMENTO ----
  const handleChangeDepartment = useCallback(async (newDept) => {
    const res = await handleChangeDepartmentHandler({
      ticketId,
      agentEmail,
      newDept,
    });
    if (res?.success) {
      setEditField?.(null);
      navigate?.('/dashboard');
    }
  }, [handleChangeDepartmentHandler, ticketId, agentEmail, navigate, setEditField]);

  // ---- PACIENTE: NOMBRE ----
  const updatePatientNameUI = useCallback(async (newName) => {
    await updatePatientNameHandler({ ticketId, agentEmail, newName });
    setEditField?.(null);
  }, [updatePatientNameHandler, ticketId, agentEmail, setEditField]);

  // ---- PACIENTE: DOB (YYYY-MM-DD) ----
  const updatePatientDobUI = useCallback(async (newDob) => {
    await updatePatientDobHandler({
      ticketId,
      agentEmail,
      newDob,
      // si quisieras mantener un estado local formateado, podrías pasar:
      // onSetLocalDob: (mmddyyyy) => setPatientDob?.(mmddyyyy),
    });
    setEditField?.(null);
  }, [updatePatientDobHandler, ticketId, agentEmail, setEditField]);

  // ---- CALLBACK NUMBER ----
  const updateCallbackNumberUI = useCallback(async (newPhone) => {
    await updateCallbackNumberHandler({ ticketId, agentEmail, newPhone });
    setEditField?.(null);
  }, [updateCallbackNumberHandler, ticketId, agentEmail, setEditField]);

  // ---- ASSIGNEE ----
  const ticketAssigneeUI = useCallback(async (selectedAgent) => {
    const res = await updateAssigneeHandler({ ticketId, selectedAgent });
    if (res?.success) setIfChanged(setAgentAssigned, selectedAgent);
    setEditField?.(null);
  }, [updateAssigneeHandler, ticketId, setAgentAssigned, setEditField]);

  // ---- CENTER (2 pasos) ----
  const handleCenterHandlerUI = useCallback(async (selectedCenter, ticketArg) => {
    await handleCenterHandler({
      ticketId,
      ticket: ticketArg,
      agentEmail,
      selectedCenter,
    });
    setEditField?.(null);
  }, [handleCenterHandler, ticketId, agentEmail, setEditField]);

  // ---- LINK/UNLINK paciente ----
  const handleRelateCurrentTicket = useCallback(async (ticketArg, patient) => {
    const res = await relateTicketHandler({
      ticketId: ticketArg.id,
      agentEmail,
      action: 'relateCurrent',
      ticketPhone: ticketArg.phone,
      patientId: patient.id,
    });
    if (res?.success) {
      const u = res?.updated_ticket || pickUpdatedTicket(res);
      if (u) {
        setIfChanged(
          setLinkedPatientSnapshot,
          u.linked_patient_snapshot ?? null,
          (a, b) => JSON.stringify(a) === JSON.stringify(b)
        );
      }
    }
  }, [relateTicketHandler, agentEmail, setLinkedPatientSnapshot]);

  const handleRelateAllPastTickets = useCallback(async (ticketArg, patient) => {
    await relateTicketHandler({
      ticketId: ticketArg.id,
      agentEmail,
      action: 'relatePast',
      ticketPhone: ticketArg.phone,
      patientId: patient.id,
    });
  }, [relateTicketHandler, agentEmail]);

  const handleRelateFutureTickets = useCallback(async (ticketArg, patient) => {
    await relateTicketHandler({
      ticketId: ticketArg.id,
      agentEmail,
      action: 'relateFuture',
      ticketPhone: ticketArg.phone,
      patientId: patient.id,
    });
  }, [relateTicketHandler, agentEmail]);

  const handleUnlinkTicket = useCallback(async (ticketArg) => {
    const res = await relateTicketHandler({
      ticketId: ticketArg.id,
      agentEmail,
      action: 'unlink',
      ticketPhone: null,
      patientId: null,
    });
    if (res?.success) {
      const u = res?.updated_ticket || pickUpdatedTicket(res);
      if (u) {
        setIfChanged(
          setLinkedPatientSnapshot,
          u.linked_patient_snapshot ?? null,
          (a, b) => JSON.stringify(a) === JSON.stringify(b)
        );
      }
    }
  }, [relateTicketHandler, agentEmail, setLinkedPatientSnapshot]);

  return {
    handleStatusChangeUI,
    handleAddNote,
    onAddCollaboratorCb,
    handleRemoveCollaborator,
    handleChangeDepartment,
    updatePatientNameUI,
    updatePatientDobUI,
    updateCallbackNumberUI,
    ticketAssigneeUI,
    handleCenterHandlerUI,
    handleRelateCurrentTicket,
    handleRelateAllPastTickets,
    handleRelateFutureTickets,
    handleUnlinkTicket,
  };
}
