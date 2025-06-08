import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from '@mui/material';
import DepartmentSelect from '../components/departmentSelect';
import ActionButtons from '../auxiliars/actionButtons';
import { BsHousesFill } from 'react-icons/bs';

const ChangeDepartmentModal = ({
  open,
  onClose,
  onChangeDepartment
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleChange = async () => {
    if (onChangeDepartment && selectedDepartment) {
      await onChangeDepartment(selectedDepartment);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedDepartment('');
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
            Change Department
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
              <DepartmentSelect value={selectedDepartment} onChange={setSelectedDepartment} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <ActionButtons
        onCancel={handleCancel}
        onConfirm={handleChange}
        confirmDisabled={!selectedDepartment}
        confirmLabel="Change"
      />
    </Dialog>
  );
};

export default ChangeDepartmentModal;
