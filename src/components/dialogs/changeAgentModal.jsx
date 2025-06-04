import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from '@mui/material';
import CollaboratorAutoComplete from '../components/collaboratorAutocomplete';
import ActionButtons from '../actionButtons'; // usamos el mismo botón que en collaborators
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHand } from '@fortawesome/free-solid-svg-icons';

const ChangeAgentModal = ({
  open,
  onClose,
  onReassignAgent,
  agents = []
}) => {
  const [selectedAgent, setSelectedAgent] = useState('');

  const handleReassign = async () => {
    if (onReassignAgent && selectedAgent) {
      await onReassignAgent([selectedAgent]);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedAgent('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { width: '100%', maxWidth: '320px' }
      }}
    >
      <DialogTitle sx={{ color: '#00A1FF', p: 2, textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <FontAwesomeIcon icon={faHandHoldingHand} style={{ color: '#00A1FF', marginRight: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Reassign Agent
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'visible',
          overflowX: 'visible',
          px: 4,
        }}
      >
        <Box width="100%" maxWidth="400px">
          <Box display="flex" justifyContent="center" width="100%">
            <Box width="94%">
              <CollaboratorAutoComplete
                agents={agents}
                selectedEmails={selectedAgent ? [selectedAgent] : []}
                onChange={(emails) => setSelectedAgent(emails[0] || '')}
                label="Select agent"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <ActionButtons
        onCancel={handleCancel}
        onConfirm={handleReassign}
        confirmDisabled={!selectedAgent}
        confirmLabel="Reassign"
      />
    </Dialog>
  );
};

export default ChangeAgentModal;
