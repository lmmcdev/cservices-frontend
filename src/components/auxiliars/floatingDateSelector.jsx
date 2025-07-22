// components/floatingDateSelector.jsx
import React from 'react';
import { TextField, Button, Stack, InputAdornment, Paper } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';

const FloatingDateSelector = ({ date, setDate, onSearch, onClose }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        zIndex: 1300,
        padding: 2,
        borderRadius: 3,
        backgroundColor: '#fff',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          type="date"
          label="Seleccionar fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon sx={{ color: '#00a1ff' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
            },
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
            '&:hover': {
              backgroundColor: '#0080cc',
            },
          }}
        >
          Search
        </Button>
        <Button
          onClick={onClose}
          sx={{
            color: '#666',
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </Stack>
    </Paper>
  );
};

export default FloatingDateSelector;
