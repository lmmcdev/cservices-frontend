// src/components/auxiliars/topbar.jsx
import React, { useReducer, useState, useRef, useLayoutEffect } from 'react';
import {
  Card, CardContent, Typography, TextField, IconButton,
  Tooltip, Stack, Fade, Box, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DialpadIcon from '@mui/icons-material/Dialpad';

import CollaboratorAutoComplete from '../fields/collaboratorAutocomplete';
import CallerIDAutoComplete from '../fields/callerIDAutocomplete';
import { icons } from '../auxiliars/icons';
import CreateTicketDialog from '../dialogs/createTicketDialog';
import { createNewTicket } from '../../utils/apiTickets';
import { useLoading } from '../../providers/loadingProvider';
import { ticketReducer, initialState } from '../../store/ticketsReducer';
import AlertSnackbar from '../auxiliars/alertSnackbar';
import { useFilters } from '../../context/filterContext';
import { useAgents } from '../../context/agentsContext';
import DialerModal from '../dialogs/dialerModal';
import { defaultLocationOptions } from '../../utils/js/constants';

const BRAND = '#00a1ff';
const BORDER_IDLE = '#e0e7ef';

export default function Topbar({ agent }) {
  const { state } = useAgents();
  const agents = state.agents;
  const { setLoading } = useLoading();
  const [, dispatch] = useReducer(ticketReducer, initialState);
  const [open, setOpen] = useState(false);
  const [dialerOpen, setDialerOpen] = useState(false);
  const [activeUI, setActiveUI] = useState('filters');

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { filters, setFilters } = useFilters();

  // refs para medir “Assigned to” y “Caller ID”
  const assignedRef = useRef(null);
  const callerRef = useRef(null);

  // tamaño a igualar (date + search)
  const [eqWidth, setEqWidth] = useState(260);
  const [eqHeight, setEqHeight] = useState(40);

  useLayoutEffect(() => {
    const w1 = assignedRef.current?.offsetWidth || 0;
    const w2 = callerRef.current?.offsetWidth || 0;
    const h1 = assignedRef.current?.offsetHeight || 0;
    const h2 = callerRef.current?.offsetHeight || 0;

    const w = Math.max(w1, w2) || eqWidth;
    const h = Math.max(h1, h2) || eqHeight;

    if (w && w !== eqWidth) setEqWidth(w);
    if (h && h !== eqHeight) setEqHeight(h);
  }, [activeUI, filters.assignedAgents, filters.callerIds, agents.length]); // eslint-disable-line

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  };
  const handleAssignedAgentsChange = (value) => {
    setFilters((prev) => ({ ...prev, assignedAgents: value }));
  };
  const handleCallerIdChange = (value) => {
    setFilters((prev) => ({ ...prev, callerIds: value }));
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
          left: 'calc(var(--drawer-width, 80px) + var(--content-gap))',
          right: 39,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0px 4px 12px rgba(239, 241, 246, 1)',
          transition: 'left .3s ease',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: 3,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="p" sx={{ minWidth: 160, color: 'text.secondary', fontWeight: 'bold' }}>
            Call Logs
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Fade in={activeUI === 'filters'} timeout={300} unmountOnExit>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                {/* Date con igual ancho/alto */}
                <TextField
                  size="small"
                  type="date"
                  value={filters.date}
                  onChange={handleDateChange}
                  sx={{
                    width: eqWidth,
                    '& .MuiOutlinedInput-root': { height: eqHeight },
                    '& .MuiInputBase-input': {
                      height: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 14px',
                      fontSize: 14,
                      color: 'text.secondary',
                    },
                  }}
                  InputLabelProps={{ shrink: true }}
                />

                {/* medimos estos sin tocar su estilo */}
                <Box ref={assignedRef} sx={{ display: 'inline-flex' }}>
                  <CollaboratorAutoComplete
                    agents={agents}
                    selectedEmails={filters.assignedAgents}
                    onChange={handleAssignedAgentsChange}
                    label="Assigned to"
                  />
                </Box>

                <Box ref={callerRef} sx={{ display: 'inline-flex' }}>
                  <CallerIDAutoComplete
                    onChange={handleCallerIdChange}
                    options={defaultLocationOptions}
                    label="Caller ID"
                  />
                </Box>
              </Stack>
            </Fade>

            {/* 🔎 Search: reemplazado por TextField MUI para centrar texto y unificar look */}
            <Fade in={activeUI === 'search'} timeout={300} unmountOnExit>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: eqWidth }}>
                  <TextField
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: BRAND }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: eqHeight,
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_IDLE },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND, borderWidth: 2 },
                      },
                      '& .MuiInputBase-input': {
                        height: '100%',
                        boxSizing: 'border-box',
                        padding: '8px 14px',
                        fontSize: 14, // 👈 font más grande y centrado
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Fade>

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

            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={toggleFilters} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                {activeUI === 'filters' ? <icons.filterOn fontSize="small" /> : <icons.filterOff fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Add Case">
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ p: 0, height: 26, width: 36, '&:hover': { backgroundColor: 'transparent' } }}
              >
                <icons.addCase style={{ fontSize: '17px' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open dialer">
              <IconButton
                onClick={() => setDialerOpen(true)}
                sx={{ p: 0, height: 26, width: 36, color: BRAND, '&:hover': { backgroundColor: 'transparent' } }}
              >
                <DialpadIcon style={{ fontSize: '20px' }} />
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

      <DialerModal open={dialerOpen} onClose={() => setDialerOpen(false)} />

      <AlertSnackbar open={errorOpen} onClose={() => setErrorOpen(false)} severity="error" message={errorMessage} />
      <AlertSnackbar open={successOpen} onClose={() => setSuccessOpen(false)} severity="success" message={successMessage} />
    </>
  );
}
