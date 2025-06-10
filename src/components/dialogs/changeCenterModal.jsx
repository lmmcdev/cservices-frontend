import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from '@mui/material';
import CenterSelect from '../components/centerSelect';
import ActionButtons from '../auxiliars/actionButtons';
import { BsHousesFill } from 'react-icons/bs';

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
        sx: { width: '100%', maxWidth: '320px' }
      }}
    >
      <DialogTitle sx={{ color: '#00A1FF', p: 2, textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <BsHousesFill style={{ color: '#00A1FF', marginRight: 8, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Change Center
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
        confirmLabel="Change"
      />
    </Dialog>
  );
};

export default ChangeCenterModal;
