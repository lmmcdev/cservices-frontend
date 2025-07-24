import React from 'react';
import {
  Box, Card, CardContent, Typography, Divider, CircularProgress,
  Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SearchPatientResults = ({
  results,
  loading,
  inputValue,
  lastElementRef,
  dialogOpen,
  selectedPatient,
  tickets,
  ticketsLoading,
  onPatientClick,
  onCloseDialog
}) => {
  return (
    <>
      <Box sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto' }}>
        {results.map((patient, index) => {
          const isLast = index === results.length - 1;
          return (
            <Card
              key={patient.id || index}
              ref={isLast ? lastElementRef : null}
              sx={{ mb: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f9f9f9' } }}
              onClick={() => onPatientClick(patient)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {patient.Name || 'No name'}
                </Typography>
                <Typography variant="body2">DOB: {patient.DOB || 'N/A'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Email: {patient.Email || 'N/A'}
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Location: {patient.Location_Name || 'N/A'} -|- PCP: {patient.PCP || 'N/A'}
                </Typography>
                <Typography variant="caption">
                  Language: {patient.Language || 'N/A'} | Gender: {patient.Gender || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && results.length === 0 && inputValue.length >= 2 && (
          <Typography sx={{ textAlign: 'center', mt: 2 }}>No results found.</Typography>
        )}
      </Box>

      {/* ✅ Dialog Tickets */}
      <Dialog open={dialogOpen} onClose={onCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tickets for {selectedPatient?.Name || 'Patient'}
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '60vh' }}>
          {ticketsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : tickets.length === 0 ? (
            <Typography>No tickets found for this patient.</Typography>
          ) : (
            <List>
              {tickets.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  divider
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
                >
                  <Box sx={{ flex: 2, maxWidth: '60%' }}>
                    <Tooltip title={ticket.call_reason || 'No Reason'}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        noWrap
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {ticket.call_reason || 'No Reason'}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary">
                      Status: {ticket.status} | Created: {ticket.creation_date}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, maxWidth: '35%', textAlign: 'right' }}>
                    <Tooltip title={ticket.agent_assigned || 'No Assigned Agent'}>
                      <Typography
                        variant="body1"
                        noWrap
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {ticket.agent_assigned || 'No Assigned Agent'}
                      </Typography>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      Caller ID: {ticket.caller_id} - {ticket.assigned_department}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchPatientResults;
