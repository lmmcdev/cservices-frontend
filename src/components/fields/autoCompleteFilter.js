// src/components/AutocompleteFilter.jsx
import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AutocompleteFilter({
  label,
  options,
  value,
  onChange,
  optionLabelKey = null,
  width = 240,
  placeholder = '',
}) {
  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return optionLabelKey ? option[optionLabelKey] : JSON.stringify(option);
  };

  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel}
      sx={{ width }}
      popupIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: 'text.secondary' }} />}
      renderTags={(value, getTagProps) => (
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 0.5,
            maxWidth: '100%',
            ml: 1,
            py: 0.5,
            whiteSpace: 'nowrap',
          }}
        >
          {value.map((option, index) => (
            <Box
              key={optionLabelKey ? option[optionLabelKey] : option}
              component="span"
              {...getTagProps({ index })}
              sx={{
                background: '#e0e0e0',
                fontSize: 12,
                borderRadius: 1,
                px: 1,
                py: 0.25,
                maxWidth: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {getOptionLabel(option)}
            </Box>
          ))}
        </Box>
      )}
      renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        InputLabelProps={{
          sx: {
            fontSize: 14,
            transform: 'translate(14px, 8px) scale(1.2)', // posición del placeholder
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)', // posición cuando está flotando
            },
          },
        }}
        InputProps={{
          ...params.InputProps,
          sx: {
            height: 40,
            alignItems: 'center',
            fontSize: 14,
            '& .MuiOutlinedInput-input': {
              padding: '8px 14px',
            },
          },
        }}
      />
    )}
    />
  );
}
