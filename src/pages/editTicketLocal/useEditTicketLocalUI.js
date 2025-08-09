// useEditTicketLocalUi.js
import { useCallback } from 'react';

export function useEditTicketLocalUi({
  // estado/datos que necesita la UI
  ticket,
  relateTicketAction,
  pendingPatient,

  // setters de UI
  setAgentDialogOpen,
  setRelateTicketAction,
  setOpenRelateModal,
  setPendingPatient,
  setOpenConfirmDialog,

  // navegación
  navigate,

  // acciones (ya vienen del hook de acciones)
  handleRelateCurrentTicket,
  handleRelateAllPastTickets,
  handleRelateFutureTickets,
  handleCenterHandlerUI,
  ticketAssigneeUI,
  onAddCollaboratorCb,
}) {
  // abrir selector de agentes (colaboradores)
  const handleAddCollaboratorClick = useCallback(() => {
    setAgentDialogOpen(true);
  }, [setAgentDialogOpen]);

  // abrir modal de relacionar ticket y setear acción
  const handleModalTicket = useCallback((ticketAction = 'relateCurrent') => {
    setRelateTicketAction(ticketAction);
    setOpenRelateModal(true);
  }, [setRelateTicketAction, setOpenRelateModal]);

  // mostrar confirmación con el paciente elegido
  const showActions = useCallback((patient) => {
    setPendingPatient(patient);
    setOpenConfirmDialog(true);
  }, [setPendingPatient, setOpenConfirmDialog]);

  // ejecutar la acción elegida luego de confirmar
  const handleRelateAllActions = useCallback(async () => {
    setOpenConfirmDialog(false);
    try {
      if (relateTicketAction === 'relateCurrent') {
        await handleRelateCurrentTicket(ticket, pendingPatient);
      } else if (relateTicketAction === 'relateAllPast') {
        await handleRelateAllPastTickets(ticket, pendingPatient);
      } else if (relateTicketAction === 'relateFuture') {
        await handleRelateFutureTickets(ticket, pendingPatient);
      }
      setOpenRelateModal(false);
    } catch {
      // si falla, reabrimos confirm si te interesa
      setOpenConfirmDialog(true);
    }
  }, [
    relateTicketAction,
    ticket,
    pendingPatient,
    handleRelateCurrentTicket,
    handleRelateAllPastTickets,
    handleRelateFutureTickets,
    setOpenRelateModal,
    setOpenConfirmDialog,
  ]);

  // navegación a dashboard
  const closeEditTicket = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // callbacks “sin lambdas inline” para pasar a los diálogos
  const onChangeCenterCb = useCallback(async (selectedCenter) => {
    await handleCenterHandlerUI(selectedCenter, ticket);
  }, [handleCenterHandlerUI, ticket]);

  const onReassignAgentCb = useCallback(async (selectedAgent) => {
    await ticketAssigneeUI(selectedAgent);
  }, [ticketAssigneeUI]);

  const onAgentSelectorAddCb = useCallback(async (selectedAgents) => {
    await onAddCollaboratorCb(selectedAgents);
  }, [onAddCollaboratorCb]);

  return {
    handleAddCollaboratorClick,
    handleModalTicket,
    showActions,
    handleRelateAllActions,
    closeEditTicket,
    onChangeCenterCb,
    onReassignAgentCb,
    onAgentSelectorAddCb,
  };
}
