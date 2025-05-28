import React from "react";
import {
  Dialog, DialogContent, DialogActions, Box, Grid,
  Button, Typography, Card
} from "@mui/material";
import { assignAgent } from "../../utils/api";
import ProfilePic from "../components/profilePic";

const AssignAgentModal = ({ open, onClose, ticket, agentEmail, dispatch, setLoading, onAssign }) => {
  const handleAssign = async () => {
    try {
      await assignAgent(dispatch, setLoading, ticket.id, agentEmail, agentEmail); // desde ticket viene el actual, y tú eres el nuevo
      onAssign(); // para refrescar datos en el padre
      onClose();
    } catch (error) {
      console.error("Error asignando agente:", error);
      alert("No se pudo asignar el agente: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth        PaperProps={{
        sx: {
        width: '500px', // o cualquier valor que necesites
        maxWidth: '90%',
        },
    }}>
      <DialogContent dividers>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><ProfilePic /></Grid>
            {ticket && (
              <>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Patient Name</strong><br /> {ticket.patient_name}</Typography></Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Patient DOB</strong><br /> {ticket.patient_dob}</Typography></Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Phone</strong><br /> {ticket.phone}</Typography></Card>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Call Reason</strong><br /> {ticket.call_reason}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAssign}
          variant="contained"
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
