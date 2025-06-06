import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const StatusFilterBoxes = ({ statusColors, selectedStatus, setSelectedStatus, ticketsCountByStatus }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2.5,
        mb: 3,
        justifyContent: 'center',
        px: 4,
      }}
    >
      {Object.keys(statusColors).map((status) => (
        <Button
          key={status}
          onClick={() => setSelectedStatus(status)}
          variant={selectedStatus === status ? 'contained' : 'outlined'}
          sx={{
            flex: '1 1 200px',
            aspectRatio: '1 / 0.5',
            textTransform: 'none',
            borderRadius: 4,
            backgroundColor: statusColors[status].bg,
            color: statusColors[status].text,
            borderColor: statusColors[status].text,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: statusColors[status].bg,
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" lineHeight={1}>
            {ticketsCountByStatus[status] || 0}
          </Typography>
          <Typography fontSize={14} fontWeight="bold" sx={{ mt: 0.5 }}>
            {status}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default StatusFilterBoxes;
