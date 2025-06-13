// src/components/SuspenseFallback.jsx
import React from 'react';
import { Box, Skeleton, Stack, Paper } from '@mui/material';

const SuspenseFallback = () => {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={1} sx={{ p: 4, width: '100%', maxWidth: 800 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rounded" height={40} width="30%" />
        </Stack>
      </Paper>
    </Box>
  );
};

export default SuspenseFallback;
