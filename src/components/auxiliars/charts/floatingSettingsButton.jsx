import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FloatingSettingsPopover from './floatingSettingsPopover';

export default function FloatingSettingsButton() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggle = (event) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Menú de navegación">
        <Fab
          onClick={handleToggle}
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

      <FloatingSettingsPopover
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}
