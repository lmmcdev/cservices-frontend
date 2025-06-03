// src/components/AutocompleteFilter.jsx
import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const commonStyles = {
  fontSize: 12,
  height: 36,
  color: 'text.secondary',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ccc',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#aaa',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00a1ff',
  },
};


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
      sx={{ width, ...commonStyles }}
      popupIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: 'text.secondary' }} />}
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
          InputLabelProps={{
            sx: { color: 'text.secondary', fontSize: 12 },
          }}
          InputProps={{
            ...params.InputProps,
            sx: {
              ...commonStyles,
              alignItems: 'center',
            },
          }}
        />
      )}
    />

  );
}