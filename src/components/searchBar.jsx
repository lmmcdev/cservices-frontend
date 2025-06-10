import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ value, onChange, sx = {} }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      label="Search"
      sx={{
        width: 240,
        '& .MuiOutlinedInput-root': {
          height: 36,
          fontSize: 12,
          borderRadius: 2,
          '& input': {
            paddingY: 0,
            fontSize: 12,
            color: 'text.secondary',
            boxSizing: 'border-box',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00a1ff',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: 12,
          color: 'text.secondary',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#00a1ff',
        },
        ...sx,
      }}
    />
  );
};

export default SearchBar;
