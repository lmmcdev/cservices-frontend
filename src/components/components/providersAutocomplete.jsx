import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { searchProviders } from '../../utils/apiProviders';

const ProviderAutocomplete = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!inputValue || inputValue.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchProviders(inputValue);
      const data = result?.message?.value || [];

      const normalized = data.map((item) => ({
        ...item,
        _internalId: item.id,
      }));

      setOptions(normalized.slice(0, 25));
    } catch (e) {
      console.error('Error de búsqueda:', e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Input + botón */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search Provider"
          placeholder="e.g. Ryan, Allergy"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
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

        <Box
          component="button"
          onClick={handleSearch}
          style={{
            padding: '10px 16px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#00A1FF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            height: '40px',
            marginTop: '4px',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Box>
      </Box>

      {/* Dropdown de resultados si hay opciones */}
      {hasSearched && options.length > 0 && (
        <Autocomplete
          disablePortal
          options={options}
          fullWidth
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option?.Provider_Name?.toString() || 'Unnamed Provider'}
          onChange={(e, value) => {
            if (value && typeof value === 'object') onSelect(value);
          }}
          renderInput={(params) => <></>} // ya usamos nuestro propio input
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option._internalId} sx={{ py: 1 }}>
              <Typography fontWeight="bold">
                {option.Provider_Name || 'Sin nombre'}
              </Typography>
              <Typography variant="body2">
                {option.Office_Address || 'Sin dirección'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.Taxonomy_Description || ''}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}
        />
      )}
    </>
  );
};

export default ProviderAutocomplete;
