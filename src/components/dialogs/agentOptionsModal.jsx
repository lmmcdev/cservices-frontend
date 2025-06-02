import React from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, Box
} from '@mui/material';
import CollaboratorAutoComplete from '../components/collaboratorAutocomplete';
import DepartmentSelect from '../components/departmentSelect';

const AgentOptionsModal = ({
  open,
  onClose,
  onReassignAgent,
  onChangeDepartment,
  agents = []
}) => {
  const [selectedAgent, setSelectedAgent] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');

  const handleChangeDepartment = async () => {
    if (onChangeDepartment && selectedDepartment) {
      await onChangeDepartment(selectedDepartment);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <CollaboratorAutoComplete
            agents={agents}
            selectedEmails={selectedAgent ? [selectedAgent] : []}
            onChange={(emails) => setSelectedAgent(emails[0] || '')}
            label="Selecciona agente"
            sx={{ my: 2 }}
          />

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
                await onReassignAgent([selectedAgent]);
              }
              onClose();
            }}
          >
            Reassign to Another User 
          </Button>

          <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />

          <Button
            variant="outlined"
            color="warning"
            disabled={!selectedDepartment}
            onClick={handleChangeDepartment}
          >
            Change Assigned Department
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
