import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Tabs, Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProviderListContainer from '../components/providers/providerList';
import SearchPatientDeepContainer from '../components/patients/patientsDeepSeacrh';

const RelateTicketModal = ({ open, onClose, onSelect }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Relate This Ticket
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
        <Tab label="Patient" />
        <Tab label="Provider" />
      </Tabs>

      <DialogContent dividers>
        {tab === 0 && (
          <SearchPatientDeepContainer onSelect={onSelect} />
        )}
        {tab === 1 && (
          <ProviderListContainer onSelect={onSelect} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RelateTicketModal;
