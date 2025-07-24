import React, { useState, useCallback, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { searchTickets } from '../../../utils/apiTickets';
import { useAgents } from '../../../context/agentsContext';
import CallerIDAutoComplete from '../../auxiliars/callerIDAutocomplete';
import CollaboratorAutoComplete from '../../auxiliars/collaboratorAutocomplete';
import SearchTicketResults from './searchTicketsResults';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PAGE_SIZE = 50;

const SearchTicketDeep = ({ queryPlaceholder = 'Search tickets deeply...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]); // ✅ array de locaciones
  const [selectedAgents, setSelectedAgents] = useState([]); // ✅ array de agentes

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { state } = useAgents();
  const agents = state.agents;
  

  // ✅ Construir el filtro compatible con Azure Cognitive Search
  const buildFilter = () => {
    const parts = [];

    if (startDate) {
      parts.push(`createdAt ge ${dayjs(startDate).startOf('day').toISOString()}`);
    }
    if (endDate) {
      parts.push(`createdAt le ${dayjs(endDate).endOf('day').toISOString()}`);
    }
    if (selectedAgents.length > 0) {
      const agentFilter = selectedAgents
        .map(agent => `agent_assigned eq '${agent}'`)
        .join(' or ');
      parts.push(`${agentFilter}`);
    }

    // ✅ Si hay varias locaciones, usar OR entre ellas
    if (selectedLocations.length > 0) {
      const locationFilter = selectedLocations
        .map(loc => `assigned_department eq '${loc}'`)
        .join(' or ');
      parts.push(`${locationFilter}`);
    }

    return parts.length ? parts.join(' and ') : null;
  };



  // ✅ Función para traer resultados
  const fetchTickets = useCallback(
    async (pageNumber) => {
      const filter = buildFilter();
      const query = inputValue.trim() ? inputValue : '*';

      setLoading(true);
      try {
        const body = {
          query,
          page: pageNumber,
          size: PAGE_SIZE,
          ...(filter ? { filter } : {})
        };

        const res = await searchTickets(body);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, startDate, endDate, selectedLocations, selectedAgents]
  );

  // ✅ Disparar búsqueda en cambios
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setResults([]);
      fetchTickets(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, startDate, endDate, selectedLocations, selectedAgents,fetchTickets]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        <CallerIDAutoComplete onChange={setSelectedLocations} />
      </Box>

      <CollaboratorAutoComplete
          agents={agents}
          selectedEmails={selectedAgents}
          onChange={setSelectedAgents}
          label="Assigned to"
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newDate) => setStartDate(newDate)}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newDate) => setEndDate(newDate)}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Deep Tickets Search"
          placeholder={queryPlaceholder}
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Box>

      <SearchTicketResults
        results={results}
        loading={loading}
        inputValue={inputValue}
        hasMore={hasMore}
        loadMore={() => {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchTickets(nextPage);
        }}
      />
    </LocalizationProvider>
  );
};

export default SearchTicketDeep;
