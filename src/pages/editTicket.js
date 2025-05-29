import React, { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper
} from '@mui/material';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';
import AlertSnackbar from '../components/alertSnackbar';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import { changeStatus } from '../utils/api';

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

  /**manejar los estados de error */
  useEffect(() => {
    if (state.error) {
      setErrorOpen(true);
    }
  }, [state.error]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setStatus(newStatus);
    await changeStatus(dispatch, setLoading, ticketId, agentEmail, newStatus);
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
      navigate(-1);
    } catch (err) {
      console.error('Error updating ticket:', err);
    }
  };

  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, width: '100%', mx: 'auto', mt: 20, ml: 15, mr: 3 }}>
        <TicketActionsBar
          onReassignAgent={() => setOpenAgentOptions(true)}
          onAddCollaborator={() => console.log("Abrir agregar colaborador")}
          onReassignDepartment={() => console.log("Abrir reasignar departamento")}
        />

        <TicketStatusBar
          currentStatus={status}
          onStatusChange={handleStatusChange}
        />

        <TextField
          fullWidth
          label="Paciente"
          name="patient_name"
          value={form.patient_name || ''}
          onChange={handleChange}
          sx={{ my: 2 }}
        />

        <TextField
          fullWidth
          label="Descripción"
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ my: 2 }}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Guardar Cambios</Button>
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
