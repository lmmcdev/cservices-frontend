import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import SearchButton from '../../auxiliars/searchButton';
import { useApiHandlers } from '../../../utils/js/apiActions.js';
import ProviderListUI from './providerListUI';
import EmptyState from '../../auxiliars/emptyState';

const ProviderListContainer = ({ onSelect }) => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [hasMore] = useState(false); // no usamos paginación ahora
  const lastProviderRef = () => {}; // no usamos scroll infinito por ahora
  //const [hasSearched, setHasSearched] = useState(false);
  const { getProvidersHandler } = useApiHandlers();

  const handleManualSearch = async () => {
    //setHasSearched(true);
    if (!searchTerm || searchTerm.length < 2) {
      setProviders([]);
      return;
    }

    try {
      const query = searchTerm;
      const filter = ''; // puedes ajustar esto según tus necesidades
      const response = await getProvidersHandler(query, filter);
      const items = response?.message?.results || [];

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
          <SearchButton onClick={handleManualSearch} />
        </Box>
      </Box>

      

      {providers.length > 0 ? (
        <ProviderListUI
          providers={providers}
          lastProviderRef={lastProviderRef}
          onSelect={onSelect}
          onToggleFavorite={toggleFavorite}
          hasMore={hasMore}
          searchTerm={searchTerm}
        />
      ) : (
        <EmptyState
          title="No Providers Found"
          description="Try adjusting your search criteria."
        />
      )}
    </>
  );
};

export default ProviderListContainer;
