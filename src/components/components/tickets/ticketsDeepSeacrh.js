// SearchTicketDeep.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, TextField, Chip, MenuItem
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupIcon from '@mui/icons-material/Group';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { searchTickets } from '../../../utils/apiTickets';
import { useAgents } from '../../../context/agentsContext';
import CallerIDAutoComplete from '../fields/callerIDAutocomplete';
import CollaboratorAutoComplete from '../fields/collaboratorAutocomplete';
import SearchTicketResults from './searchTicketsResults';
import SearchButton from '../../auxiliars/searchButton';

dayjs.extend(customParseFormat);

const PAGE_SIZE = 50;

const defaultStatusOptions = [
  { label: 'Any', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Emergency', value: 'Emergency' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Done', value: 'Done' },
  { label: 'Duplicated', value: 'Duplicated' }
];

const defaultLocationOptions = [
  'Bird Road','East Hialeah','Hollywood','Homestead','Miami 27th Ave',
  'Pembroke Pines','Plantation','Tamarac','West Hialeah','West Kendall',
  'Cutler Ridge','Hialeah','Hiatus','Marlins Park','Miami Gardens',
  'North Miami Beach','West Palm Beach','Westchester','OTC','Pharmacy','Referrals'
];

const controlTextFieldSx = {
  '& .MuiInputBase-root': { height: 40 },
  '& .MuiOutlinedInput-input': { padding: '8px 14px' }
};

// -------------------- DOB helpers --------------------
const normalizeDob = (val) => {
  if (!val) return null;
  const s = String(val).trim();
  const invalids = new Set([
    '1901-01-01','01-01-1901','01/01/1901','N/A','NA','null','undefined',''
  ]);
  if (invalids.has(s)) return null;

  // 1) intenta parse "libre" (ISO usually)
  let d = dayjs(s);
  if (d.isValid()) return d.format('MMM D, YYYY');

  // 2) intenta formatos comunes
  const FORMATS = [
    'MM/DD/YYYY','M/D/YYYY',
    'MM-DD-YYYY','M-D-YYYY',
    'DD/MM/YYYY','D/M/YYYY',
    'DD-MM-YYYY','D-M-YYYY',
    'YYYY-MM-DD','YYYY/MM/DD',
    'MMM D, YYYY','D MMM YYYY'
  ];
  for (const f of FORMATS) {
    d = dayjs(s, f, true);
    if (d.isValid()) return d.format('MMM D, YYYY');
  }

  // 3) deja el string crudo si parece válido
  return s;
};

const pickDob = (t) =>
  t?.displayDob ||
  t?.patient_dob || t?.patientDOB || t?.DOB || t?.dob ||
  t?.patient_date_of_birth || t?.date_of_birth || t?.Date_of_Birth || t?.Patient_DOB ||
  t?.patient?.DOB || t?.patient?.dob ||
  t?.linked_patient_snapshot?.DOB || t?.linked_patient_snapshot?.Dob ||
  t?.linked_patient_snapshot?.dob || t?.linked_patient_snapshot?.date_of_birth ||
  null;
// ----------------------------------------------------

const SearchTicketDeep = ({
  onSelect, selectedTicketFunc,
  queryPlaceholder = '',
  statusOptions = defaultStatusOptions,
  locationOptions = defaultLocationOptions
}) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [statusValue, setStatusValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { state } = useAgents();
  const agents = state.agents;

  const buildFilter = useCallback(() => {
    const parts = [];
    if (startDate) parts.push(`createdAt ge ${dayjs(startDate).startOf('day').toISOString()}`);
    if (endDate) parts.push(`createdAt le ${dayjs(endDate).endOf('day').toISOString()}`);
    if (selectedAgents.length > 0) {
      const agentFilter = selectedAgents.map(a => `agent_assigned eq '${a}'`).join(' or ');
      parts.push(agentFilter);
    }
    if (selectedLocations.length > 0) {
      const locationFilter = selectedLocations.map(loc => `assigned_department eq '${loc}'`).join(' or ');
      parts.push(locationFilter);
    }
    if (statusValue) parts.push(`status eq '${statusValue}'`);
    return parts.length ? parts.join(' and ') : null;
  }, [startDate, endDate, selectedAgents, selectedLocations, statusValue]);

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
          // Pide explícitamente campos usados por el card
          select: [
            'id',
            'patient_name',
            'patient_dob',
            'patientDOB',
            'DOB',
            'dob',
            'patient_date_of_birth',
            'date_of_birth',
            'status',
            'assigned_department',
            'caller_id',
            'call_reason',
            'summary',
            'creation_date',
            'agent_assigned',
            'phone',
            'email',
            'linked_patient_snapshot'
          ],
          ...(filter ? { filter } : {})
        };

        const res = await searchTickets(body);
        const raw = res?.message?.value || [];

        // Normaliza y agrega displayDob
        const data = raw.map((item) => ({
          ...item,
          displayDob: normalizeDob(pickDob(item)),
        }));

        if (pageNumber === 1) setResults(data);
        else setResults((prev) => [...prev, ...data]);

        setHasMore(raw.length === PAGE_SIZE);
      } catch (e) {
        console.error('Error in deep search:', e);
      } finally {
        setLoading(false);
      }
    },
    [inputValue, buildFilter]
  );

  const handleSearch = useCallback(() => {
    setPage(1);
    setResults([]);
    fetchTickets(1);
  }, [fetchTickets]);

  useEffect(() => {
    if (page === 1) return;
    fetchTickets(page);
  }, [page, fetchTickets]);

  const toggleFilter = (value) => {
    setActiveFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const hasFilters = activeFilters.length > 0;

  const searchOptions = [
    { label: 'Date Range', value: 'date', icon: <DateRangeIcon /> },
    { label: 'Assigned To', value: 'agent', icon: <GroupIcon /> },
    { label: 'Location', value: 'location', icon: <FmdGoodIcon /> },
    { label: 'Status', value: 'status', icon: <AssignmentTurnedInIcon /> }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Search for tickets
          </Typography>
          <Typography variant="body1" color="#5B5F7B" mb={3}>
            Start with a keyword. Use the buttons below to filter by date range, assigned agent, location, or status.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: hasFilters ? 2.2 : 2.2 }}>
            <TextField
              label="Keyword"
              variant="outlined"
              fullWidth
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder={queryPlaceholder}
              sx={controlTextFieldSx}
            />
            <SearchButton onClick={handleSearch} disabled={loading} />
          </Box>

          {hasFilters && (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              {activeFilters.includes('date') && (
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(v) => setStartDate(v)}
                    slotProps={{ textField: { fullWidth: true, size: 'small', sx: controlTextFieldSx } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(v) => setEndDate(v)}
                    slotProps={{ textField: { fullWidth: true, size: 'small', sx: controlTextFieldSx } }}
                  />
                </Box>
              )}

              {(activeFilters.includes('location') || activeFilters.includes('agent')) && (
                <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  {activeFilters.includes('location') && (
                    <Box sx={{ flex: 1, '& .MuiAutocomplete-root': { width: '100% !important' } }}>
                      <CallerIDAutoComplete
                        label="Location"
                        options={locationOptions}
                        onChange={setSelectedLocations}
                        size="small"
                      />
                    </Box>
                  )}
                  {activeFilters.includes('agent') && (
                    <Box sx={{ flex: 1, '& .MuiAutocomplete-root': { width: '100% !important' } }}>
                      <CollaboratorAutoComplete
                        agents={agents}
                        selectedEmails={selectedAgents}
                        onChange={setSelectedAgents}
                        label="Assigned to"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              )}

              {activeFilters.includes('status') && (
                <TextField
                  label="Status"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  select
                  fullWidth
                  size="small"
                  sx={controlTextFieldSx}
                  SelectProps={{
                    renderValue: (v) =>
                      v === ''
                        ? <span style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.6)' }}>Any</span>
                        : (statusOptions.find(o => o.value === v)?.label || v)
                  }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem
                      key={opt.label}
                      value={opt.value}
                      sx={opt.value === '' ? { fontStyle: 'italic', color: 'text.secondary' } : undefined}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            {searchOptions.map((option) => {
              const isActive = activeFilters.includes(option.value);
              return (
                <Chip
                  key={option.value}
                  onClick={() => toggleFilter(option.value)}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {React.cloneElement(option.icon, { sx: { fontSize: 18, color: isActive ? '#00A1FF' : '#666' } })}
                      <span style={{ position: 'relative', top: '1px' }}>{option.label}</span>
                    </Box>
                  }
                  sx={{
                    borderRadius: '999px',
                    border: `1px solid ${isActive ? '#00A1FF' : '#d6d6d6'}`,
                    fontWeight: 500,
                    backgroundColor: isActive ? '#DFF3FF' : '#fff',
                    color: isActive ? '#00A1FF' : '#333',
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: '#DFF3FF',
                      borderColor: '#00A1FF',
                      color: '#00A1FF',
                      '& svg': { color: '#00A1FF' },
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <SearchTicketResults
          results={results}
          loading={loading}
          inputValue={inputValue}
          hasMore={hasMore}
          loadMore={() => { const nextPage = page + 1; setPage(nextPage); }}
          selectedTicket={onSelect}
          
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SearchTicketDeep;
