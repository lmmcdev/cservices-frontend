// components/CollaboratorDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import CollaboratorAutoComplete from '../components/collaboratorAutocomplete';

export default function AgentSelectorDialog({
  open,
  onClose,
  onAdd,
  agents,
  initialSelected = [],
}) {
  const [selected, setSelected] = useState(initialSelected);

  const handleAdd = () => {
    onAdd(selected); // array de agent_email
    onClose();
  };

  const handleClose = () => {
    setSelected(initialSelected); // reset
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar colaboradores</DialogTitle>
      <DialogContent>
        <CollaboratorAutoComplete
          agents={agents}
          selectedEmails={selected}
          onChange={setSelected}
          label="Selecciona colaboradores"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleAdd} variant="contained">Agregar</Button>
      </DialogActions>
    </Dialog>
  );
}
