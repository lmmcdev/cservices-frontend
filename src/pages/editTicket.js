import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, Grid, Card, CardContent, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';
import AlertSnackbar from '../components/alertSnackbar';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import { changeStatus, 
          addNotes, 
          updateCollaborators, 
          assignAgent, 
          updateTicketDepartment, 
          updatePatientName,
          updatePatientDOB, 
          updatePatientPhone} from '../utils/api';
import TicketNotes from '../components/ticketNotes';
import TicketCollaborators from '../components/ticketCollaborators';
import TicketAudio from '../components/ticketAudio';
import AddNoteDialog from '../components/dialogs/addNotesDialog';
import AgentSelectorDialog from '../components/dialogs/agentSelectorDialog';
import ProfilePic from '../components/components/profilePic';

export default function EditTicket({ agents }) {
  //constants 
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId, agentEmail } = useParams();
  const location = useLocation();
  const ticket = location.state?.ticket;

  //statuses
  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };
  const [patientDob, setPatientDob] = useState(formatDateForInput(ticket?.patient_dob));
  const [patientPhone, setPatientPhone] = useState(ticket?.phone || '');


  //state status
  const [openAgentOptions, setOpenAgentOptions] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [editField, setEditField] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dialogs
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);

  //useEffects
  useEffect(() => {
      if (state.error) setErrorOpen(true);
    }, [state.error]);
    
    useEffect(() => {
    if (ticket?.notes) {
      setNotes(ticket.notes);
    }
  }, [ticket]);

  

    //handling functions
    const handleStatusChange = async (newStatus) => {
      setLoading(true);
      await changeStatus(dispatch, setLoading, ticketId, agentEmail, newStatus);
      setStatus(newStatus);
      setSuccessOpen(true);
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
      await addNotes(dispatch, setLoading, ticketId, agentEmail, newNote);
      setNotes((prev) => [...prev, ...newNote]);
      setNoteContent('');
      setOpenNoteDialog(false);
      setSuccessOpen(true);
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
    await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
    setCollaborators(updated);
    setSuccessOpen(true);
  };


  //////////////////////////////////////////////////////////////////////////////
  const handleChangeDepartment = async (newDept) => {
    if (!newDept) return;
    await updateTicketDepartment(dispatch, setLoading, ticketId, agentEmail, newDept);
    setSuccessOpen(true);
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
      console.log("Fecha formateada (MM/DD/YYYY):", mmddyyyy);

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
  const updatePatientPhoneUI = async (newPhone) => {
    const result = await updatePatientPhone(dispatch, setLoading, ticketId, agentEmail, newPhone);
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
      <Paper elevation={3} sx={{ p: 4, width: '100%', mx: 'auto', mt: 20, ml: 15, mr: 3 }}>
        {/* Row 1: ActionsBar and ProfilePic */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TicketActionsBar
            onReassignAgent={() => setOpenAgentOptions(true)}
            onAddCollaborator={() => setAgentDialogOpen(true)}
            onReassignDepartment={() => console.log("Abrir reasignar departamento")}
          />
          <ProfilePic />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TicketStatusBar
                currentStatus={status}
                onStatusChange={handleStatusChange}
              />
            </Grid>

            <Grid size={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Patient Information</Typography>

                  {/* Nombre del paciente */}
                  <Box mt={1}>
                    <Typography variant="subtitle2">Patient</Typography>
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
                        <IconButton onClick={() => setEditField(null)}><CancelIcon /></IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>{ticket.patient_name}</Typography>
                        <IconButton onClick={() => setEditField('name')}><EditIcon fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </Box>

                  {/* Fecha de nacimiento */}
                  <Box mt={2}>
                    <Typography variant="subtitle2">Patient DOB</Typography>
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
                        <IconButton onClick={() => setEditField(null)}><CancelIcon /></IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>{ticket.patient_dob}</Typography>
                        <IconButton onClick={() => setEditField('dob')}><EditIcon fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </Box>

                  {/* Teléfono */}
                  <Box mt={2}>
                    <Typography variant="subtitle2">Phone</Typography>
                    {editField === 'phone' ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          size="small"
                          fullWidth
                        />
                        <IconButton
                          onClick={async () => {
                            await updatePatientPhoneUI(patientPhone);
                            setEditField(null);
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => setEditField(null)}><CancelIcon /></IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>{ticket.phone}</Typography>
                        <IconButton onClick={() => setEditField('phone')}><EditIcon fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </Box>

                </CardContent>
              </Card>
            </Grid>




            <Grid size={5}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Call Information</Typography>
                  <Typography><strong>Caller ID:</strong> {ticket.caller_id}</Typography>
                  <Typography><strong>Nombre del llamante:</strong> {ticket.caller_Name}</Typography>
                  <Typography><strong>Número para devolver llamada:</strong> {ticket.callback_number}</Typography>
                  <Typography><strong>Motivo de llamada:</strong> {ticket.call_reason}</Typography>
                  <Typography><strong>Fecha de creación:</strong> {new Date(ticket.creation_date).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={3}>
              <TicketCollaborators
                collaborators={collaborators}
                onAddCollaborator={handleAddCollaboratorClick}
                onRemoveCollaborator={handleRemoveCollaborator}
              />

            </Grid>

            <Grid size={4}>
              <TicketNotes notes={notes} onAddNote={() => setOpenNoteDialog(true)} />
            </Grid>

            <Grid size={5}>
              <TicketAudio audioUrl={ticket.url_audio} title="Call record" />
            </Grid>

            <Grid size={5}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Modal para opciones de agente */}
      <AgentOptionsModal
        open={openAgentOptions}
        onClose={() => setOpenAgentOptions(false)}
        onReassignAgent={async (selectedAgents) => {
          const updated = [...selectedAgents];
          await assignAgent(dispatch, setLoading, ticketId, agentEmail, updated);
          //setCollaborators(updated);
          setSuccessOpen(true);
        }}
        onChangeDepartment={handleChangeDepartment}
        agents={agents}
      />


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
          await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
          setCollaborators(updated);
          setAgentDialogOpen(false);
          setSuccessOpen(true);
        }}
        agents={agents}
        initialSelected={collaborators}
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
