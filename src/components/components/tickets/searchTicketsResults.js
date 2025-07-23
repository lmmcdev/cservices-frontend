import React, { useRef, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Divider, CircularProgress
} from '@mui/material';

const SearchTicketResults = ({ results, loading, inputValue, hasMore, loadMore }) => {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Box sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto' }}>
      {results.map((patient, index) => {
        const isLast = index === results.length - 1;
        return (
          <Card
            key={patient.id || index}
            ref={isLast ? lastElementRef : null}
            sx={{ mb: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f9f9f9' } }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {patient.patient_name || 'No name'}
              </Typography>
              <Typography variant="body2">DOB: {patient.DOB || 'N/A'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Phone: {patient.phone || 'N/A'}
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Location: {patient.assigned_department || 'N/A'} -|- Status: {patient.status || 'N/A'}
              </Typography>
              <Typography variant="caption">
                Date: {patient.creation_date || 'N/A'} | Agent: {patient.agent_assigned || 'N/A'}
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
  );
};

export default SearchTicketResults;
