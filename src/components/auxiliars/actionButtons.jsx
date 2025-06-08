import React from 'react';
import { Button, Box } from '@mui/material';

export default function ActionButtons({ onCancel, onConfirm, cancelLabel = 'Cancel' }) {
  return (
    <Box display="flex" gap={2} justifyContent="center" sx={{ px: 3, pb: 3 }}>
      {onCancel && (
        <Button
          onClick={onCancel}
          sx={{
            width: '100px',
            height: '44px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            backgroundColor: '#eeeff0',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#B0200C',
              color: '#FFFFFF',
            },
          }}
        >
          {cancelLabel}
        </Button>
      )}
      {onConfirm && (
        <Button
          onClick={onConfirm}
          sx={{
            width: '100px',
            height: '44px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00A1FF',
            backgroundColor: '#DFF3FF',
            border: '2px solid #00A1FF',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#00A1FF',
              color: '#FFFFFF',
            },
          }}
        >
          Confirm
        </Button>
      )}
    </Box>
  );
}
