import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography, Divider } from '@mui/material';
import { searchProviders } from '../../utils/apiProviders';

const ProviderAutocomplete = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setInput(value);

    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchProviders(value);
      setOptions(result?.message?.value || []);
    } catch (e) {
      console.error('Autocomplete search error:', e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      getOptionLabel={(option) =>
        `${option?.Provider_Name || ''} - ${option?.Office_Address || ''}`
      }
      onInputChange={(event, value) => handleSearch(value)}
      onChange={(event, value) => {
        if (value) onSelect(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Provider"
          placeholder="Nombre, teléfono o especialidad"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id} sx={{ display: 'block' }}>
          <Typography fontWeight="bold">{option.Provider_Name}</Typography>
          <Typography variant="body2">{option.Office_Address}</Typography>
          <Typography variant="caption" color="text.secondary">
            {option.Taxonomy_Description}
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      )}
    />
  );
};

export default ProviderAutocomplete;
