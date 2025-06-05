// statusFilterBoxes.jsx
import React from 'react';
import { Button, Box } from '@mui/material';

const StatusFilterBoxes = ({ statusColors, selectedStatus, setSelectedStatus, ticketsCountByStatus }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
      {Object.keys(statusColors).map((status) => (
        <Button
          key={status}
          onClick={() => setSelectedStatus(status)}
          variant={selectedStatus === status ? 'contained' : 'outlined'}
          sx={{
            minWidth: 180,
            aspectRatio: '1 / 0.5',
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 'bold',
            borderRadius: 4,
            backgroundColor: statusColors[status].bg,
            color: statusColors[status].text,
            borderColor: statusColors[status].text,
            '&:hover': {
              backgroundColor: statusColors[status].bg,
            },
          }}
        >
          {ticketsCountByStatus[status] || 0} <br />
          {status}
        </Button>
      ))}
    </Box>
  );
};

export default StatusFilterBoxes;
