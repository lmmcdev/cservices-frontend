import React from 'react';
import { Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';

const StatusFilterBoxes = ({ selectedStatus, setSelectedStatus, ticketsCountByStatus }) => {
  const statuses = ['New', 'Emergency', 'In Progress', 'Pending', 'Done', 'Duplicated', 'Total'];

  return (
    <>
    
    <Grid container spacing={2} mb={6} ml={4} >
        {statuses.map((status) => {
          const bgColor = getStatusColor(status, 'bg');
          const textColor = getStatusColor(status, 'text');
          

          return (
            <Grid size={2} height='30%' key={status}  onClick={() => setSelectedStatus(status)} sx={{width:'13.2%'}}>
              <Card
                sx={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderLeft: `6px solid ${textColor}`,
                  boxShadow: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    {status}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {ticketsCountByStatus[status] || 0}
                  </Typography>
                  <Chip
                    label={status}
                    sx={{
                      backgroundColor: textColor,
                      color: 'white',
                      mt: 1,
                    }}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    

    
    </>



    
  );
};

export default StatusFilterBoxes;