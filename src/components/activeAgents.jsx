import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

export default function ActiveAgents() {
  const activeCount = 6; // Reemplaza con datos reales si los tienes

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#999', letterSpacing: 1, mb: 0.5 }}
          >
            Active Agents
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#00a1ff', lineHeight: 1 }}
          >
            {activeCount}
          </Typography>
        </CardContent>

        <GroupIcon
          sx={{
            position: 'absolute',
            fontSize: '8rem',
            color: '#e0f7ff',
            opacity: 0.4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        />
      </Card>
    </Box>
  );
}
