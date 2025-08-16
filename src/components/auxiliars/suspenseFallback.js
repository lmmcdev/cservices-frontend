// src/components/SuspenseFallback.jsx
import React from 'react';
import {
  Box,
  Paper,
  Stack,
  Skeleton,
  Typography,
  Divider,
  LinearProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const SuspenseFallback = () => {
  const theme = useTheme();

  return (
    <Box
      role="status"
      aria-busy="true"
      sx={{
        position: 'fixed',
        inset: 0,              // top/right/bottom/left: 0
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: theme => theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.default, 0.6)
          : alpha('#f5f7fb', 0.6),
        zIndex: theme => theme.zIndex.modal + 1, // encima del layout
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 920,
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        {/* Barra de progreso superior */}
        <Box sx={{ position: 'absolute', inset: 0, top: 0, height: 3 }}>
          <LinearProgress />
        </Box>

        {/* Encabezado */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={1}>
          <Skeleton variant="circular" width={48} height={48} animation="wave" />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={28} animation="wave" />
            <Skeleton variant="text" width="26%" height={20} animation="wave" />
          </Box>
          <Skeleton variant="rounded" width={96} height={36} animation="wave" />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Cuerpo: grilla responsiva */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Panel principal */}
          <Box sx={{ flex: 2 }}>
            <Skeleton variant="rounded" height={220} animation="wave" sx={{ mb: 2 }} />
            <Stack spacing={1.2}>
              <Skeleton variant="text" width="90%" height={20} animation="wave" />
              <Skeleton variant="text" width="75%" height={20} animation="wave" />
              <Skeleton variant="text" width="82%" height={20} animation="wave" />
            </Stack>
          </Box>

          {/* Lateral */}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rounded" height={120} animation="wave" sx={{ mb: 2 }} />
            <Stack spacing={1.2}>
              <Skeleton variant="text" width="70%" height={18} animation="wave" />
              <Skeleton variant="text" width="60%" height={18} animation="wave" />
              <Skeleton variant="text" width="80%" height={18} animation="wave" />
            </Stack>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
              Cargando contenido…
            </Typography>
          </Box>
        </Stack>

        {/* Pie con acciones fantasma */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
          <Skeleton variant="rounded" width={96} height={36} animation="wave" />
          <Skeleton variant="rounded" width={128} height={36} animation="wave" />
        </Stack>
      </Paper>
    </Box>
  );
};

export default SuspenseFallback;

