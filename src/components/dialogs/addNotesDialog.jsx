// components/dialogs/AddNoteDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

export default function AddNoteDialog({ open, onClose, onSubmit, value, onChange }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Note</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          rows={4}
          label="Add your note"
          value={value}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!value.trim()}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
