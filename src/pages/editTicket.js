// src/pages/EditTicket.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper
} from '@mui/material';
import TicketStatusBar from '../components/ticketStatusBar';
import TicketActionsBar from '../components/ticketActionsBar';
import AgentOptionsModal from '../components/dialogs/agentOptionsModal';

export default function EditTicket() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ticket = state?.ticket;
  const [status, setStatus] = useState(ticket.status);
  const [openAgentOptions, setOpenAgentOptions] = useState(false);


  
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // TODO: llamar API para guardar el nuevo estado
    console.log('Estado cambiado a:', newStatus);
  };

  const [form, setForm] = useState({ ...ticket });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Aquí llamarías a tu función para actualizar en la base de datos
      console.log('Saving...', form);
      navigate(-1); // o navigate('/tickets') si prefieres
    } catch (err) {
      console.error('Error updating ticket:', err);
    }
  };

  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
    <Paper elevation={3} sx={{ p: 4, width:'100%', mx: 'auto', mt: 20, ml:15, mr:3 }}>

        <TicketActionsBar
            onReassignAgent={() => setOpenAgentOptions(true)}
            onAddCollaborator={() => console.log("Abrir agregar colaborador")}
            onReassignDepartment={() => console.log("Abrir reasignar departamento")}
        />

        <TicketStatusBar
          currentStatus={status}
          onStatusChange={handleStatusChange}
        />
      <Typography variant="h5" gutterBottom>Editar Ticket</Typography>

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
        label="Estado"
        name="status"
        value={form.status || ''}
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

    </>
  );
}
