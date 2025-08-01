import { useState, useEffect } from 'react';

export function useTicketData(ticketId, tickets) {
  const ticket = tickets.find(t => t.id === ticketId);

  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [agentAssigned, setAgentAssigned] = useState(ticket?.agent_assigned || '');
  const [linkedPatient, setLinkedPatient] = useState(ticket?.linked_patient_snapshot);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  const [callbakNumber, setCallbackNumber] = useState(ticket?.callback_number || '');

  const formatDateForInput = (dateStr = '01-01-1901') => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const [patientDob, setPatientDob] = useState(formatDateForInput(ticket?.patient_dob));

  useEffect(() => {
    if (ticket?.notes) setNotes(ticket.notes);
  }, [ticket]);

  useEffect(() => {
    setLinkedPatient(ticket?.linked_patient_snapshot);
  }, [ticket?.linked_patient_snapshot]);

  useEffect(() => {
    if (ticket) {
      setAgentAssigned(ticket.agent_assigned || '');
      setCollaborators(ticket.collaborators || []);
      setStatus(ticket.status || '');
    }
  }, [ticket]);

  return {
    ticket,
    status,
    setStatus,
    notes,
    setNotes,
    collaborators,
    setCollaborators,
    agentAssigned,
    setAgentAssigned,
    linkedPatient,
    setLinkedPatient,
    patientName,
    setPatientName,
    callbakNumber,
    setCallbackNumber,
    patientDob,
    setPatientDob,
  };
}
