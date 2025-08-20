// src/components/feedback/EmptyState.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * EmptyState
 * Un bloque de "estado vacío" reutilizable para listas/tablas sin datos.
 *
 * Props:
 * - title: string
 * - description: string
 * - icon: ReactNode (opcional)
 * - action: ReactNode (opcional) -> ej: <Button>Crear</Button>
 * - variant: 'plain' | 'soft' | 'card'
 * - align: 'left' | 'center'
 * - sx: estilos adicionales MUI
 */
export default function EmptyState({
  title = 'Nothing here…',
  description = 'There is no content to display yet.',
  icon,
  action,
  variant = 'soft',
  align = 'center',
  sx,
}) {
  const content = (
    <Stack
      alignItems={align === 'center' ? 'center' : 'flex-start'}
      textAlign={align}
      spacing={1.2}
      sx={{ py: 3, px: 2 }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: (t) =>
            variant === 'plain'
              ? 'transparent'
              : t.palette.mode === 'light'
              ? 'rgba(0, 161, 255, 0.08)'
              : 'rgba(0, 161, 255, 0.16)',
        }}
      >
        {icon ?? <InfoOutlinedIcon sx={{ opacity: 0.8 }} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      {action && <Box sx={{ pt: 0.5 }}>{action}</Box>}
    </Stack>
  );

  if (variant === 'card') {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: (t) =>
            t.palette.mode === 'light'
              ? '1px dashed rgba(0,0,0,0.08)'
              : '1px dashed rgba(255,255,255,0.12)',
          bgcolor: (t) =>
            t.palette.mode === 'light' ? '#fff' : 'rgba(255,255,255,0.04)',
          ...sx,
        }}
      >
        {content}
      </Paper>
    );
  }

  // variant: 'soft' o 'plain'
  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: (t) =>
          variant === 'soft'
            ? t.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.02)'
              : 'rgba(255, 255, 255, 0.04)'
            : 'transparent',
        ...sx,
      }}
    >
      {content}
    </Box>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  variant: PropTypes.oneOf(['plain', 'soft', 'card']),
  align: PropTypes.oneOf(['left', 'center']),
  sx: PropTypes.object,
};
