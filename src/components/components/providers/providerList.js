import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
// ❌ ya no hace falta SearchIcon ni Button
// import SearchIcon from '@mui/icons-material/Search';
// import { Button } from '@mui/material';
import SearchButton from '../../auxiliars/searchButton'; // 👈 tu botón reusable

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
      const query = searchTerm;
      const filter = ''; // puedes ajustar esto según tus necesidades
      const response = await getProviders(query, filter);
      const items = response?.message?.results || [];
      console.log(response)

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
            size="small"
            sx={{
              '& .MuiInputBase-root': { height: 40 },
              '& .MuiOutlinedInput-input': { padding: '8px 14px' },
              '& .MuiOutlinedInput-root': {
                '&:hover:not(.Mui-focused) fieldset': { borderColor: '#999999' },
                '&.Mui-focused fieldset': { borderColor: '#00A1FF' },
              },
            }}
          />

          {/* 👇 Botón unificado (mismo ancho/alto estilo que en tickets/patients) */}
          <SearchButton onClick={handleManualSearch} disabled={loading} />
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
