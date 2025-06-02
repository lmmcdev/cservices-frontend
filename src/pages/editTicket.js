import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';
import AlertSnackbar from '../components/alertSnackbar';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import { changeStatus, addNotes, updateCollaborators, assignAgent, updateTicketDepartment } from '../utils/api';
import TicketNotes from '../components/ticketNotes';
import TicketCollaborators from '../components/ticketCollaborators';
import TicketAudio from '../components/ticketAudio';
import AddNoteDialog from '../components/dialogs/addNotesDialog';
import AgentSelectorDialog from '../components/dialogs/agentSelectorDialog';
import ProfilePic from '../components/components/profilePic';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00A1FF' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function EditTicket({ agents }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId, agentEmail } = useParams();
  const location = useLocation();
  const ticket = location.state?.ticket;

  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);

  const [openAgentOptions, setOpenAgentOptions] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);

  useEffect(() => {
    if (state.error) setErrorOpen(true);
  }, [state.error]);

  useEffect(() => {
    if (ticket?.notes) {
      setNotes(ticket.notes);
    }
  }, [ticket]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    await changeStatus(dispatch, setLoading, ticketId, agentEmail, newStatus);
    setStatus(newStatus);
    setSuccessOpen(true);
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    const newNote = [{
      agent_email: agentEmail,
      event_type: 'user_note',
      content: noteContent.trim(),
      datetime: new Date().toISOString(),
    }];
    await addNotes(dispatch, setLoading, ticketId, agentEmail, newNote);
    setNotes((prev) => [...prev, ...newNote]);
    setNoteContent('');
    setOpenNoteDialog(false);
    setSuccessOpen(true);
  };

  const handleAddCollaboratorClick = async () => {
    setAgentDialogOpen(true);
  };

  const handleRemoveCollaborator = async (emailToRemove) => {
    const updated = collaborators.filter((c) => c !== emailToRemove);
    await updateCollaborators(dispatch, setLoading, ticketId, agentEmail, updated);
    setCollaborators(updated);
    setSuccessOpen(true);
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
                <CardContent>
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
                      Patient Information
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Patient:</strong><br /> {ticket.patient_name}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Patient DOB:</strong><br /> {ticket.patient_dob}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong><br /> {ticket.phone}
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
                <CardContent>
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
                    <strong>Nombre del llamante:</strong><br /> {ticket.caller_Name}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Número para devolver llamada:</strong><br /> {ticket.callback_number}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Motivo de llamada:</strong><br /> {ticket.call_reason}
                  </Typography>
                  <Typography>
                    <strong>Fecha de creación:</strong><br /> {new Date(ticket.creation_date).toLocaleString()}
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

          <Grid item>
            <Box sx={{ width: '300px' }}>
              <TicketCollaborators
                collaborators={collaborators}
                onAddCollaborator={handleAddCollaboratorClick}
                onRemoveCollaborator={handleRemoveCollaborator}
                status={status}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Row 4: Cancel button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </Box>
      </Paper>

      {/* Modal para opciones de agente */}
      <AgentOptionsModal
        open={openAgentOptions}
        onClose={() => setOpenAgentOptions(false)}
        onReassignAgent={async (selectedAgents) => {
          const updated = [...selectedAgents];
          await assignAgent(dispatch, setLoading, ticketId, agentEmail, updated);
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

      {/* Dialog para seleccionar agentes */}
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
        message="Operation successful or no operations needed"
      />
    </>
  );
}
