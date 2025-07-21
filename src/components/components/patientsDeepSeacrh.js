import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { searchPatients, getTicketsByPatientId } from '../../utils/apiPatients';
import MDVitaLocationSelect from './mdvitaCenterSelect';

const PAGE_SIZE = 30;

const SearchPatientDeep = ({ queryPlaceholder = 'Search patients deeply...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [continuationToken, setContinuationToken] = useState(null);
  const observerRef = useRef(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedMDVitaLocation, setSelectedMDVitaLocation] = useState('');

  // ✅ Fetch Patients
  const fetchPatients = useCallback(
    async (searchTerm, pageNumber) => {
      if (!searchTerm || searchTerm.length < 2) return;

      setLoading(true);
      try {
        const res = await searchPatients(searchTerm, pageNumber, PAGE_SIZE, selectedMDVitaLocation);
        const data = res?.message?.value || [];

        if (pageNumber === 1) {
          setResults(data);
        } else {
          setResults((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error('Error in deep search:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedMDVitaLocation]
  );

  // ✅ Efecto para disparar búsqueda cada vez que cambia inputValue o location
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.length >= 2) {
        setPage(1);
        setResults([]);
        fetchPatients(inputValue, 1);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(handler);
  }, [inputValue, selectedMDVitaLocation, fetchPatients]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPatients(inputValue, nextPage);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, inputValue, page, fetchPatients]
  );

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
    setTickets([]);
    setTicketsLoading(true);
    try {
      const res = await getTicketsByPatientId({
        patientId: patient.id,
        limit: 10,
        continuationToken: continuationToken
      });

      const { items, continuationToken: nextToken } = res.message;
      setContinuationToken(nextToken || null);
      setTickets((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });
      setHasMore(!!nextToken);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(null);
    setTickets([]);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* ✅ Selector de ubicación */}
      <Box sx={{ mt: 2 }}>
        <MDVitaLocationSelect
          value={selectedMDVitaLocation}
          onChange={(val) => setSelectedMDVitaLocation(val)}
          label="Location"
        />
      </Box>

      {/* ✅ Buscador */}
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Deep Patient Search"
          placeholder={queryPlaceholder}
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Box>

      {/* ✅ Resultados */}
      <Box sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto' }}>
        {results.map((patient, index) => {
          const isLast = index === results.length - 1;
          return (
            <Card
              key={patient.id || index}
              ref={isLast ? lastElementRef : null}
              sx={{ mb: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f9f9f9' } }}
              onClick={() => handlePatientClick(patient)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {patient.Name || 'No name'}
                </Typography>
                <Typography variant="body2">DOB: {patient.DOB || 'N/A'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Email: {patient.Email || 'N/A'}
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Location: {patient.Location_Name || 'N/A'} -|- PCP: {patient.PCP || 'N/A'}
                </Typography>
                <Typography variant="caption">
                  Language: {patient.Language || 'N/A'} | Gender: {patient.Gender || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && results.length === 0 && inputValue.length >= 2 && (
          <Typography sx={{ textAlign: 'center', mt: 2 }}>No results found.</Typography>
        )}
      </Box>

      {/* ✅ Dialog Tickets */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tickets for {selectedPatient?.Name || 'Patient'}
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '60vh' }}>
          {ticketsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : tickets.length === 0 ? (
            <Typography>No tickets found for this patient.</Typography>
          ) : (
            <List>
              {tickets.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  divider
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
                >
                  <Box sx={{ flex: 2, maxWidth: '60%' }}>
                    <Tooltip title={ticket.call_reason || 'No Reason'}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        noWrap
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {ticket.call_reason || 'No Reason'}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary">
                      Status: {ticket.status} | Created: {ticket.creation_date}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, maxWidth: '35%', textAlign: 'right' }}>
                    <Tooltip title={ticket.agent_assigned || 'No Assigned Agent'}>
                      <Typography
                        variant="body1"
                        noWrap
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {ticket.agent_assigned || 'No Assigned Agent'}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      Caller ID: {ticket.caller_id} - {ticket.assigned_department}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SearchPatientDeep;
