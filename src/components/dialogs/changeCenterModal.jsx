import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from '@mui/material';
import CenterSelect from '../components/fields/centerSelect';
import ActionButtons from '../components/fields/actionButtons';
import { Shuffle } from 'phosphor-react';

const ChangeCenterModal = ({
  open,
  onClose,
  onChangeCenter
}) => {
  const [selectedCenter, setSelectedCenter] = useState('');

  const handleChange = async () => {
    if (onChangeCenter && selectedCenter) {
        onChangeCenter(selectedCenter)
      //await onChangeCenter(selectedCenter);
    }
    //onClose();
  };

  const handleCancel = () => {
    setSelectedCenter('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '320px',
          borderRadius: '15px' // mismo roundness que el otro modal
        }
      }}
    >
      <DialogTitle sx={{ color: '#00A1FF', p: 2, textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Shuffle size={20} weight="bold" color="#00A1FF" style={{ marginRight: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Transfer to Center
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
              <CenterSelect value={selectedCenter} onChange={setSelectedCenter} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <ActionButtons
        onCancel={handleCancel}
        onConfirm={handleChange}
        confirmDisabled={!selectedCenter}
        confirmLabel="Transfer"
      />
    </Dialog>
  );
};

export default ChangeCenterModal;
