import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Tooltip,
  IconButton,
  Paper
} from '@mui/material';
import ActionButtons from '../actionButtons';

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const PatientProfileDialog = ({ open, onClose, patient, allCases = [], currentTicket }) => {
  const todayCases = allCases.filter((item) =>
    isSameDay(item.creation_date, currentTicket?.creation_date)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#00a1ff', fontWeight: 'bold' }}>
        <i className="fa fa-id-card" style={{ fontSize: 18 }} />
        Patient Profile
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={4}>
          {/* LEFT COLUMN: Patient Info + Today Activity */}
          <Box flex={1}>
            <Typography variant="subtitle1"><strong>Name:</strong> {patient?.name || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>DOB:</strong> {patient?.dob || 'N/A'}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <strong>Phone:</strong> {patient?.phone || 'N/A'}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="h6" gutterBottom>Today's Activity</Typography>
            {todayCases.length > 0 ? (
              <List dense>
                {todayCases.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Call today with ID: ${item.id}`}
                      secondary={`Time: ${new Date(item.creation_date).toLocaleTimeString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No calls found for this phone number today.
              </Typography>
            )}
          </Box>

          {/* RIGHT COLUMN: History */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">History</Typography>
              <Tooltip title="Filter cases">
                <IconButton size="small">
                  <i className="fa fa-filter" />
                </IconButton>
              </Tooltip>
            </Box>

            {allCases.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {allCases.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 2,
                      borderLeft: '4px solid #00a1ff',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Case ID: {item.id}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(item.creation_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {item.status}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No case history found for this patient.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <ActionButtons onCancel={onClose} cancelLabel="Close" />
      </DialogActions>
    </Dialog>
  );
};

export default PatientProfileDialog;
