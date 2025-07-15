import React, { useState } from 'react';
import { Fab, Tooltip, Popover, Box, Typography, TextField } from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

export default function FloatingSettingsButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fakeDate, setFakeDate] = useState('');

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFakeDate('');
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Customize">
        <Fab
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            backgroundColor: '#00a1ff',
            color: '#fff',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 2000,
            '&:hover': {
              backgroundColor: '#0080cc',
            },
          }}
        >
          <AppRegistrationIcon />
        </Fab>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 250,
            borderRadius: 3,
            mt: 1,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Select Date
        </Typography>
        <TextField
          type="date"
          value={fakeDate}
          onChange={(e) => setFakeDate(e.target.value)}
          fullWidth
        />
      </Popover>
    </>
  );
}
