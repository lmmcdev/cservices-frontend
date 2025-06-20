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

  const handleSearch = async (value) => {
    setInputValue(value);
    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchProviders(value);
      const data = result?.message?.value || [];

      // Agrega identificador interno seguro
      const normalized = data.map((item) => ({
        ...item,
        _internalId: item.id,
      }));

      setOptions(normalized.slice(0, 25)); // opcional: limita para evitar overload visual
    } catch (e) {
      console.error('Error de búsqueda:', e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
  disablePortal
  options={options}
  inputValue={inputValue}
  loading={loading}
  fullWidth
  onInputChange={(e, value) => handleSearch(value)}
  isOptionEqualToValue={(option, value) => JSON.stringify(option) === JSON.stringify(value)}
  getOptionLabel={(option) =>
    option?.Provider_Name?.toString() || 'Unnamed Provider'
  }
  onChange={(e, value) => {
    if (value && typeof value === 'object') onSelect(value);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search Provider"
      placeholder="e.g. Ryan, Allergy"
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading && <CircularProgress color="inherit" size={18} />}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  renderOption={(props, option) => (
    <Box component="li" {...props} key={option._internalId} sx={{ py: 1 }}>
      <Typography fontWeight="bold">{option.Provider_Name || 'Sin nombre'}</Typography>
      <Typography variant="body2">{option.Office_Address || 'Sin dirección'}</Typography>
      <Typography variant="caption" color="text.secondary">
        {option.Taxonomy_Description || ''}
      </Typography>
      <Divider sx={{ my: 1 }} />
    </Box>
  )}
/>
  );
};

export default ProviderAutocomplete;
