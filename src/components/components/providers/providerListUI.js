import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ProviderCard from '../../providerCard';

const ProviderListUI = ({
  providers,
  lastProviderRef,
  onSelect,
  hasMore,
  loading,
  searchTerm
}) => {
  return (
    <Box
      sx={{
        mt: 3,
        pt: 1,
        px: 3,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      {providers.map((provider, index) => {
        const isLastItem = index === providers.length - 1;
        return (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isLastItem={isLastItem}
            lastProviderRef={lastProviderRef}
            onSelect={onSelect}
          />
        );
      })}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && providers.length === 0 && searchTerm?.length >= 2 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No providers found.
        </Typography>
      )}
    </Box>
  );
};

export default ProviderListUI;
