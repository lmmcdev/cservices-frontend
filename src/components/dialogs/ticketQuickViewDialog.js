// src/components/TicketQuickViewDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid, Card
} from '@mui/material';

export default function TicketQuickViewDialog({ open, onClose, ticket }) {
  if (!ticket) return null;

  const ai_data = ticket?.aiClassification;
  console.log(ticket)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{borderRadius: '15px',}}
    >
      <DialogTitle sx={{ color: '#00A1FF', px: 4, pt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Título e icono */}
          <Box display="flex" alignItems="center">
            
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#00A1FF' }}>
              Ticket Quick View
            </span>
          </Box>

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
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{p:2, border:'none'}}><Typography variant="body2"><strong>Agent</strong><br /> {ticket.agent_assigned}</Typography></Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, border: 'none' }}>
                    <Typography variant="body2">
                      <strong>Call Reason</strong><br /> {ticket.call_reason}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, border: 'none' }}>
                    <Typography variant="body2">
                      <strong>Summary</strong><br /> {ticket.summary}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, border: 'none' }}>
                    <Typography variant="body2">
                      <strong>Ticket AI Classification</strong><br /> 
                        <p>Priority: {ai_data.priority}</p>
                        <p>Risk: {ai_data.risk}</p>
                        <p>Category: {ai_data.category}</p>
                      
                    </Typography>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
