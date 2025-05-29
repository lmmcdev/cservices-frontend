// src/components/TicketStatusBar.jsx
import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
};

const TicketStatusBar = ({ currentStatus, onStatusChange }) => {
  const statuses = Object.keys(statusColors);

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
      <Box display="flex" mt={2} borderRadius={2} overflow="hidden" boxShadow={1}>
        {Object.entries(statusColors).map(([status, { bg, text }]) => {
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
                fontWeight: isActive ? 'bold' : 'normal',
                borderTop: isActive ? `2px solid ${text}` : '1px solid transparent',
                borderBottom: isActive ? `2px solid ${text}` : '1px solid transparent',
                borderRight: isActive ? `2px solid ${text}` : '1px solid transparent',
                borderLeft: isActive ? `2px solid ${text}` : '1px solid transparent',
                '&:last-child': { borderRight: 'none' },
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Typography variant="body2">{status}</Typography>
            </Box>
          );
        })}
      </Box>

      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Changing status</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to change ticket status from <strong>{currentStatus}</strong> to <strong>{pendingStatus}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketStatusBar;