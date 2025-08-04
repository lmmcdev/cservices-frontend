import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { searchPatients } from '../../utils/apiPatients';
import { useNavigate } from 'react-router-dom';

const PatientsAutocomplete = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Si usas react-router

  const handleSearch = async (value) => {
    setInputValue(value);
    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchPatients(value, 1, 20);
      const data = result?.message?.value || [];
        
      const normalized = data.map((item) => ({
        ...item,
        _internalId: item.id,
      }));

      console.log(normalized)
      setOptions(normalized);
    } catch (e) {
      console.error('Error de búsqueda:', e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <Box>
    <Autocomplete
      disablePortal
      options={options}
      inputValue={inputValue}
      loading={loading}
      fullWidth
      onInputChange={(e, value) => handleSearch(value)}
      isOptionEqualToValue={(option, value) =>
        JSON.stringify(option) === JSON.stringify(value)
      }
      getOptionLabel={(option) =>
        option?.Name?.toString() || 'Unnamed Patient'
      }
      onChange={(e, value) => {
        if (value && typeof value === 'object') onSelect(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Patient"
          placeholder="e.g. Ryan, Allergy"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && (
                  <CircularProgress color="inherit" size={18} />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option._internalId}
          sx={{ py: 1 }}
        >
          <Typography fontWeight="bold">
            {option.Name || 'No name'}
          </Typography>
          <Typography variant="body2">
            {option.DOB || 'No DOB'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {option.Email || ''}
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      )}
      ListboxProps={{
        style: { maxHeight: 400, overflow: 'auto' },
      }}
    />

    {options.length >= 20 && (
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() =>
            //navigate(`/patients/search?query=${encodeURIComponent(inputValue)}`)
            navigate('patient-search')
          }
        >
          Ver todos los resultados →
        </Typography>
      </Box>
    )}
  </Box>
);

};

export default PatientsAutocomplete;
