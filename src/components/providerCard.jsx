import React from 'react';
import { Card, Box, Typography, Chip } from '@mui/material';
import SpecialtyAvatar from '../components/specialtyAvatar';
import AddressLink from './addressLink';
import PhoneCallLink from './components/phoneCallLink';
import { useSettings } from '../context/settingsContext';

const getPhoneRaw = (p) =>
  p['Office_Phone'] ||
  p['Phone'] ||
  p['Phone_Number'] ||
  p['Practice_Phone'] ||
  p['Office_Phone_Number'] ||
  p['Telephone'] ||
  '';

const ProviderCard = ({ provider, isLastItem, lastProviderRef, onSelect }) => {
  const first = provider['First_Name'] || 'N/A';
  const last = provider['Last_Name'] || 'N/A';
  const providerName = provider['Provider_Name'] || `${first} ${last}`.trim();
  const { settings } = useSettings();

  return (
    <Card
      ref={isLastItem ? lastProviderRef : null}
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
      onClick={() => onSelect(provider)}
    >
      <Box sx={{ mr: 2 }}>
        <SpecialtyAvatar taxonomy={provider['Taxonomy_Description']} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="#333">
            {first} {last}
          </Typography>
          {provider.InHouse === 'TRUE' && (
            <Chip
              label="In House"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 500,
                padding: '0 2px',
                bgcolor: '#00A1FF',
                color: 'white',
                borderRadius: '999px',
                ml: 0.7,
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{ color: '#6c757d', fontWeight: 500, fontSize: '0.75rem', letterSpacing: 0.3 }}
        >
          {providerName}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#5B5F7B', fontWeight: 400, fontSize: '0.7rem', fontStyle: 'italic' }}
        >
          {provider['Taxonomy_Description'] || 'No specialty'}
        </Typography>

        <AddressLink
          line1={
            provider['Office_Address'] ||
            provider['Address_Line1'] ||
            provider['Practice_Address'] ||
            ''
          }
          city={provider['Office_City'] || provider['City'] || ''}
          state={provider['Office_State'] || provider['State'] || ''}
          zip={provider['Office_Zip'] || provider['Zip'] || provider['Zip_Code'] || provider['PostalCode']}
          zip4={provider['Office_Zip4'] || provider['Zip4'] || provider['Zip_Plus_4'] || provider['ZIP+4']}
          sx={{ mr: 1.5 }}
        />

        <PhoneCallLink
            key={settings.confirmBeforeCall ? 'confirm-on' : 'confirm-off'}
            phoneRaw={getPhoneRaw(provider)}
            contactName={providerName}
            prefKey="callConfirm.providers"
        />
      </Box>
    </Card>
  );
};

export default ProviderCard;
