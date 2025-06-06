import React from 'react';
import {
  Chip,
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
import FilterListIcon from '@mui/icons-material/FilterList';

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

  //Colores de los status
    const statusColors = {
        New: { bg: '#FFE2EA', text: '#FF6692' },
        Emergency: { bg: '#FFF5DA', text: '#FFB900' },
        'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
        Pending: { bg: '#EAE8FA', text: '#8965E5' },
        Done: { bg: '#DAF8F4', text: '#00B8A3' },
        Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
    };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#00a1ff',
            fontWeight: 'bold',
        }}
        >
        <Box display="flex" alignItems="center" gap={1}>
            <i className="fa fa-id-card" style={{ fontSize: 18 }} />
            Profile
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: '#999' }}>
            <i className="fa fa-close" style={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pb: 4 }}>
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
                  <Paper key={index}
                    elevation={1}
                    sx={{
                      p: 1,
                      borderLeft: `4px solid ${statusColors[item.status]?.text || '#ccc'}`,
                      backgroundColor: '#fdfdfd',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#F3F4F6' }
                    }}
                    onClick={() =>
                      navigate(`/tickets/edit/${item.id}`, {
                        state: {
                          ticket: item
                        },
                      })
                    }>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.call_reason || 'No reason'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        <span>{item.caller_id || 'N/A'}</span>
                        <span>{new Date(item.creation_date).toLocaleDateString()}</span>
                        <Chip
                            label={item.status}
                            sx={{
                                backgroundColor: statusColors[item.status]?.bg || '#e0e0e0',
                                color: statusColors[item.status]?.text || '#000',
                                fontWeight: 'bold',
                                fontSize: 11,
                                px: 0.5,
                                py: 0,
                                height: 20,
                                borderRadius: '12px'
                            }}
                          />
                      </Box>
                  </Paper>
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
              <Typography variant="h6" gutterBottom>History</Typography>
              <Tooltip title="Filter cases">
                <IconButton size="small">
                  <FilterListIcon sx={{ fontSize: 20 }} />
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
                      borderLeft: `4px solid ${statusColors[item.status]?.text || '#ccc'}`,
                      backgroundColor: '#fdfdfd',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#F3F4F6' }
                    }}
                    onClick={() =>
                      navigate(`/tickets/edit/${item.id}`, {
                        state: {
                          ticket: item
                        },
                      })
                    }
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.call_reason || 'No reason'}
                    </Typography>

                    

                    <Box display="flex" justifyContent="space-between" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      <span>{item.caller_id || 'N/A'}</span>
                      <span>{new Date(item.creation_date).toLocaleDateString()}</span>
                      <Chip
                        label={item.status}
                        sx={{
                            backgroundColor: statusColors[item.status]?.bg || '#e0e0e0',
                            color: statusColors[item.status]?.text || '#000',
                            fontWeight: 'bold',
                            fontSize: 11,
                            px: 0.5,
                            py: 0,
                            height: 20,
                            borderRadius: '12px'
                        }}
                      />
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
    </Dialog>
  );
};

export default PatientProfileDialog;
