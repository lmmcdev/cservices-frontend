import React, { useReducer, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, IconButton,
  Tooltip, Stack, Fade
} from '@mui/material';
import CollaboratorAutoComplete from '../auxiliars/collaboratorAutocomplete';
import CallerIDAutoComplete from '../auxiliars/callerIDAutocomplete';
import { icons } from '../auxiliars/icons';
import CreateTicketDialog from '../dialogs/createTicketDialog';
import { createNewTicket } from '../../utils/apiTickets';
import { useLoading } from '../../providers/loadingProvider';
import { ticketReducer, initialState } from '../../store/ticketsReducer';
import AlertSnackbar from '../auxiliars/alertSnackbar';
import { useFilters } from '../../context/filterContext';
import { useAgents } from '../../context/agentsContext';
import SearchBar from '../searchBar';

export default function Topbar({ agent }) {
  const { state } = useAgents();
  const agents = state.agents;
  const { setLoading } = useLoading();
  const [, dispatch] = useReducer(ticketReducer, initialState);
  const [open, setOpen] = useState(false);
  const [activeUI, setActiveUI] = useState('filters'); // 'filters' | 'search' | null

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { filters, setFilters } = useFilters();

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleAssignedAgentsChange = (value) => {
    setFilters((prev) => ({ ...prev, assignedAgents: value }));
  };

  const toggleSearchBar = () => {
    setActiveUI((prev) => (prev === 'search' ? null : 'search'));
  };

  const toggleFilters = () => {
    setActiveUI((prev) => (prev === 'filters' ? null : 'filters'));
  };

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
        sx={{
          position: 'fixed',
          top: 40,
          left: 200,
          right: 20,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0px 4px 12px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingY: 2,
            paddingX: 3,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="p" sx={{ minWidth: 160, color: 'text.secondary', fontWeight: 'bold' }}>
            Call Logs
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {/* Filtros */}
            <Fade in={activeUI === 'filters'} timeout={300} unmountOnExit>
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
                <CallerIDAutoComplete
                  onChange={(value) => {
                    console.log('Seleccionado:', value);
                  }}
                  label="Caller ID"
                />
              </Stack>
            </Fade>

            {/* Search Bar */}
            <Fade in={activeUI === 'search'} timeout={300} unmountOnExit>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Stack>
            </Fade>

            {/* Botón de búsqueda */}
            <Tooltip title="Search">
              <IconButton
                onClick={toggleSearchBar}
                sx={{ '&:hover': { backgroundColor: 'transparent' } }}
              >
                {activeUI === 'search' ? (
                  <icons.searchOffIcon style={{ fontSize: '20px' }} />
                ) : (
                  <icons.searchIcon style={{ fontSize: '20px' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Botón para ocultar filtros */}
            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={toggleFilters} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                {activeUI === 'filters' ? <icons.filterOn fontSize="small" /> : <icons.filterOff fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Otros botones */}
            <Tooltip title="Add Case">
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ padding: 0, height: 26, width: 36, '&:hover': { backgroundColor: 'transparent' } }}
              >
                <icons.addCase style={{ fontSize: '17px' }} />
              </IconButton>
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

      <AlertSnackbar open={errorOpen} onClose={() => setErrorOpen(false)} severity="error" message={errorMessage} />
      <AlertSnackbar open={successOpen} onClose={() => setSuccessOpen(false)} severity="success" message={successMessage} />
    </>
  );
}
