import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';

const StatusFilterBoxes = ({ selectedStatus, setSelectedStatus, ticketsCountByStatus }) => {
  const statuses = ['New', 'Emergency', 'In Progress', 'Pending', 'Done', 'Duplicated', 'Total'];

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
      {statuses.map((status) => {
        const bgColor = getStatusColor(status, 'bg');
        const textColor = getStatusColor(status, 'text');

        return (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            variant={selectedStatus === status ? 'contained' : 'outlined'}
            sx={{
              flex: '1 1 200px',
              aspectRatio: '1 / 0.5',
              textTransform: 'none',
              borderRadius: 4,
              backgroundColor: bgColor,
              color: textColor,
              borderColor: textColor,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: bgColor,
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
        );
      })}
    </Box>
  );
};

export default StatusFilterBoxes;