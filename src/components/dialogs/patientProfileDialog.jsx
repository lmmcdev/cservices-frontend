import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Tooltip,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import ActionButtons from '../actionButtons';
import usePhoneHistory from '../components/phoneHistory';
import { useNavigate } from 'react-router-dom';

const isSameDay = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;

  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

const PatientProfileDialog = ({
  open,
  onClose,
  patientName,
  patientDob,
  patientPhone,
  currentTicket
}) => {
  const { history: allCases, error } = usePhoneHistory(patientPhone);
const navigate = useNavigate();

  // Divide los casos en llamadas del día actual y el resto
  const today = new Date().toISOString();

  const todayCases = allCases?.filter((item) =>
    isSameDay(item.creation_date, today)
  ) || [];

  const otherCases = allCases?.filter((item) =>
    !isSameDay(item.creation_date, today)
  ) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#00a1ff',
          fontWeight: 'bold'
        }}
      >
        <i className="fa fa-id-card" style={{ fontSize: 18 }} />
        Patient Profile
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" gap={4}>
          {/* LEFT COLUMN: Patient Info + Today's Activity */}
          <Box flex={1}>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {patientName || 'N/A'}
            </Typography>
            <Typography variant="subtitle1">
              <strong>DOB:</strong> {patientDob || 'N/A'}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <strong>Phone:</strong> {patientPhone || 'N/A'}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="h6" gutterBottom>
              Today's Activity
            </Typography>

            {error ? (
              <Typography color="error">{error}</Typography>
            ) : !allCases ? (
              <CircularProgress size={20} />
            ) : todayCases.length > 0 ? (
              <List dense>
                {todayCases.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Call Reason: ${item.call_reason}`}
                      secondary={`Summary: ${item.summary}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No calls found for today.
              </Typography>
            )}
          </Box>

          {/* RIGHT COLUMN: Other History */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">History</Typography>
              <Tooltip title="Filter cases">
                <IconButton size="small">
                  <i className="fa fa-filter" />
                </IconButton>
              </Tooltip>
            </Box>

            {error ? (
              <Typography color="error">{error}</Typography>
            ) : !allCases ? (
              <CircularProgress size={20} />
            ) : otherCases.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={0.5} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {otherCases.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 1,
                      borderLeft: '4px solid #00a1ff',
                      backgroundColor: '#fdfdfd',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f0f8ff' }
                    }}
                    onClick={() =>
                      navigate(`/tickets/edit/${item.id}`, {
                        state: {
                          ticket: item
                        },
                      })
                    }
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.call_reason || 'No reason'}
                    </Typography>

                    

                    <Box display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      <span>Caller: {item.caller_id || 'N/A'}</span>
                      <span>{new Date(item.creation_date).toLocaleDateString()}</span>
                      <span>Status: {item.status}</span>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No previous cases found.
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
