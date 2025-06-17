import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
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
        sx: { width: '100%', maxWidth: '320px', borderRadius: '15px' }
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
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                    labelId="department-label"
                    id="department-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    input={<OutlinedInput label="Department" />}
                    sx={{
                    fontSize: 16,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#aaa',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00a1ff',
                    },
                    }}
                >
                    <MenuItem value="OTC">OTC</MenuItem>
                    <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                    <MenuItem value="Referrals">Referrals</MenuItem>
                </Select>
                </FormControl>
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
