import React from 'react';
import { useStats } from '../context/statsContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { getStatusColor } from '../utils/js/statusColors';

export default function StatsScreen() {
    const { state } = useStats();
    const statistics = state.statistics;

    const entries = Object.entries(statistics).filter(
        ([key]) => key !== 'total'
    );
    return (
        <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Ticket Stats (Total: {state.total || 0})
      </Typography>

      <Grid container spacing={2}>
        {entries.map(([status, count]) => {
          const bgColor = getStatusColor(status, 'bg');
          const textColor = getStatusColor(status, 'text');

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={status}>
              <Card
                sx={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderLeft: `6px solid ${textColor}`,
                  boxShadow: 2,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    {status}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {count}
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
    </Box>
    )

}