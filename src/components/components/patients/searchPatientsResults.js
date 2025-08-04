import React from 'react';
import {
  Box, Card, Typography, CircularProgress, Tooltip
} from '@mui/material';
//import CloseIcon from '@mui/icons-material/Close';
import { flags } from '../../auxiliars/icons';
//import FemaleIcon from '@mui/icons-material/Female';
//import MaleIcon from '@mui/icons-material/Male';
//import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CakeIcon from '@mui/icons-material/Cake';

const getLanguageCode = (languageString) => {
  if (!languageString) return null;
  const lowerLang = languageString.toLowerCase();
  if (lowerLang.includes('spanish')) return 'es';
  if (lowerLang.includes('english')) return 'us';
  if (lowerLang.includes('french')) return 'fr';
  if (lowerLang.includes('portuguese')) return 'pt';
  if (lowerLang.includes('creole')) return 'ht';
  return null;
};


const isBirthdayToday = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const today = new Date();
  return (
    birthDate.getDate() === today.getDate() &&
    birthDate.getMonth() === today.getMonth()
  );
};

const getRegionColor = (location) => {
  if (!location) return '#f0f0f0';

  const cleanLocation = location.toLowerCase();

  const southMiamiDade = ['homestead', 'cutler ridge', 'west kendall', 'bird road', 'westchester'];
  const northMiamiDade = [
    'miami', 'marlins park', 'east hialeah', 'hialeah', 'west hialeah',
    'miami gardens', 'miami beach', 'miami 27th ave', 'n miami', 'n miami beach'
  ];
  const broward = ['pembroke pines', 'plantation', 'hiatus', 'tamarac', 'hollywood'];
  const palmBeach = ['west palm beach'];

  if (southMiamiDade.some(loc => cleanLocation.includes(loc))) return '#d0f0e8';       // verde suave
  if (northMiamiDade.some(loc => cleanLocation.includes(loc))) return '#e0f0ff';       // azul muy suave
  if (broward.some(loc => cleanLocation.includes(loc))) return '#fef3d6';              // amarillo suave
  if (palmBeach.some(loc => cleanLocation.includes(loc))) return '#f6e0f7';            // rosado suave

  return '#f0f0f0';
};

const SearchPatientResults = ({
  results,
  loading,
  inputValue,
  lastElementRef,
  onPatientClick,
}) => {
  
  return (
    <>
      <Box sx={{ mt: 3, pt: 1, px: 3, maxHeight: '55vh', overflowY: 'auto' }}>
        {results.map((patient, index) => {
          const isLast = index === results.length - 1;
          const langCode = getLanguageCode(patient.Language);
          //const genderIcon = getGenderIcon(patient.Gender);
          //const age = calculateAge(patient.DOB);

          return (
            <Card
              key={patient.id || index}
              ref={isLast ? lastElementRef : null}
              sx={{
                display: 'flex',
                px: 2,
                py: 2,
                mb: 2,
                borderRadius: '20px',
                border: '1px solid #e0e0e0',
                backgroundColor: '#f9fbfd',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#eaf6ff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  borderColor: '#00a1ff',
                },
              }}
              onClick={() => onPatientClick(patient)}
            >
              <Box sx={{ position: 'relative', width: 75, height: 75, mr: 2 }}>
                {/* Avatar */}
                <Box
                  component="img"
                  src={
                    patient.Gender?.toLowerCase().startsWith('f')
                      ? '/avatars/elderly_female.png'
                      : '/avatars/elderly_male.png'
                  }
                  alt="Patient Avatar"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                {/* Marco de cumpleaños ajustado */}
                {isBirthdayToday(patient.DOB) && (
                  <Box
                    component="img"
                    src="/assets/birthday_frame.png"
                    alt="Birthday Frame"
                    sx={{
                      position: 'absolute',
                      top: '-32%',
                      left: '-26%',
                      width: '153%',
                      height: '153%',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#333">
                  {patient.Name || 'No name'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6c757d',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                    }}
                  >
                    <strong>DOB:&nbsp;</strong>{patient.DOB ? new Date(patient.DOB).toLocaleDateString() : 'N/A'}
                    {isBirthdayToday(patient.DOB) && (
                      <Tooltip title="Happy Birthday!" arrow>
                        <CakeIcon sx={{ ml: 1, color: '#ff4081', fontSize: 17 }} />
                      </Tooltip>
                    )}
                  </Typography>

                  {/* Punto separador con espacio mínimo */}
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: '#6c757d',
                      mx: 1,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6c757d',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                    }}
                  >
                  <strong>PCP:</strong> {patient.PCP}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: getRegionColor(patient.Location_Name),
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#333',
                    mt: 1, // ← aquí aumentas el margen superior
                    mb: 0.3,
                    maxWidth: 'fit-content'
                  }}
                >
                  {patient.Location_Name || 'N/A'}
                </Box>             

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>
                  {(langCode && flags[langCode]) && (
                    <Box
                      component="img"
                      src={flags[langCode]}
                      alt={langCode}
                      sx={{ width: 16, height: 16, mr: 0.8 }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {patient.Language || ''}
                  </Typography>
                </Box>
    
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block' }}>
                  {patient.Email && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block' }}>
                      {patient.Email.toLowerCase()}
                    </Typography>
                  )}
                </Typography>
              </Box>
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

        {/**
         * 
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
                <ListItem key={ticket.id} divider>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {ticket.call_reason || 'No Reason'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Status: {ticket.status} | Created: {ticket.creation_date}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
      
         */}
    </>
  );
};

export default SearchPatientResults;
