import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Typography, Paper, Grid, Card, CardContent,
} from '@mui/material';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';
import AlertSnackbar from '../components/alertSnackbar';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import { changeStatus, addNotes, updateCollaborators, assignAgent } from '../utils/api';
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

  //state status
  const [openAgentOptions, setOpenAgentOptions] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

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

  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, width: '100%', mx: 'auto', mt: 20, ml: 15, mr: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            
            <Grid size={11}>
              
              <TicketActionsBar
                onReassignAgent={() => setOpenAgentOptions(true)}
                onAddCollaborator={() => setAgentDialogOpen(true)}  // <- cambio aquí
                onReassignDepartment={() => console.log("Abrir reasignar departamento")}
              />
              
            </Grid>
            <Grid size={1}><ProfilePic /></Grid>
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
                  <Typography><strong>Patient:</strong><br /> {ticket.patient_name}</Typography>
                  <Typography><strong>Patient DOB:</strong><br /> {ticket.patient_dob}</Typography>
                  <Typography><strong>Phone:</strong><br /> {ticket.phone}</Typography>
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
        onAddCollaborator={async (selectedAgent) => {
          const updated = [...collaborators, selectedAgent].filter((v, i, a) => a.indexOf(v) === i);
          await assignAgent(dispatch, setLoading, ticketId, agentEmail, updated);
          setCollaborators(updated);
          setSuccessOpen(true);
        }}
        onChangeDepartment={() => console.log("Abrir reasignar departamento")}
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
        message={state.error}
      />
      <AlertSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
        message="Operation successfull or no operations needed"
      />
    </>
  );
}
