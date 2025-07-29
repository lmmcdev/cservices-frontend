import React from 'react';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Chip
} from '@mui/material';
import SpecialtyAvatar from '../../specialtyAvatar';

const typeAvatars = { provider: '👨‍⚕️' };
const avatarColors = { provider: '#eae8fa', default: '#f1f5ff' };

const ProviderListUI = ({
  providers,
  lastProviderRef,
  onSelect,
  hasMore,
  loading,
  searchTerm
}) => {
  return (
    <Box
      sx={{
        mt: 3,
        pt: 1,
        px: 3,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      {providers.map((provider, index) => {
        const isLastItem = index === providers.length - 1;
        return (
          <Card
            key={provider.id}
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
            {/* Avatar */}
            <Box sx={{ mr: 2 }}>
              <SpecialtyAvatar taxonomy={provider['Taxonomy_Description']} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#333">
                  {provider["First_Name"] || "N/A"} {provider["Last_Name"] || "N/A"}
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
                {provider["Provider_Name"] || "N/A"}
              </Typography>

              {/* Taxonomy Description */}
              <Typography
                variant="body2"
                sx={{ color: '#5B5F7B', fontWeight: 400, fontSize: '0.7rem', fontStyle: 'italic' }}
              >
                {provider["Taxonomy_Description"] || "No specialty"}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#6c757d', fontWeight: 400, fontSize: '0.75rem', letterSpacing: 0.3 }}
              >
                {provider["Office_Address"] || "N/A"}
              </Typography>
            </Box>

          </Card>
        );
      })}

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* No results */}
      {!loading && providers.length === 0 && searchTerm?.length >= 2 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No providers found.
        </Typography>
      )}
    </Box>
  );
};

export default ProviderListUI;
