// src/components/auxiliars/searchButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const BASE_SX = {
  width: '120px',        // ancho deseado
  minWidth: '120px',     // evita que se encoja en flex
  flexShrink: 0,         // evita shrink por layout
  height: '40px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#00A1FF',
  backgroundColor: '#DFF3FF',
  border: '2px solid #00A1FF',
  textTransform: 'none',
  borderRadius: '8px',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: '#00A1FF',
    color: '#FFFFFF',
  },
};

export default function SearchButton({
  onClick,
  disabled = false,
  children = 'Search',
  sx = {},
  showIcon = true,
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      startIcon={showIcon ? <SearchIcon sx={{ mr: '-5px' }} /> : null}
      sx={{ ...BASE_SX, ...sx }}
    >
      {children}
    </Button>
  );
}
