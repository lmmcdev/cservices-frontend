import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TicketStatusBar from '../components/ticketStatusBar';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
import { useLoading } from '../providers/loadingProvider';
import TicketNotes from '../components/ticketNotes';
import TicketCollaborators from '../components/ticketCollaborators';
import TicketAudio from '../components/ticketAudio';
import AddNoteDialog from '../components/dialogs/addNotesDialog';
import AgentSelectorDialog from '../components/dialogs/agentSelectorDialog';
import TicketAssignee from '../components/ticketAssignee';
import ChangeAgentModal from '../components/dialogs/changeAgentModal';
import ChangeDepartmentModal from '../components/dialogs/changeDepartmentModal';
import PatientProfileDialog from '../components/dialogs/patientProfileDialog';
import Tooltip from '@mui/material/Tooltip';
import { useWorkTimer } from '../components/components/useWorkTimer';
import TicketWorkTime from '../components/ticketWorkTime';
import { useAgents } from '../context/agentsContext';
import { useAuth } from '../context/authContext';
import ChangeCenterModal from '../components/dialogs/changeCenterModal';
import { useTickets } from '../context/ticketsContext.js';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { TicketIndicators } from '../components/ticketIndicators';
import TicketLinkOptions from '../components/ticketLinkOptions';
import RelateTicketModal from '../components/dialogs/relateTicketModal.jsx';
import ConfirmDialog from '../components/dialogs/confirmDialog';
//import { useTicketById } from '../components/hooks/useTicketById.js';


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
  relateTicketHandler
} from '../utils/js/ticketActions.js';

import { getStatusColor } from '../utils/js/statusColors.js';

export default function EditTicket() {
  //constants 
  const { state:ticketsAll, dispatch } = useTickets();
  const tickets = ticketsAll.tickets;
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  //const [localTicket, setLocalTicket] = useState(null);
  //const ticket = useTicketById(ticketId);
  

  //memoizar el ticket para evitar re-renderizados innecesarios
  const ticket = useMemo(() => {
    return tickets.find(t => t.id === ticketId);
  }, [tickets, ticketId]);

  const [ agentAssigned, setAgentAssigned ] = useState(ticket?.agent_assigned || '');
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { user } = useAuth();
  const agentEmail = user.username;
  
  
  //const patient_snapshot = ticket.linked_patient_snapshot;
  //statuses
  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  const [linked_patient_snapshot, setLinkedPatientSnapshot] = useState(ticket?.linked_patient_snapshot || '');

  
 const formatDateForInput = (dateStr = '01-01-1901') => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexado
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

  const [patientDob, setPatientDob] = useState(formatDateForInput(ticket?.patient_dob));
  const [callbakNumber, setCallbackNumber] = useState(ticket?.callback_number || '');
  const [ patientPhone, ] = useState(ticket?.phone || '')

  //state status
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [editField, setEditField] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dialogs
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [openReassignAgentModal, setOpenReassignAgentModal] = useState(false);
  const [openChangeDepartmentModal, setOpenChangeDepartmentModal] = useState(false);
  const [openCenterModal, setOpenCenterModal] = useState(false);
  const [openRelateModal, setOpenRelateModal] = useState(false);
  const [relateTicketAction, setRelateTicketAction] = useState('relateCurrent');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingPatient, setPendingPatient] = useState(null);
  //const [memoSnapshot, setMemoSnapshot] = useState(null);

  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  useWorkTimer( {ticketData:ticket, agentEmail, status, enabled:true} );

  //console.log(JSON.stringify(ticket.linked_patient_snapshot))
  useEffect(() => {
    if (ticket?.notes) {
      setNotes(ticket.notes);
    }
  }, [ticket]);


  useEffect(() => {
    if (ticket) {
      setAgentAssigned(ticket.agent_assigned || '');
      setCollaborators(ticket.collaborators);
      setStatus(ticket.status || '');
      setLinkedPatientSnapshot(ticket.linked_patient_snapshot || null);
    }
  }, [ticket]);
  


    //handling functions
    const handleStatusChangeUI = async (newStatus) => {
      handleStatusChange({ dispatch, setLoading, ticketId, agentEmail, newStatus, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen });
    };

        ///////////////////////////////////////////////////////////////////////
    const handleAddNote = useCallback(async () => {
      await handleAddNoteHandler({dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    }, [dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);
    ////////////////////////////////////////////////////////////////////////////
    const handleAddCollaboratorClick = useCallback(async (newCollaborator) => {
      setAgentDialogOpen(true);
    }, []);

  const handleRemoveCollaborator = useCallback(async (emailToRemove) => {
    await handleRemoveCollaboratorHandler({dispatch, setLoading, ticketId, agentEmail, collaborators, emailToRemove, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, collaborators, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  //////////////////////////////////////////////////////////////////////////////
  const handleChangeDepartment = useCallback(async (newDept) => {
    await handleChangeDepartmentHandler({dispatch, setLoading, ticketId, agentEmail, newDept, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  /////////////////////Update Patient Fields///////////////////////////////////////////////////////
  ///////////patient name///////////////////////
  const updatePatientNameUI = useCallback(async (newName) => {
    await updatePatientNameHandler({dispatch, setLoading, ticketId, agentEmail, newName, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  ////////////patient dob///////////////////////
  const updatePatientDobUI = useCallback(async (newDob) => {
    await updatePatientDobHandler({dispatch, setLoading, ticketId, agentEmail, newDob, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);


  ///////////patient phone////////////////////////////////
  const updateCallbackNumberUI = useCallback(async (newPhone) => {
    await updateCallbackNumberHandler({dispatch, setLoading, ticketId, agentEmail, newPhone, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  ///////////add ticket collaborator////////////////////////////////
  const addCollaboratorUI = useCallback(async (selectedAgents) => {
    await updateCollaboratorsHandler({dispatch, setLoading, ticketId, agentEmail, collaborators, selectedAgents, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, collaborators, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  ///////////add ticket collaborator////////////////////////////////
  const ticketAssigneeUI = useCallback(async (selectedAgent) => {
    await updateAssigneeHandler({dispatch, setLoading, ticketId, agentEmail, selectedAgent, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  }, [dispatch, setLoading, ticketId, agentEmail, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen]);

  //////////////////////////////////////////////////////////////////////
  const handleCenterHandlerUI = async (selectedCenter, ticket) => {
    await handleCenterHandler({dispatch, setLoading, ticketId, ticket, agentEmail, selectedCenter, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  const handleModalTicket = (ticketAction = 'relateCurrent') => {
    setRelateTicketAction(ticketAction);
    setOpenRelateModal(true);
  };

  const showActions = (patient) => {
    setPendingPatient(patient);
    setOpenConfirmDialog(true);
  };

  const handleRelateAllActions = async () => {
  // cerrar el diálogo YA
  setOpenConfirmDialog(false);

    try {
      if (relateTicketAction === 'relateCurrent') {
        await handleRelateCurrentTicket(ticket, pendingPatient);
      } else if (relateTicketAction === 'relateAllPast') {
        await handleRelateAllPastTickets(ticket, pendingPatient);
      } else if (relateTicketAction === 'relateFuture') {
        await handleRelateFutureTickets(ticket, pendingPatient);
      }
      // cerrar modal de selección si lo tuviste abierto
      setOpenRelateModal(false);
    } catch (e) {
      // si querés, reabrí el confirm solo si falla
      setOpenConfirmDialog(true);
    }
  };

  const handleRelateCurrentTicket = async (ticket,patient) => {
    const ticketId = ticket.id;
    const ticketPhone = ticket.phone;
    const patientId = patient.id;
    await relateTicketHandler({dispatch, setLoading, ticketId, agentEmail, action: 'relateCurrent', ticketPhone, patientId, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen });
  };

const handleRelateAllPastTickets = async (ticket, patient) => {
  const ticketId = ticket.id;
  const ticketPhone = ticket.phone;
  const patientId= patient.id;
  await relateTicketHandler({dispatch,setLoading,ticketId,agentEmail,action: 'relatePast',ticketPhone, patientId, setSuccessMessage,setErrorMessage,setSuccessOpen,setErrorOpen,});
};

const handleRelateFutureTickets = async (ticket, patient) => {
  const ticketId = ticket.id;
  const ticketPhone = ticket.phone;
  const patientId= patient.id;
  await relateTicketHandler({dispatch, setLoading, ticketId, agentEmail, action: 'relateFuture', ticketPhone, patientId, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen });
};

const handleUnlinkTicket = async (ticket) => {
  const ticketId = ticket.id;
  const patientId = null;
  const ticketPhone = null;
  await relateTicketHandler({ dispatch, setLoading, ticketId, agentEmail, action: 'unlink', ticketPhone, patientId, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
};

const closeEditTicket = () => {
  // dispatch({ type: 'UPD_TICKET', payload: ticket });

  navigate('/dashboard');
}



  if (!ticket) return <Typography>Ticket not found</Typography>;

return (
    <>
      <Paper
        sx={{
          position: 'fixed', // <- esto es CLAVE para fijar el contenedor
          top: 150,          // <- ajusta según la altura del topbar
          left: 220,
          right: 20,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          borderRadius: 4,
          p: 4,
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
              }}
            >
              {/* Row 1: Flechas y X a la derecha */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  pr: 3,
                  gap: 1,
                }}
              >
                {/* Ir hacia atrás */}
                <Tooltip title="Previous case">
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                      '&:hover': {
                        color: '#00a1ff',
                        backgroundColor: 'transparent',
                        transition: '0.2s',
                      },
                    }}
                  >
                    <i className="fa fa-arrow-left" style={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>

                {/* Ir hacia adelante */}
                <Tooltip title="Next case">
                  <IconButton
                    onClick={() => navigate(1)}
                    sx={{
                      '&:hover': {
                        color: '#00a1ff',
                        backgroundColor: 'transparent',
                        transition: '0.2s',
                      },
                    }}
                  >
                    <i className="fa fa-arrow-right" style={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>

                {/* Volver a tableTickets */}
                <Tooltip title="Close">
                  <IconButton
                    onClick={closeEditTicket}
                    sx={{
                      '&:hover': {
                        color: '#B0200C',
                        backgroundColor: 'transparent',
                        transition: '0.2s',
                      },
                    }}
                  >
                    <i className="fa fa-close" style={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>

        {/* Row 2: StatusBar */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <TicketStatusBar currentStatus={status} onStatusChange={handleStatusChangeUI} />
        </Box>


        {/* Row 3: Centered Container for the three columns */}
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '540px' }}>
              {/* Patient Information */}
              <Card variant="outlined">
                <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 24,
                          borderRadius: 10,
                          backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                        }}
                      />
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: getStatusColor(ticket?.status) }}>
                          Patient Information
                        </Typography>
                        <TicketLinkOptions />
                      </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="View Profile">
                        <IconButton onClick={() => setOpenPatientDialog(true)} size="small" sx={{ color: '#00a1ff' }}>
                          <i className="fa fa-id-card" />
                        </IconButton>
                      </Tooltip>

                      <TicketLinkOptions
                        ticket={ticket}
                        onRelateCurrentTicket={() => handleModalTicket('relateCurrent')}
                        onRelateAllPastTickets={() => handleModalTicket('relateAllPast')}
                        onRelateFutureTickets={() => handleModalTicket('relateFuture')}
                        onUnlinkTicket={handleUnlinkTicket}
                        handleAllActions={handleRelateAllActions}
                        //onRelateAllPastTickets={handleRelateAllPastTickets}
                        //onRelateFutureTickets={handleRelateFutureTickets}
                        //onUnlinkTicket={handleUnlinkTicket}
                      />
                    </Box>
                  </Box>

                  {/* --- Nueva lógica --- */}
                  {ticket.linked_patient_snapshot?.Name ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InsertLinkIcon color="success" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {ticket.linked_patient_snapshot.Name}
                      </Typography>
                    </Box>
                  ) : (
                    // fallback al paciente editable
                    <>
                      <Typography sx={{ mb: 1 }}>
                        <strong>Patient:</strong><br />
                        <Box mt={1}>
                          {editField === 'name' ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <TextField
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                size="small"
                                fullWidth
                              />
                              <IconButton
                                onClick={async () => {
                                  await updatePatientNameUI(patientName);
                                  setEditField(null);
                                }}
                              >
                                <SaveIcon />
                              </IconButton>
                              <IconButton onClick={() => setEditField(null)}><i className="fa fa-close" /></IconButton>
                            </Box>
                          ) : (
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography>{patientName}</Typography>
                              <IconButton onClick={() => setEditField('name')}><EditIcon fontSize="small" /></IconButton>
                            </Box>
                          )}
                        </Box>
                      </Typography>
                    </>
                  )}


                  <Typography sx={{ mb: 1 }}>
                    <strong>Patient DOB:</strong><br />
                    {linked_patient_snapshot?.DOB ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InsertLinkIcon color="success" />
                      <Typography variant="subtitle" sx={{ color: '#2e7d32' }}>
                        {linked_patient_snapshot.DOB}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      {editField === 'dob' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            type="date"
                            value={patientDob}
                            onChange={(e) => setPatientDob(e.target.value)}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <IconButton
                            onClick={async () => {
                              await updatePatientDobUI(patientDob);
                              setEditField(null);
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditField(null)}><i className="fa fa-close" /></IconButton>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography>{patientDob}</Typography>
                          <IconButton onClick={() => setEditField('dob')}><EditIcon fontSize="small" /></IconButton>
                        </Box>
                      )}
                    </Box>
                  )}
                  </Typography>

                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Phone:</strong><br /> {ticket.phone}
                  </Typography>

                  <Typography>
                    <strong>Callback Number:</strong><br />
                    <Box>
                      {editField === 'phone' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            value={callbakNumber}
                            onChange={(e) => setCallbackNumber(e.target.value)}
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            onClick={async () => {
                              await updateCallbackNumberUI(callbakNumber);
                              setEditField(null);
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditField(null)}><i className="fa fa-close" /></IconButton>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography>{callbakNumber}</Typography>
                          <IconButton onClick={() => setEditField('phone')}><EditIcon fontSize="small" /></IconButton>
                        </Box>
                      )}
                    </Box>
                  </Typography>
                </CardContent>
              </Card>

              <TicketNotes
                notes={notes}
                onAddNote={() => setOpenNoteDialog(true)}
                status={status}
              />
            </Box>
          </Grid>

          <Grid item>
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '540px' }}>
              {/* Call Information */}
              <Card variant="outlined">
                <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 24,
                          borderRadius: 10,
                          backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}
                      >
                        Call Information
                      </Typography>
                    </Box>

                    {/* Iconos: Priority / Risk / Category */}
                    <TicketIndicators ai_data={ticket.aiClassification} showTooltip iconsOnly />
                  </Box>

                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller ID:</strong><br /> {ticket.caller_id}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller Name:</strong><br /> {ticket.caller_Name}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Call Reason:</strong><br /> {ticket.call_reason}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Summary:</strong><br /> {ticket.summary}
                  </Typography>
                  <Typography>
                    <strong>Creation Date:</strong><br /> {new Date(ticket.creation_date).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <TicketAudio
                audioUrl={ticket.url_audio}
                title="Audio"
                status={status}
              />
            </Box>
          </Grid>
        {/**sx={{ maxHeight: 500, overflowY: 'auto' }} */}
        <Grid item>
            
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '380px', minWidth: '380px' }}>
              <TicketAssignee
                assigneeEmail={agentAssigned}
                status={status}
                onReassign={() => setOpenReassignAgentModal(true)}
                onChangeDepartment={() => setOpenChangeDepartmentModal(true)}
                onChangeCenter={() => setOpenCenterModal(true)}
              />
              <TicketCollaborators
                collaborators={ticket?.collaborators}
                onAddCollaborator={handleAddCollaboratorClick}
                onRemoveCollaborator={handleRemoveCollaborator}
                status={status}
              />
            </Box>

            <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
              <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      borderRadius: 10,
                      backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}
                  >
                    Time on Task
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', minWidth: '280px' }}>
                  <TicketWorkTime workTimeData={ticket.work_time} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog para agregar nota */}
      <AddNoteDialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        onSubmit={handleAddNote}
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      />

      {/**dialog para agentes */}
      <AgentSelectorDialog
        open={agentDialogOpen}
        onClose={() => setAgentDialogOpen(false)}
        onAdd={async (selectedAgents) => {
          await addCollaboratorUI(selectedAgents);          
        }}
        agents={agents}
        initialSelected={ticket?.collaborators}
      />

      {/*Dialog para reasignar agente*/}
      <ChangeAgentModal
        open={openReassignAgentModal}
        onClose={() => setOpenReassignAgentModal(false)}
        onReassignAgent={async (selectedAgent) => {
          await ticketAssigneeUI(selectedAgent);
        }}
        agents={agents}
      />

      {/*Dialog para reasignar departamento*/}
      <ChangeDepartmentModal
        open={openChangeDepartmentModal}
        onClose={() => setOpenChangeDepartmentModal(false)}
        onChangeDepartment={handleChangeDepartment}
      />

      {/**Dialog para transferir caso */}
      <ChangeCenterModal
        open={openCenterModal}
        onClose={() => setOpenCenterModal(false)}
        onChangeCenter={async (selectedCenter) => {
          await handleCenterHandlerUI(selectedCenter, ticket);
        }}
      />

      <RelateTicketModal
        open={openRelateModal}
        onClose={() => setOpenRelateModal(false)}
        relateTicketAction={relateTicketAction}
        onSelect={showActions}
        /*onSelect={async (selectedItem) => {
          console.log('Relate action:', relateTicketAction);
          console.log('Selected patient/provider:', selectedItem);

          await relateTicketHandler({
            dispatch,
            setLoading,
            ticketId,
            agentEmail,
            action: relateTicketAction,
            patientId: selectedItem?.id,
            ticketPhone: ticket?.phone,
            setSuccessMessage,
            setErrorMessage,
            setSuccessOpen,
            setErrorOpen
          });

          setOpenRelateModal(false);
        }}*/
      />

      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirmar acción"
        content="¿Estás seguro de que deseas realizar esta acción?"
        onCancel={() => setOpenConfirmDialog(false)}
        onConfirm={handleRelateAllActions}
      />

      <PatientProfileDialog
        open={openPatientDialog}
        onClose={() => setOpenPatientDialog(false)}
        patientName={patientName}
        patientDob={patientDob}
        patientPhone={patientPhone}
      />

      {/* Snackbars */}
      <AlertSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
        message={errorMessage}
      />
      <AlertSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
        message={successMessage}
      />
    </>
  );
}


