// src/components/topBar.js
import React, { useReducer, useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, IconButton,
  Tooltip, Stack, Fade
} from '@mui/material';
import AutocompleteFilter from './components/autoCompleteFilter';
import CollaboratorAutoComplete from './components/collaboratorAutocomplete';
import { icons } from '../components/icons';
import CreateTicketDialog from './dialogs/createTicketDialog';
import { createNewTicket } from '../utils/api';
import { useLoading } from './loadingProvider';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import AlertSnackbar from './alertSnackbar';


export default function Topbar({ agents, agent }) {
  const clinics = ['Wellmax Cutler Ridge', 'LMMC Homestead', 'Pasteur Hialeah Center', 'LMMC Hialeah West', 'Wellmax Marlings'];
  const [callerIds, setCallerIds] = useState([]);
  const [assignedAgents, setAssignedTo] = useState([]);
  const [date, setDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [open, setOpen] = useState(false);
  const { setLoading } = useLoading();
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const toggleFilters = () => setShowFilters((prev) => !prev);
  
  const handleSubmit = async (data) => {
    const form = {...data, agent_email: agent}

    setLoading(true);
    
      /*const newTicket = {
        ...form,
        data_all
      };*/

      console.log(form)
      // Simula un POST
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
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingY: 2, paddingX: 3, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="p" sx={{ minWidth: 160, color: 'text.secondary', fontWeight: 'bold' }}>
            Call Logs
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Fade in={showFilters} timeout={300}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  selectedEmails={assignedAgents}
                  onChange={setAssignedTo}
                  label="Assigned to"
                />
                <AutocompleteFilter
                  label="Caller ID"
                  options={clinics}
                  value={callerIds}
                  onChange={setCallerIds}
                />
              </Stack>
            </Fade>
            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={toggleFilters} color="text" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                {showFilters ? <icons.filterOn fontSize='small' /> : <icons.filterOff fontSize='small' />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Case">
              <IconButton  onClick={() => setOpen(true)} sx={{ padding: 0, height: 26, width: 36, '&:hover': { backgroundColor: 'transparent' } }}>
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
        handleOnSubmit={(data) => handleSubmit(data)}
        agentEmail={agent}
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
