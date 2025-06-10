import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Card, CardContent, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TicketStatusBar from '../components/ticketStatusBar';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { useLoading } from '../providers/loadingProvider';
import { changeStatus, 
          addNotes, 
          updateCollaborators, 
          assignAgent, 
          updateTicketDepartment, 
          updatePatientName,
          updatePatientDOB, 
          updateCallbackNumber} from '../utils/api';
import TicketNotes from '../components/ticketNotes';
import TicketCollaborators from '../components/ticketCollaborators';
import TicketAudio from '../components/ticketAudio';
import AddNoteDialog from '../components/dialogs/addNotesDialog';
import AgentSelectorDialog from '../components/dialogs/agentSelectorDialog';
import ActionButtons from '../components/auxiliars/actionButtons';
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


const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00b8a3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function EditTicket() {
  //constants 
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const location = useLocation();
  const ticket = location.state?.ticket;
  const [ agentAssigned, setAgentAssigned ] = useState(ticket?.agent_assigned || '');
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { user } = useAuth();
  const agentEmail = user.username;
  //console.log(supEmail)
  

  //statuses
  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  
  const formatDateForInput = (dateStr = '01-01-1901') => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
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
  //const [relatedCases, setRelatedCases] = useState([]);
  useWorkTimer( {ticketData:ticket, agentEmail, status, enabled:true} );

  //useEffects
  useEffect(() => {
      if (state.error) setErrorOpen(true);
    }, [state.error]);
    
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
      /*if(ticket.status === "New") {
        handleStatusChange("In Progress")
      }*/
    }
  }, [ticket]);
  
  //introducir un modal aqui
  if (!ticket) return <Typography>Ticket not found</Typography>;

    //handling functions
    const handleStatusChange = async (newStatus) => {
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
    };
    ///////////////////////////////////////////////////////////////////////
    const handleAddNote = async () => {
      if (!noteContent.trim()) return;
      const newNote = [{
        agent_email: agentEmail,
        event_type: 'user_note',
        content: noteContent.trim(),
        datetime: new Date().toISOString()
      }];
      const result = await addNotes(dispatch, setLoading, ticketId, agentEmail, newNote);
      if (result.success) {
        setNotes((prev) => [...prev, ...newNote]);
        setNoteContent('');
        setOpenNoteDialog(false);
        setSuccessMessage(result.message);
        setSuccessOpen(true);
      } else {
        setErrorMessage(result.message);
        setErrorOpen(true);
      }
      
    };
    ////////////////////////////////////////////////////////////////////////////
    const handleAddCollaboratorClick = async (newCollaborator) => {
      setAgentDialogOpen(true);
    /*const updated = [...collaborators, newCollaborator];
    await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
    setCollaborators(updated); // actualiza UI local si fue exitoso
    setSuccessOpen(true);*/
  };

  const handleRemoveCollaborator = async (emailToRemove) => {
    const updated = collaborators.filter(c => c !== emailToRemove);
    const result = await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
      setCollaborators(updated);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
    setEditField(null);
    
  };


  //////////////////////////////////////////////////////////////////////////////
  const handleChangeDepartment = async (newDept) => {
    if (!newDept) return;
    const result = await updateTicketDepartment(dispatch, setLoading, ticketId, agentEmail, newDept);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
    setEditField(null);
  };

  //////////////////////////////////////////////////////////////////////////////
  const handleChangeCenter = async (newCenter) => {
    alert(newCenter)
    /*if (!newDept) return;
    const result = await updateTicketDepartment(dispatch, setLoading, ticketId, agentEmail, newDept);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
    setEditField(null);*/
  };

  /////////////////////Update Patient Fields///////////////////////////////////////////////////////
  ///////////patient name///////////////////////
  const updatePatientNameUI = async (newName) => {
    const result = await updatePatientName(dispatch, setLoading, ticketId, agentEmail, newName);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
    setEditField(null);
  };

  ////////////patient dob///////////////////////
  const updatePatientDobUI = async (newDob) => {
    if (!newDob) {
      setErrorMessage("La fecha de nacimiento está vacía.");
      setErrorOpen(true);
      return;
    }

    try {
      // Convertir "YYYY-MM-DD" → "MM/DD/YYYY"
      const [year, month, day] = newDob.split('-');
      const mmddyyyy = `${month}/${day}/${year}`;

      // Validación rápida en frontend
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!regex.test(mmddyyyy)) throw new Error("Formato de fecha inválido");

      // Llamar al backend con el nuevo formato
      const result = await updatePatientDOB(dispatch, setLoading, ticketId, agentEmail, mmddyyyy);

      if (result.success) {
        setSuccessMessage(result.message);
        setSuccessOpen(true);
      } else {
        setErrorMessage(result.message);
        setErrorOpen(true);
      }
    } catch (err) {
      setErrorMessage("Error al procesar la fecha: " + err.message);
      setErrorOpen(true);
    }

    setEditField(null);
  };


  ///////////patient phone////////////////////////////////
  const updatecallbakNumberUI = async (newPhone) => {
    const result = await updateCallbackNumber(dispatch, setLoading, ticketId, agentEmail, newPhone);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
    setEditField(null);
  };


  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
      <Paper
        sx={{
          p: 4,
          width: '100%',
          mx: 'auto',
          ml: 15,
          mr: 3,
          borderRadius: 4,
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)', 
          backgroundColor: '#fff',
        }}
      >
        {/* Row 2: StatusBar */}
        <Box sx={{ mb: 2 }}>
          <TicketStatusBar currentStatus={status} onStatusChange={handleStatusChange} />
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
                          backgroundColor: statusColors[status]?.text || '#00a1ff',
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}
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
                  <Typography>
                    <strong>CallBack Number:</strong><br />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 24,
                        borderRadius: 10,
                        backgroundColor: statusColors[status]?.text || '#00a1ff',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}
                    >
                      Call Information
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller ID:</strong><br /> {ticket.caller_id}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller Name:</strong><br /> {ticket.caller_Name}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Phone:</strong><br /> {ticket.phone}
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
            
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '350px' }}>
              <TicketAssignee
                assigneeEmail={agentAssigned}
                status={status}
                onReassign={() => setOpenReassignAgentModal(true)}
                onChangeDepartment={() => setOpenChangeDepartmentModal(true)}
                onChangeCenter={() => setOpenCenterModal(true)}
              />
              <TicketCollaborators
                collaborators={collaborators}
                onAddCollaborator={handleAddCollaboratorClick}
                onRemoveCollaborator={handleRemoveCollaborator}
                status={status}
              />
            </Box>

            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      borderRadius: 10,
                      backgroundColor: statusColors[status]?.text || '#00a1ff',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}
                  >
                    Time on Task
                  </Typography>
                </Box>
                <TicketWorkTime workTimeData={ticket.work_time} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Row 4: Cancel button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <ActionButtons onCancel={() => navigate(-1)} />
        </Box>
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
          const updated = [...collaborators, ...selectedAgents.filter(a => !collaborators.includes(a))];
          const result = await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
          if (result.success) {
            setSuccessMessage(result.message);
            setSuccessOpen(true);
            setCollaborators(updated);
          } else {
            setErrorMessage(result.message);
            setErrorOpen(true);
          }
          
        }}
        agents={agents}
        initialSelected={collaborators}
      />

      {/*Dialog para reasignar agente*/}
      <ChangeAgentModal
        open={openReassignAgentModal}
        onClose={() => setOpenReassignAgentModal(false)}
        onReassignAgent={async (selectedAgents) => {
          //const updated = [...selectedAgents];
          //console.log(selectedAgents)
          const result = await assignAgent(dispatch, setLoading, ticketId, agentEmail, selectedAgents);
          if (result.success) {
            setSuccessMessage(result.message);
            setSuccessOpen(true);
            setAgentAssigned(selectedAgents);
          } else {
            setErrorMessage(result.message);
            setErrorOpen(true);
          }
          setSuccessOpen(true);
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
        onchangeCenter={handleChangeCenter}
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
