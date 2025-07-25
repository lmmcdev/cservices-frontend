import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CakeIcon from '@mui/icons-material/Cake';
import RingVolumeIcon from '@mui/icons-material/RingVolume';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

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

  const [searchValues, setSearchValues] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    location: ''
  });

  const [activeFilters, setActiveFilters] = useState([]);

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

  const handleSearch = () => {
    const fullName = `${searchValues.firstName} ${searchValues.lastName}`.trim();
    if (fullName.length < 2) return;

    setInputValue(fullName);
    setPage(1);
    setResults([]);
    fetchPatients(fullName, 1);
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
      {/* Header */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Search for patients
        </Typography>
        <Typography variant="body1" color="#5B5F7B" mb={3}>
          Start with first and last name. Use the buttons below to search by date of birth, phone, or location if necessary.
        </Typography>

        {/* Name fields and search button */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: hasFilters ? 2.2 : 2.2 }}>
           <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={searchValues.firstName}
            onChange={(e) => setSearchValues({ ...searchValues, firstName: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover:not(.Mui-focused) fieldset': {
                  borderColor: '#999999',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00A1FF',  
                }
              }
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            //InputLabelProps={{ shrink: true }}
            value={searchValues.lastName}
            onChange={(e) => setSearchValues({ ...searchValues, lastName: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover:not(.Mui-focused) fieldset': {
                  borderColor: '#999999',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00A1FF',  
                }
              }
            }}
          />
          <Button
            onClick={handleSearch}
            startIcon={<SearchIcon sx={{ mr: '-5px' }} />}
            sx={{
              width: '250px',
              height: '40px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#00A1FF',
              backgroundColor: '#DFF3FF',
              border: '2px solid #00A1FF',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#00A1FF',
                color: '#FFFFFF',
              },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Extra fields */}
        {hasFilters && (
          <>
            {(activeFilters.includes('dob') || activeFilters.includes('phone')) && (
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {activeFilters.includes('dob') && (
                  <TextField
                    type="date"
                    label="Date of Birth"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={searchValues.dob}
                    onChange={(e) => setSearchValues({ ...searchValues, dob: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover:not(.Mui-focused) fieldset': {
                          borderColor: '#999999',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00A1FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        '&:hover:not(.Mui-focused)': {
                          color: '#999999',
                        },
                        '&.Mui-focused': {
                          color: '#00A1FF',
                        },
                      },
                    }}
                  />
                )}
                {activeFilters.includes('phone') && (
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={searchValues.phone}
                  onChange={(e) => setSearchValues({ ...searchValues, phone: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover:not(.Mui-focused) fieldset': {
                        borderColor: '#999999',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00A1FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      '&:hover:not(.Mui-focused)': {
                        color: '#999999',
                      },
                      '&.Mui-focused': {
                        color: '#00A1FF',
                      },
                    },
                  }}
                />
                )}
              </Box>
            )}
          </>
        )}

        {/* Location select */}
        {activeFilters.includes('location') && (
          <Box sx={{ mt: 2 }}>
            <MDVitaLocationSelect
              value={selectedMDVitaLocation}
              onChange={(val) => {
                setSelectedMDVitaLocation(val);
                setSearchValues((prev) => ({ ...prev, location: val }));
              }}
              label="Location"
            />
          </Box>
        )}

        {/* Chips */}
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

      {/* Results */}
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
