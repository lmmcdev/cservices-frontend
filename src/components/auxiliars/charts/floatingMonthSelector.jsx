// src/components/auxiliars/charts/FloatingMonthSelector.jsx
import React from 'react';
import { TextField, Button, Stack, InputAdornment, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

export default function FloatingMonthSelector({ month, setMonth, onSearch, onClose }) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        zIndex: 1300,
        p: 2,
        borderRadius: 3,
        bgcolor: '#fff',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          type="month"
          label="Select month"
          value={month}
          onChange={(e) => setMonth(e.target.value)} // "YYYY-MM"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon sx={{ color: '#00a1ff' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: '8px',
              bgcolor: '#fff',
            },
            minWidth: 220,
          }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{
            backgroundColor: '#00a1ff',
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            '&:hover': { backgroundColor: '#0080cc' },
          }}
        >
          Search
        </Button>
        <Button
          onClick={onClose}
          sx={{ color: '#666', textTransform: 'none' }}
        >
          Close
        </Button>
      </Stack>
    </Paper>
  );
}
