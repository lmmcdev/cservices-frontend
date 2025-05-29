import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Grid, Card, CardContent, Divider, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';
import AlertSnackbar from '../components/alertSnackbar';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import { changeStatus } from '../utils/api';
import TicketNotes from '../components/ticketNotes';
import TicketCollaborators from '../components/ticketCollaborators';
import TicketAudio from '../components/ticketAudio';

export default function EditTicket() {
    const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { ticketId, agentEmail } = useParams();
  const location = useLocation();
  const ticket = location.state?.ticket;

  const [status, setStatus] = useState(ticket?.status || '');
  const [form, setForm] = useState({ ...ticket });
  const [openAgentOptions, setOpenAgentOptions] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (state.error) setErrorOpen(true);
  }, [state.error]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    await changeStatus(dispatch, setLoading, ticketId, agentEmail, newStatus);
    setStatus(newStatus);
    setSuccessOpen(true);
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Saving...', form);
      setSuccessOpen(true);
      navigate(-1);
    } catch (err) {
      console.error('Error updating ticket:', err);
    }
  };

  const handleAddCollaborator = () => {
    // Lógica de agregar colaborador → usar modal u otra interfaz
    console.log("Agregar colaborador");
  };

  const handleRemoveCollaborator = (email) => {
    // Lógica para eliminar colaborador
    console.log("Eliminar colaborador:", email);
  };

  const handleAddNote = () => {
    // Lógica de agregar nota
    console.log("Agregar nota");
  };

  if (!ticket) return <Typography>Ticket not found</Typography>;
  console.log(ticket)
  return (
    <>
    
      <Paper elevation={3} sx={{ p: 4, width: '100%', mx: 'auto', mt: 20, ml: 15, mr: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12} height='50%'>
              <TicketActionsBar
                onReassignAgent={() => setOpenAgentOptions(true)}
                onAddCollaborator={() => console.log("Abrir agregar colaborador")}
                onReassignDepartment={() => console.log("Abrir reasignar departamento")}
              />
            </Grid>

            <Grid size={12} height='50%'>
              <TicketStatusBar
                currentStatus={status}
                onStatusChange={handleStatusChange}
              />
            </Grid>

            <Grid size={4} height='50%'>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Patient Information</Typography>
                  <Typography><strong>Patient:</strong><br /> {ticket.patient_name}</Typography>
                  <Typography><strong>Patient DOB:</strong><br /> {ticket.patient_dob}</Typography>
                  <Typography><strong>Phone:</strong><br /> {ticket.phone}</Typography>
                </CardContent>
              </Card>
            </Grid>
          
            <Grid size={5} height='50%'>
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

            <Grid size={3} height='50%'>
              <TicketCollaborators
                collaborators={ticket?.collaborators || []}
                onAddCollaborator={handleAddCollaborator}
                onRemoveCollaborator={handleRemoveCollaborator}
              />
            </Grid>

            <Grid size={4} height='50%'>
              <TicketNotes notes={ticket.notes} onAddNote={handleAddNote} />
            </Grid>

            <Grid size={5} height='50%'>
              <TicketAudio audioUrl={ticket.url_audio} title="Call record"/>    
            </Grid>

            <Grid size={5} height='50%'>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
              </Box>
            </Grid>
        </Grid>
        </Box>
      </Paper>

      <AgentOptionsModal
        open={openAgentOptions}
        onClose={() => setOpenAgentOptions(false)}
        onReassignAgent={() => console.log('Reasignar agente')}
        onAddCollaborator={() => console.log('Agregar colaborador')}
        onChangeDepartment={() => console.log('Cambiar departamento')}
      />

      {/* Snackbar para errores */}
      <AlertSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
        message={state.error}
      />
    </>
  );
}
