// src/components/TicketStatusBar.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

import { getStatusColor } from '../utils/js/statusColors';

const TicketStatusBar = ({ currentStatus, onStatusChange }) => {
  const [pendingStatus, setPendingStatus] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = (status) => {
    if (status !== currentStatus) {
      setPendingStatus(status);
      setConfirmOpen(true);
    }
  };

  const handleConfirm = () => {
    onStatusChange(pendingStatus);
    setConfirmOpen(false);
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingStatus(null);
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box
        width="100%"
        maxWidth="1500px"
        display="flex"
        mt={2}
        borderRadius="20px"
        boxShadow={0}
        sx={{ backgroundColor: '#fff' }}
      >
        {['New', 'Duplicated', 'Emergency', 'In Progress', 'Pending', 'Done'].map((status) => {
          const bg = getStatusColor(status, 'bg');
          const text = getStatusColor(status, 'text');
          const isActive = currentStatus === status;

          return (
            <Box
              key={status}
              flex={1}
              textAlign="center"
              onClick={() => handleClick(status)}
              sx={{
                py: 1.5,
                cursor: 'pointer',
                backgroundColor: bg,
                color: text,
                fontWeight: 'bold',
                fontSize: '1rem',
                borderTop: isActive ? `3px solid ${text}` : '1px solid transparent',
                borderBottom: isActive ? `3px solid ${text}` : '1px solid transparent',
                borderRight: isActive ? `3px solid ${text}` : '1px solid transparent',
                borderLeft: isActive ? `3px solid ${text}` : '1px solid transparent',

                /* Redondear solo la primera y la última pestaña */
                '&:first-of-type': {
                  borderTopLeftRadius: '20px',
                  borderBottomLeftRadius: '20px',
                  borderLeft: isActive ? `3px solid ${text}` : '1px solid transparent',
                },
                '&:last-of-type': {
                  borderTopRightRadius: '20px',
                  borderBottomRightRadius: '20px',
                  borderRight: isActive ? `3px solid ${text}` : '1px solid transparent',
                },

                '&:hover': { opacity: 0.9 },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Typography variant="body2" fontWeight="bold" fontSize="1rem">
                  {status}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>

      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Changing status</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to change ticket status from{' '}
            <strong>{currentStatus}</strong> to{' '}
            <strong>{pendingStatus}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketStatusBar;
