// src/components/topBar.js
import React, { useReducer, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, IconButton,
  Tooltip, Stack, Fade
} from '@mui/material';
import CollaboratorAutoComplete from '../auxiliars/collaboratorAutocomplete';
import CallerIDAutoComplete from '../auxiliars/callerIDAutocomplete';
import { icons } from '../auxiliars/icons';
import CreateTicketDialog from '../dialogs/createTicketDialog';
import { createNewTicket } from '../../utils/api';
import { useLoading } from '../../providers/loadingProvider';
import { ticketReducer, initialState } from '../../store/ticketsReducer';
import AlertSnackbar from '../auxiliars/alertSnackbar';
import { useFilters } from '../../utils/js/filterContext';
//agentes desde el estado
import { useAgents } from '../components/agentsContext';

export default function Topbar({ agent }) {
  const { state } = useAgents(); // agentes desde el estado
  const agents = state.agents;
  const { setLoading } = useLoading();
  const [, dispatch] = useReducer(ticketReducer, initialState);
  const [open, setOpen] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showFilters, setShowFilters] = useState(true);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  const { filters, setFilters } = useFilters();

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleAssignedAgentsChange = (value) => {
    setFilters((prev) => ({ ...prev, assignedAgents: value }));
  };

  /*const handleCallerIdsChange = (value) => {
    setFilters((prev) => ({ ...prev, callerIds: value }));
  };*/

  const handleSubmit = async (data) => {
    const form = { ...data, agent_email: agent };
    setLoading(true);

    const result = await createNewTicket(dispatch, setLoading, form);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          position: 'fixed',
          top: 40,
          left: 200,
          right: 20,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <CardContent sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: 2,
          paddingX: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Typography variant="p" sx={{ minWidth: 160, color: 'text.secondary', fontWeight: 'bold' }}>
            Call Logs
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Fade in={showFilters} timeout={300}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  type="date"
                  value={filters.date}
                  onChange={handleDateChange}
                  sx={{
                    width: 240,
                    '& input': {
                      paddingY: 0,
                      fontSize: 12,
                      color: 'text.secondary',
                      height: 36,
                      boxSizing: 'border-box',
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'text.secondary', fontSize: 12 },
                  }}
                />
                <CollaboratorAutoComplete
                  agents={agents}
                  selectedEmails={filters.assignedAgents}
                  onChange={handleAssignedAgentsChange}
                  label="Assigned to"
                />
                <CallerIDAutoComplete onChange={(value) => {
                    console.log('Seleccionado:', value);
                  }} label='Caller ID' 
                />
                
              </Stack>
            </Fade>
            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={toggleFilters} color="text" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                {showFilters ? <icons.filterOn fontSize='small' /> : <icons.filterOff fontSize='small' />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Case">
              <IconButton onClick={() => setOpen(true)} sx={{ padding: 0, height: 26, width: 36, '&:hover': { backgroundColor: 'transparent' } }}>
                <icons.addCase style={{ fontSize: '17px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Perfil de usuario">
              <IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                <icons.supervisorView style={{ fontSize: '17px' }} />
              </IconButton >
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      <CreateTicketDialog
        open={open}
        onClose={() => setOpen(false)}
        handleOnSubmit={handleSubmit}
        agentEmail={agent}
      />

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
