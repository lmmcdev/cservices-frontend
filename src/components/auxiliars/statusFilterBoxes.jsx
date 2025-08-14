// src/components/statusFilterBoxes.jsx

import React from 'react';
import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { getStatusColor } from '../../utils/js/statusColors';

const statuses = [
  'New',
  'Emergency',
  'In Progress',
  'Pending',
  'Done',
  'Duplicated',
  'Total',
];

export default function StatusFilterBoxes({ selectedStatus, setSelectedStatus, ticketsCountByStatus }) {
  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={0}
      sx={{
        width: '100%',
        flexWrap: 'nowrap',
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
                // Alturas reducidas y responsive
                height: {
                  xs: 70,   // 70px en móvil
                  sm: 90,   // 90px en >=600px
                  md: 110,  // 110px en >=900px
                  lg: 130,  // 130px en >=1200px
                  xl: 150,  // 150px en >=1536px
                },
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `6px solid ${textColor}`,
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
                {/* count mantiene su tamaño h4 original */}
                <Typography variant="h4" fontWeight="bold" lineHeight={1}>
                  {count}
                </Typography>
                {/* label mantiene su tamaño original */}
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
}
