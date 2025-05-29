import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, Box
} from '@mui/material';

const AgentOptionsModal = ({
  open,
  onClose,
  onReassignAgent,
  onAddCollaborator,
  onChangeDepartment
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button borderRadius={2}
            variant="contained"
            sx={{

                backgroundColor: '#DFF3FF',
                color: '#00A1FF',
                border: '2px solid #00A1FF',
                borderRadius: '4px',
                '&:hover': {
                backgroundColor: '#e0557e'
                }
            }}
            onClick={() => {
              onReassignAgent();
              onClose();
            }}
          >
            Reassign to Another User 
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              onAddCollaborator();
              onClose();
            }}
          >
            Agregar colaborador
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              onChangeDepartment();
              onClose();
            }}
          >
            Cambiar departamento
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentOptionsModal;
