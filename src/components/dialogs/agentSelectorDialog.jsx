// components/CollaboratorDialog.tsx
import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@mui/material';
import CollaboratorAutoComplete from '../fields/collaboratorAutocomplete';
import ActionButtons from '../fields/actionButtons';
import { icons } from '../auxiliars/icons';

export default function AgentSelectorDialog({
  open,
  onClose,
  onAdd,
  agents,
  initialSelected = [],
}) {
  const [selected, setSelected] = useState(initialSelected);

  const handleAdd = () => {
    onAdd(selected);
    onClose();
  };

  const handleClose = () => {
    setSelected(initialSelected);
    onClose();
  };


  return (
   <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '320px', // o cualquier ancho que prefieras
          borderRadius: '15px'
        },
      }}
    >
      <DialogTitle sx={{ color: '#00A1FF', p: 2, textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <icons.addCollaborator style={{ color: '#00a1ff', fontSize: '24px', marginRight: '8px' }} />
          <Typography variant="h6" sx={{ color: '#00A1FF', fontWeight: 'bold' }}>
            Add Collaborators
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: 4, // opcional para que tenga espacio lateral
          overflowY: 'visible',
          overflowX: 'visible',
        }}
      >
        <Box
          sx={{ width: '100%', maxWidth: '400px' }}
        >
          <Box display="flex" justifyContent="center" width="100%">
            <Box width="94%"> 
              <CollaboratorAutoComplete
                agents={agents}
                selectedEmails={selected}
                onChange={setSelected}
                label="Select users"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <ActionButtons onCancel={handleClose} onConfirm={handleAdd} />
    </Dialog>
  );
}
