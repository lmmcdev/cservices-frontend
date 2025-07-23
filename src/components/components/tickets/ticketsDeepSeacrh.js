import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
} from '@mui/material';
import { searchTickets } from '../../../utils/apiTickets';
import CallerIDAutoComplete from '../../auxiliars/callerIDAutocomplete';
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
  const [selectedMDVitaLocation, setSelectedMDVitaLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const buildFilter = () => {
    const parts = [];
    if (startDate) {
      parts.push(`createdAt ge ${dayjs(startDate).startOf('day').toISOString()}`);
    }
    if (endDate) {
      parts.push(`createdAt le ${dayjs(endDate).endOf('day').toISOString()}`);
    }
    if (selectedMDVitaLocation) {
      parts.push(`assigned_department eq '${selectedMDVitaLocation}'`);
    }
    return parts.length ? parts.join(' and ') : null;
  };

  const fetchTickets = useCallback(
    async (pageNumber) => {
      const filter = buildFilter();
      const query = inputValue.trim() ? inputValue : "*";

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
    [inputValue, startDate, endDate, selectedMDVitaLocation]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setResults([]);
      fetchTickets(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, startDate, endDate, selectedMDVitaLocation, fetchTickets]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        <CallerIDAutoComplete onSelect={setSelectedMDVitaLocation} />
      </Box>

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
