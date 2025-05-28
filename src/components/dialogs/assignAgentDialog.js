import React from "react";
import {
  Dialog, DialogContent, DialogActions, Box, Grid,
  Button, Typography
} from "@mui/material";

const AssignAgentModal = ({ open, onClose, ticket, agentEmail, onAssign }) => {
  const handleAssign = () => {
    onAssign(ticket.id, agentEmail);
    onClose();
  };

  console.log(ticket, agentEmail)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent dividers>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
        {ticket && (
            <>
            <Grid size={4} height='50%'>
                <Box>
                    <Typography variant="body2"><strong>Patient Name</strong><br /> {ticket.patient_name}</Typography>
                </Box>
            </Grid>
            <Grid size={4} height='50%'>
                <Box>
                    <Typography variant="body2" gutterBottom><strong>Patient DOB</strong><br /> {ticket.patient_dob}</Typography>
                </Box>
            </Grid>
            <Grid size={4} height='50%'>
                <Box>
                    <Typography variant="body2" gutterBottom><strong>Phone</strong><br /> {ticket.phone}</Typography>
                </Box>
            </Grid>
            <Grid size={12} height='50%'>
                <Box>
                    <Typography variant="body2" gutterBottom><strong>Call Reason</strong><br /> {ticket.call_reason}</Typography>
                </Box>
            </Grid>
            <Grid size={3} height='50%'>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>{agentEmail}</strong>
                </Typography>
          </Grid>
          </>
        )}
        </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAssign} variant="contained"
           sx={{
                backgroundColor: '#e3f2fd',
                border: '2px solid #1976d2',
                color: '#1976d2',
                fontWeight: 'bold',
                '&:hover': {
                backgroundColor: '#bbdefb',
                borderColor: '#1565c0',
                color: '#1565c0',
                },
            }}
            >
          Assign To me
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignAgentModal;
