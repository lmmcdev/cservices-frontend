import React from 'react';
import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';

const statuses = [
  'New',
  'Emergency',
  'In Progress',
  'Pending',
  'Done',
  'Duplicated',
  'Total',
];

const StatusFilterBoxes = ({ selectedStatus, setSelectedStatus, ticketsCountByStatus }) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        px: 2,
      }}
    >
      {statuses.map((status) => {
        const bgColor = getStatusColor(status, 'bg');
        const textColor = getStatusColor(status, 'text');
        const count = ticketsCountByStatus[status] ?? 0;

        return (
          <Grid
            item
            key={status}
            sx={{
              flex: '1 1 0',
              display: 'flex',
              minWidth: 0,
            }}
            onClick={() => setSelectedStatus(status)}
          >
            <Card
              sx={{
                width: '100%',
                height: {
                  xs: 120,
                  sm: 140,
                  md: 160,
                  lg: 180,
                  xl: 200,
                },
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `6px solid ${textColor}`,
                boxShadow: 2,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" fontWeight="bold" lineHeight={1}>
                  {count}
                </Typography>
                <Chip
                  label={status}
                  size="small"
                  sx={{
                    backgroundColor: textColor,
                    color: '#fff',
                    mt: 1,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatusFilterBoxes;
