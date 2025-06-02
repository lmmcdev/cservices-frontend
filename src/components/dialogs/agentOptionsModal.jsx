import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, Box
} from '@mui/material';
import CollaboratorAutoComplete from '../components/collaboratorAutocomplete';

const AgentOptionsModal = ({
  open,
  onClose,
  onReassignAgent,
  onAddCollaborator,
  onChangeDepartment,
  agents = []
}) => {
  const [selectedAgent, setSelectedAgent] = React.useState('');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Autocomplete */}
          <CollaboratorAutoComplete
            agents={agents}
            selectedEmails={selectedAgent ? [selectedAgent] : []}
            onChange={(emails) => setSelectedAgent(emails[0] || '')}
            label="Selecciona agente"
            sx={{ my: 2 }}
          />

          {/* Botón reasignar */}
          <Button
            variant="contained"
            disabled={!selectedAgent}
            sx={{
              backgroundColor: '#DFF3FF',
              color: '#00A1FF',
              border: '2px solid #00A1FF',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#e0557e'
              }
            }}
            onClick={async () => {
              if (onReassignAgent) {
                await onReassignAgent([selectedAgent]);  //Llama al prop con el agente seleccionado
              }
              onClose();
            }}
          >
            Reassign to Another User 
          </Button>

          {/* Botón agregar colaborador */}
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              onAddCollaborator?.(selectedAgent);
              onClose();
            }}
          >
            Agregar colaborador
          </Button>

          {/* Botón cambiar departamento */}
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              onChangeDepartment?.();
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
