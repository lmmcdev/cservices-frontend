// src/components/AutocompleteFilter.jsx
import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

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
      renderTags={(value, getTagProps) => (
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 0.5,
            maxWidth: '100%',
            paddingY: 0.5,
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
                fontSize: 11,
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
          InputLabelProps={{ sx: { color: 'text.secondary', fontSize: 12 } }}
          InputProps={{
            ...params.InputProps,
            sx: {
              fontSize: 12,
              color: 'text.secondary',
              height: 36,
              alignItems: 'center',
              overflow: 'hidden',
            },
          }}
        />
      )}
    />
  );
}