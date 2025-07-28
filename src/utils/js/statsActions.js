// utils/ticketActions.js
import { getStats, getDailyStats } from "../apiStats";

export async function handleGetStats({ dispatch, setLoading, ticketId, agentEmail, newStatus, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen }) {
  setLoading(true);
  const result = await getStats(dispatch, setLoading, ticketId, agentEmail, newStatus);
  if (result.success) {
    setSuccessMessage(result.message);
    setStatus(newStatus);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}

export async function handleGetDailyStats({ dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setSuccessMessage, setSuccessOpen, setErrorMessage, setErrorOpen }) {
    setLoading(true);
  const result = await getDailyStats(dispatch, setLoading, ticketId, agentEmail, noteContent);
  if (result.success) {
    setNoteContent('');
    setOpenNoteDialog(false);
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}