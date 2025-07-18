import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { searchPatients } from '../../utils/apiPatients';

const PAGE_SIZE = 30;

const SearchPatientDeep = ({ queryPlaceholder = 'Search patients deeply...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const observerRef = useRef(null);

  // Fetch Function
  const fetchPatients = useCallback(async (searchTerm, pageNumber) => {
    if (!searchTerm || searchTerm.length < 2) return;

    setLoading(true);
    try {
      const res = await searchPatients(searchTerm, pageNumber, PAGE_SIZE);
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
  }, []);

  // On input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setPage(1);
    setResults([]);
    if (value.length >= 2) fetchPatients(value, 1);
  };

  // Infinite Scroll observer
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

  return (
    <Box sx={{ p: 0 }}>
      <TextField
        fullWidth
        label="Deep Patient Search"
        placeholder={queryPlaceholder}
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
      />

      <Box sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto' }}>
        {results.map((patient, index) => {
          const isLast = index === results.length - 1;
          return (
            <Card
              key={patient.id || index}
              ref={isLast ? lastElementRef : null}
              sx={{ mb: 2 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {patient.Name || 'No name'}
                </Typography>
                <Typography variant="body2">
                  DOB: {patient.DOB || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Email: {patient.Email || 'N/A'}
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Typography variant="caption">
                  Language: {patient.Language || 'N/A'} | Gender:{' '}
                  {patient.Gender || 'N/A'}
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
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            No results found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchPatientDeep;
