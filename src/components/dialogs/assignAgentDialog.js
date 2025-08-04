import React from "react";
import {
  Dialog, DialogContent, DialogActions, Box, Grid,
  Button, Typography, Card, DialogTitle
} from "@mui/material";
import { assignAgent, changeStatus } from "../../utils/apiTickets";
import ProfilePic from "../components/profilePic";
import { icons } from '../auxiliars/icons';

const AssignAgentModal = ({ open, onClose, ticket, agentEmail, dispatch, setLoading }) => {
  const handleAssign = async () => {
    try {
      const result = await assignAgent(dispatch, setLoading, ticket.id, agentEmail, agentEmail);
      if (result.success) {
        await changeStatus(dispatch, setLoading, ticket.id, agentEmail,'In Progress') //cambiar status a in progress
        onClose();
      }
      
    } catch (error) {
      console.error("Error asignando agente:", error);
      alert("No se pudo asignar el agente: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          width: '500px',
          maxWidth: '90%',
          borderRadius: '15px',
        },
    }}>
      <DialogTitle sx={{ color: '#00A1FF', px: 4, pt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Título e icono */}
          <Box display="flex" alignItems="center">
            <icons.assignToMe size={20} style={{ color: '#00A1FF', marginRight: 8 }} />
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#00A1FF' }}>
              New Ticket
            </span>
          </Box>

          {/* Imagen del agente */}
          <ProfilePic />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {ticket && (
              <>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Patient Name</strong><br /> {ticket.patient_name}</Typography></Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>DOB</strong><br /> {ticket.patient_dob}</Typography></Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Phone</strong><br /> {ticket.phone}</Typography></Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, border: 'none' }}>
                    <Typography variant="body2">
                      <strong>Call Reason</strong><br /> {ticket.call_reason}
                    </Typography>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ mt: 0, mb: 1.5, mr: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleAssign}
            sx={{
              width: '130px',
              height: '44px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#00A1FF',
              backgroundColor: '#DFF3FF',
              border: '2px solid #00A1FF',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#00A1FF',
                color: '#FFFFFF',
              },
            }}
          >
            Assign To me
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AssignAgentModal;
