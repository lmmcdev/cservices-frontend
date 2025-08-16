import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import RingVolumeIcon from '@mui/icons-material/RingVolume';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import { searchPatients, } from '../../../utils/apiPatients';
import MDVitaLocationSelect from '../../fields/mdvitaCenterSelect';
import SearchPatientResults from './searchPatientsResults';
import SearchButton from '../../auxiliars/searchButton';

const PAGE_SIZE = 50;

const controlFieldSx = {
  '& .MuiInputBase-root': { height: 40 },
  '& .MuiOutlinedInput-input': { padding: '8px 14px' }
};

const SearchPatientDeepContainer = ({ onSelect, selectedPatientFunc  }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [, setSelectedPatient] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, ] = useState(false);
  const [selectedMDVitaLocation, setSelectedMDVitaLocation] = useState('');

  const observerRef = useRef(null);

  const [searchValues, setSearchValues] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    location: ''
  });

  const [activeFilters, setActiveFilters] = useState([]);

  const buildSearchParams = (values) => {
    const queryParts = [];
    const filterParts = [];

    if (values.firstName || values.lastName) {
      queryParts.push(`${values.firstName ?? ''} ${values.lastName ?? ''}`.trim());
    }

    if (values.phone) {
      queryParts.push(values.phone);
    }

    if (values.dob) {
      filterParts.push(`dob eq '${values.dob}'`);
    }

    if (values.location) {
      filterParts.push(`Location_Name eq '${values.location}'`);
    }

    return {
      query: queryParts.join(' OR '),
      filter: filterParts.join(' and ')
    };
  };

  const fetchPatients = useCallback(
    async (searchValues, pageNumber) => {
      const { query, filter } = buildSearchParams(searchValues);
      if (!query || query.length < 2) return;

      setLoading(true);
      try {
        const res = await searchPatients(query, filter, pageNumber, PAGE_SIZE);
        const data = res?.message?.hits || [];

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
    []
  );

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPatients(searchValues, nextPage);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, searchValues, page, fetchPatients]
  );

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPatient(null);
    setTickets([]);
  };

  const handleSearch = () => {
    setInputValue(`${searchValues.firstName} ${searchValues.lastName}`.trim());
    setPage(1);
    setResults([]);
    fetchPatients(searchValues, 1);
  };

  const toggleFilter = (value) => {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasFilters = activeFilters.length > 0;

  const searchOptions = [
    { label: 'Date of Birth', value: 'dob', icon: <CakeIcon /> },
    { label: 'Phone', value: 'phone', icon: <RingVolumeIcon /> },
    { label: 'Location', value: 'location', icon: <FmdGoodIcon /> },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ px: 3, pt: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Search for patients
        </Typography>
        <Typography variant="body1" color="#5B5F7B" mb={3}>
          Start with first and last name. Use the buttons below to search by date of birth, phone, or location if necessary.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: hasFilters ? 2.2 : 2.2 }}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
            sx={controlFieldSx}
            value={searchValues.firstName}
            onChange={(e) => setSearchValues({ ...searchValues, firstName: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
            sx={controlFieldSx}
            value={searchValues.lastName}
            onChange={(e) => setSearchValues({ ...searchValues, lastName: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <SearchButton onClick={handleSearch} disabled={loading} />
        </Box>

        {hasFilters && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            {activeFilters.includes('dob') && (
              <TextField
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
                sx={controlFieldSx}
                value={searchValues.dob}
                onChange={(e) => setSearchValues({ ...searchValues, dob: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}

            {activeFilters.includes('phone') && (
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                size="small"
                sx={controlFieldSx}
                value={searchValues.phone}
                onChange={(e) => setSearchValues({ ...searchValues, phone: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}

            {activeFilters.includes('location') && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 240,           // o quítalo si lo quieres 100% flexible
                  '& .MuiInputBase-root': { height: 40 },
                  '& .MuiOutlinedInput-input': { padding: '8px 14px' },
                  '& .MuiInputLabel-root': { fontSize: 14 },
                }}
              >
                <MDVitaLocationSelect
                  label="Location"
                  value={selectedMDVitaLocation}
                  onChange={(val) => {
                    setSelectedMDVitaLocation(val);
                    setSearchValues((prev) => ({ ...prev, location: val }));
                  }}
                />
              </Box>
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
                    {React.cloneElement(option.icon, {
                      sx: { fontSize: 18, color: isActive ? '#00A1FF' : '#666' },
                    })}
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
                    '& svg': {
                      color: '#00A1FF',
                    },
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      <SearchPatientResults
        results={results}
        loading={loading}
        inputValue={inputValue}
        lastElementRef={lastElementRef}
        dialogOpen={dialogOpen}
        selectedPatient={selectedPatientFunc}
        tickets={tickets}
        ticketsLoading={ticketsLoading}
        onPatientClick={onSelect}
        onCloseDialog={handleCloseDialog}
      />
    </Box>
  );
};

export default SearchPatientDeepContainer;
