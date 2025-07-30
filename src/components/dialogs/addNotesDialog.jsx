// components/dialogs/AddNoteDialog.jsx
import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';
import ActionButtons from '../auxiliars/actionButtons';

export default function AddNoteDialog({ open, onClose, onSubmit, value, onChange }) {
  const isEmpty = !value || !String(value).trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: '#FFB900', px: 4, pt: 3 }}>
        <Box display="flex" alignItems="center">
          <i className="fa fa-sticky-note" style={{ color: '#FFB900', marginRight: 8 }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Add New Note</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          multiline
          fullWidth
          rows={4}
          label="Add your note"
          value={value}
          onChange={onChange}
          margin="dense"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#00A1FF' },
            },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
          }}
        />
      </DialogContent>

      {/* Usamos directamente ActionButtons (sin DialogActions) para que mantenga tu estilo */}
      <ActionButtons
        onCancel={onClose}
        onConfirm={onSubmit}
        confirmLabel="Add"
        confirmDisabled={isEmpty}
      />
    </Dialog>
  );
}
