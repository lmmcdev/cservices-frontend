import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';

export default function AlertSnackbar({ open, onClose, severity = 'error', message }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        maxWidth: '180vw',
      }}
    >
      <Box sx={{ maxWidth: '190vw' }}>
        <Alert
          onClose={onClose}
          severity={severity}
          sx={{
            width: 'auto',
            maxWidth: '200%',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.5,
            fontSize: '0.95rem',
          }}
        >
          {message}
        </Alert>
      </Box>
    </Snackbar>
  );
}
