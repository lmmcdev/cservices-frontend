import React, { useState, useEffect } from 'react';
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
import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CategoryIcon from '@mui/icons-material/Category';

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
  handleCenterHandler
} from '../utils/js/ticketActions.js';

import { getStatusColor } from '../utils/js/statusColors.js';

export default function EditTicket() {
  //constants 
  const { state:ticketsAll, dispatch } = useTickets();
  const tickets = ticketsAll.tickets;
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  

  //agarrando el ticket del contexto
  const ticket = tickets.find(t => t.id === ticketId);
  const [ agentAssigned, setAgentAssigned ] = useState(ticket?.agent_assigned || '');
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { user } = useAuth();
  const agentEmail = user.username;
  
  //statuses
  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  
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

  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  useWorkTimer( {ticketData:ticket, agentEmail, status, enabled:true} );

   
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
    }
  }, [ticket]);
  
  const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high': return '#d32f2f';     // rojo
      case 'normal': return '#fbc02d';   // amarillo
      case 'low': return '#388e3c';      // verde
      default: return '#bdbdbd';         // gris
    }
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'none': return '#4caf50';         // verde
      case 'legal': return '#ff9800';        // naranja
      case 'desenrollment': return '#f44336'; // rojo
      default: return '#bdbdbd';             // gris
    }
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    switch (cat) {
      case 'transport': return <DirectionsCarIcon fontSize="small" />;
      case 'appointment': return <EventIcon fontSize="small" />;
      case 'new patient': return <PersonAddIcon fontSize="small" />;
      case 'desenrollment': return <PersonOffIcon fontSize="small" />;
      case 'personal attention': return <SupportAgentIcon fontSize="small" />;
      case 'new direction': return <AltRouteIcon fontSize="small" />;
      case 'others': return <CategoryIcon fontSize="small" />;
      default: return <CategoryIcon fontSize="small" />; // <-- esto es importante
    }
  };

  //introducir un modal aqui
  if (!ticket) return <Typography>Ticket not found</Typography>;

    //handling functions
    const handleStatusChangeUI = async (newStatus) => {
      handleStatusChange({ dispatch, setLoading, ticketId, agentEmail, newStatus, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen });
    };
    ///////////////////////////////////////////////////////////////////////
    const handleAddNote = async () => {
      await handleAddNoteHandler({dispatch, setLoading, ticketId, agentEmail, noteContent, setNotes, setNoteContent, setOpenNoteDialog, setStatus, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    };
    ////////////////////////////////////////////////////////////////////////////
    const handleAddCollaboratorClick = async (newCollaborator) => {
      setAgentDialogOpen(true);
    };

  const handleRemoveCollaborator = async (emailToRemove) => {
    await handleRemoveCollaboratorHandler({dispatch, setLoading, ticketId, agentEmail, collaborators, emailToRemove, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  //////////////////////////////////////////////////////////////////////////////
  const handleChangeDepartment = async (newDept) => {
    await handleChangeDepartmentHandler({dispatch, setLoading, ticketId, agentEmail, newDept, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  /////////////////////Update Patient Fields///////////////////////////////////////////////////////
  ///////////patient name///////////////////////
  const updatePatientNameUI = async (newName) => {
    await updatePatientNameHandler({dispatch, setLoading, ticketId, agentEmail, newName, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  ////////////patient dob///////////////////////
  const updatePatientDobUI = async (newDob) => {
    await updatePatientDobHandler({dispatch, setLoading, ticketId, agentEmail, newDob, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };


  ///////////patient phone////////////////////////////////
  const updatecallbakNumberUI = async (newPhone) => {
    await updateCallbackNumberHandler({dispatch, setLoading, ticketId, agentEmail, newPhone, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  ///////////add ticket collaborator////////////////////////////////
  const addCollaboratorUI = async (selectedAgents) => {
    await updateCollaboratorsHandler({dispatch, setLoading, ticketId, agentEmail, collaborators, selectedAgents, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  ///////////add ticket collaborator////////////////////////////////
  const ticketAssigneeUI = async (selectedAgent) => {
    await updateAssigneeHandler({dispatch, setLoading, ticketId, agentEmail, selectedAgent, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };

  ///////////add ticket collaborator////////////////////////////////
  const handleCenterHandlerUI = async (selectedCenter, ticket) => {
    await handleCenterHandler({dispatch, setLoading, ticketId, ticket, agentEmail, selectedCenter, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
    setEditField(null);
  };



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
          overflow: 'hidden',
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
                    onClick={() => navigate('/dashboard')}
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
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}
                      >
                        Patient Information
                      </Typography>
                    </Box>

                    <Tooltip title="View Profile">
                      <IconButton onClick={() => setOpenPatientDialog(true)} size="small" sx={{ color: '#00a1ff' }}>
                        <i className="fa fa-id-card" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
                  <Typography sx={{ mb: 1 }}>
                    <strong>Patient DOB:</strong><br /> 
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
                            await updatecallbakNumberUI(callbakNumber);
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
                      {/* PRIORITY */}
                      <Tooltip title={`Priority: ${ticket.priority || 'N/A'}`}>
                        <FlagIcon sx={{ color: getPriorityColor(ticket.priority), fontSize: 20 }} />
                      </Tooltip>

                      {/* RISK */}
                      <Tooltip title={`Risk: ${ticket.risk || 'N/A'}`}>
                        <ReportProblemIcon sx={{ color: getRiskColor(ticket.risk), fontSize: 20 }} />
                      </Tooltip>

                      {/* CATEGORY */}
                      <Tooltip title={`Category: ${ticket.category || 'N/A'}`}>
                        {getCategoryIcon(ticket.category)}
                      </Tooltip>
                    </Box>
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
