import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getProviders } from '../../../utils/apiProviders';
import ProviderListUI from './providerListUI';

const ProviderListContainer = ({ onSelect }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [hasMore] = useState(false); // no usamos paginación ahora
  const lastProviderRef = () => {}; // no usamos scroll infinito por ahora
  const [hasSearched, setHasSearched] = useState(false);

  const handleManualSearch = async () => {
    setHasSearched(true);
    if (!searchTerm || searchTerm.length < 2) {
      setProviders([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getProviders({ params: { name: searchTerm, limit: 50 } });
      const { items } = response.message;

      const term = searchTerm.toLowerCase();
      const filtered = items.filter((provider) => {
        const fullName = `${provider.First_Name ?? ''} ${provider.Last_Name ?? ''}`.toLowerCase();
        const providerName = provider.Provider_Name?.toLowerCase() ?? '';
        const officeAddress = provider.Office_Address?.toLowerCase() ?? '';
        return (
          fullName.includes(term) ||
          providerName.includes(term) ||
          officeAddress.includes(term)
        );
      });

      setProviders(filtered);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  return (
    <>
      {/* Header + search input */}
      <Box sx={{ px: 3, pt: 2, mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          Search for providers
        </Typography>
        <Typography variant="body1" color="#5B5F7B" mb={3}>
          You can search by name, facility, or address. Select a provider from the list to link it to this ticket.
        </Typography>

        {/* Manual search bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search Provider"
            placeholder="e.g. Ryan, Allergy"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleManualSearch();
            }}
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
            onClick={handleManualSearch}
            startIcon={<SearchIcon sx={{ mr: '-5px' }} />}
            disabled={loading}
            sx={{
              width: '150px',
              height: '40px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#00A1FF',
              backgroundColor: '#DFF3FF',
              border: '2px solid #00A1FF',
              textTransform: 'none',
              borderRadius: '8px',
              mt: '0px',
              '&:hover': {
                backgroundColor: '#00A1FF',
                color: '#FFFFFF',
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Results */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} color="primary" />
        </Box>
      )}

      {hasSearched && providers.length > 0 && !loading && (
        <ProviderListUI
          providers={providers}
          lastProviderRef={lastProviderRef}
          onSelect={onSelect}
          onToggleFavorite={toggleFavorite}
          hasMore={hasMore}
          loading={loading}
          searchTerm={searchTerm}
        />
      )}
    </>
  );
};

export default ProviderListContainer;
