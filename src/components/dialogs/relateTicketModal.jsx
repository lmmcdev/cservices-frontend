import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Tabs, Tab, Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProviderListContainer from '../components/providers/providerList';
import SearchPatientDeepContainer from '../components/patients/patientsDeepSearch';

const RelateTicketModal = ({ open, onClose, onSelect, relateTicketAction }) => {
  const [tab, setTab] = useState(0);
 const [selectedPatient, ] = useState(null);



  
  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        sx={{
            '& .MuiPaper-root': {
            maxHeight: '80vh',  // evita que crezca a pantalla completa si no hay contenido
            height: 'auto',
            },
        }}
        >
      {/* Encabezado con título + botón de cierre */}
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: 0,
          position: 'relative',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            overflow: 'visible',
            alignItems: 'flex-end',
          }}
        >
          <DialogTitle
            sx={{
              p: 0,
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            Relate This Ticket {relateTicketAction === 'relate_patient' ? 'Paciente' : 'Entidad'}
          </DialogTitle>

          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{
                minHeight: 'unset',
                mr: 6,
                '& .MuiTabs-indicator': {
                display: 'none',
                },
                '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                backgroundColor: '#f0f0f0',
                color: '#666',
                px: 4,
                py: 1.2,
                mx: 1,
                minHeight: 'unset',
                borderBottom: '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: '#e0ecff',
                    color: '#00A1FF',
                },
                },
                '& .Mui-selected': {
                backgroundColor: '#DFF3FF',
                color: '#00A1FF',
                borderBottom: '2px solid #00A1FF',
                },
            }}
            >
            <Tab label="Patient" />
            <Tab label="Provider" />
        </Tabs>
        </Box>

        {/* Botón de cierre en la esquina superior derecha */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#6c757d',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
            px: 4,
            pt: 3,
            overflow: 'visible', // permite que crezca naturalmente
        }}
        >
        {tab === 0 && <SearchPatientDeepContainer onSelect={onSelect} selectedPatientFunc={selectedPatient} />}
        {tab === 1 && <ProviderListContainer onSelect={onSelect} />}
      </DialogContent>

      
    </Dialog>
  );
};

export default RelateTicketModal;
