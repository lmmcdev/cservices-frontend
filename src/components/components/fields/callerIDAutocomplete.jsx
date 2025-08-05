import React, { useState } from 'react';
import { Box } from '@mui/material';
import AutocompleteFilter from './autoCompleteFilter';

const defaultLocations = [
  'Wellmax Cutler Ridge',
  'LMMC Homestead',
  'Pasteur Hialeah Center',
  'LMMC Hialeah West',
  'Wellmax Marlings',
  'OTC',
  'Pharmacy',
  'Referrals'
];

export default function CallerIDAutoComplete({
  onChange,
  label = 'Location',
  options = defaultLocations
}) {
  const [selected, setSelected] = useState([]);

  const handleChange = (newValue) => {
    setSelected(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Box
      sx={{
        '& .MuiInputLabel-root': { fontSize: 14 },
        '& .MuiInputBase-root': { height: 40 },
        '& .MuiOutlinedInput-root': { height: 40 },
        '& .MuiOutlinedInput-input': { padding: '8px 14px', fontSize: 14 },
        '& .MuiAutocomplete-inputRoot': { padding: '0 !important' },
        '& .MuiAutocomplete-input': { fontSize: 14 },
        '& .MuiAutocomplete-endAdornment': { right: 8 }
      }}
    >
      <AutocompleteFilter
        label={label}
        options={options}
        value={selected}
        onChange={handleChange}
      />
    </Box>
  );
}
