import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { searchPatients, getTicketsByPatientId } from '../../../utils/apiPatients';
import MDVitaLocationSelect from '../mdvitaCenterSelect';
import SearchPatientResults from './searchPatientsResults';

const PAGE_SIZE = 50;

const SearchPatientDeepContainer = ({ queryPlaceholder = 'Search patients deeply...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [continuationToken, setContinuationToken] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedMDVitaLocation, setSelectedMDVitaLocation] = useState('');

  const observerRef = useRef(null);

  // ✅ Fetch patients
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
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedMDVitaLocation]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.length >= 2) {
        setPage(1);
        setResults([]);
        fetchPatients(inputValue, 1);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [inputValue, selectedMDVitaLocation, fetchPatients]);

  // ✅ Load more with IntersectionObserver
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

  // ✅ Handle patient click (fetch tickets)
  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
    setTickets([]);
    setTicketsLoading(true);
    try {
      const res = await getTicketsByPatientId({
        patientId: patient.id,
        limit: 10,
        continuationToken
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
      <Box sx={{ mt: 2 }}>
        <MDVitaLocationSelect
          value={selectedMDVitaLocation}
          onChange={(val) => setSelectedMDVitaLocation(val)}
          label="Location"
        />
      </Box>

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

      {/* ✅ Pasamos toda la lógica al componente presentacional */}
      <SearchPatientResults
        results={results}
        loading={loading}
        inputValue={inputValue}
        lastElementRef={lastElementRef}
        dialogOpen={dialogOpen}
        selectedPatient={selectedPatient}
        tickets={tickets}
        ticketsLoading={ticketsLoading}
        onPatientClick={handlePatientClick}
        onCloseDialog={handleCloseDialog}
      />
    </Box>
  );
};

export default SearchPatientDeepContainer;
