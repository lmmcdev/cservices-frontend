// useEditTicketLocalActions.js
import { useCallback } from 'react';
import {
  handleStatusChange,
  handleAddNoteHandler,
  handleRemoveCollaboratorHandler,
  handleChangeDepartmentHandler,
  updatePatientNameHandler,
  updatePatientDobHandler,
  updateCallbackNumberHandler,
  updateCollaboratorsHandler,
  updateAssigneeHandler,
  handleCenterHandler,
  relateTicketHandler,
} from '../../utils/js/ticketActions';

/**
 * Extrae SOLO las funciones/handlers, conservando tu lógica actual.
 * No introduce runAction ni cambios de UX.
 */
export function useEditTicketLocalActions({
  // deps obligatorios
  dispatch, setLoading, ticketId, agentEmail, navigate,
  // setters de UI/snackbars/estados que ya usas
  setStatus, setNotes, setNoteContent, setOpenNoteDialog,
  setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
  collaborators, setCollaborators, setEditField, setAgentAssigned,
  setLinkedPatientSnapshot,
  // datos puntuales
  noteContent,
}) {
  const handleStatusChangeUI = useCallback(async (newStatus) => {
    handleStatusChange({
      dispatch, setLoading, ticketId, agentEmail, newStatus,
      setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
  }, [dispatch, setLoading, ticketId, agentEmail, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleAddNote = useCallback(async () => {
    const result = await handleAddNoteHandler({
      dispatch, setLoading, ticketId, agentEmail, noteContent,
      setNotes, setNoteContent, setOpenNoteDialog, setStatus,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    if (result?.success) setNotes(result.ticket?.notes);
  }, [dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const onAddCollaboratorCb = useCallback(async (selectedAgents) => {
    const result = await updateCollaboratorsHandler({
      dispatch, setLoading, ticketId, agentEmail, collaborators, selectedAgents,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setCollaborators(result);
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, collaborators, setCollaborators, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleRemoveCollaborator = useCallback(async (emailToRemove) => {
    const result = await handleRemoveCollaboratorHandler({
      dispatch, setLoading, ticketId, agentEmail, collaborators, emailToRemove,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setCollaborators(result);
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, collaborators, setCollaborators, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleChangeDepartment = useCallback(async (newDept) => {
    const result = await handleChangeDepartmentHandler({
      dispatch, setLoading, ticketId, agentEmail, newDept,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    if (result?.success) {
      setEditField(null);
      navigate('/dashboard');
    }
  }, [dispatch, setLoading, ticketId, agentEmail, navigate, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const updatePatientNameUI = useCallback(async (newName) => {
    await updatePatientNameHandler({
      dispatch, setLoading, ticketId, agentEmail, newName,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const updatePatientDobUI = useCallback(async (newDob) => {
    await updatePatientDobHandler({
      dispatch, setLoading, ticketId, agentEmail, newDob,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const updateCallbackNumberUI = useCallback(async (newPhone) => {
    await updateCallbackNumberHandler({
      dispatch, setLoading, ticketId, agentEmail, newPhone,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const ticketAssigneeUI = useCallback(async (selectedAgent) => {
    const result = await updateAssigneeHandler({
      dispatch, setLoading, ticketId, agentEmail, selectedAgent,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    if (result?.success) setAgentAssigned(selectedAgent);
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setAgentAssigned, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleCenterHandlerUI = useCallback(async (selectedCenter, ticketArg) => {
    await handleCenterHandler({
      dispatch, setLoading, ticketId, ticket: ticketArg, agentEmail, selectedCenter,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setEditField, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleRelateCurrentTicket = useCallback(async (ticketArg, patient) => {
    const result = await relateTicketHandler({
      dispatch, setLoading, ticketId: ticketArg.id, agentEmail,
      action: 'relateCurrent', ticketPhone: ticketArg.phone, patientId: patient.id,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    if (result?.success) {
      setLinkedPatientSnapshot(result.updated_ticket?.linked_patient_snapshot || null);
    }
  }, [dispatch, setLoading, agentEmail, setLinkedPatientSnapshot, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleRelateAllPastTickets = useCallback(async (ticketArg, patient) => {
    await relateTicketHandler({
      dispatch, setLoading, ticketId: ticketArg.id, agentEmail,
      action: 'relatePast', ticketPhone: ticketArg.phone, patientId: patient.id,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
  }, [dispatch, setLoading, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleRelateFutureTickets = useCallback(async (ticketArg, patient) => {
    await relateTicketHandler({
      dispatch, setLoading, ticketId: ticketArg.id, agentEmail,
      action: 'relateFuture', ticketPhone: ticketArg.phone, patientId: patient.id,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
  }, [dispatch, setLoading, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  const handleUnlinkTicket = useCallback(async (ticketArg) => {
    const result = await relateTicketHandler({
      dispatch, setLoading, ticketId: ticketArg.id, agentEmail,
      action: 'unlink', ticketPhone: null, patientId: null,
      setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    });
    if (result?.success) {
      setLinkedPatientSnapshot(result.updated_ticket?.linked_patient_snapshot || null);
    }
  }, [dispatch, setLoading, agentEmail, setLinkedPatientSnapshot, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

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
