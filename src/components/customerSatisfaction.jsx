// src/components/customerSatisfaction.jsx

import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
  FaAngry,
  FaFrown,
  FaMeh,
  FaSmile,
  FaGrinStars,
} from 'react-icons/fa';

const segments = [
  { Icon: FaAngry,     color: '#d32f2f', label: 'Terrible' },
  { Icon: FaFrown,     color: '#ff8a00', label: 'Bad'      },
  { Icon: FaMeh,       color: '#ffeb3b', label: 'Okay'     },
  { Icon: FaSmile,     color: '#8bc34a', label: 'Good'     },
  { Icon: FaGrinStars, color: '#4caf50', label: 'Great'    },
];

export default function CustomerSatisfaction() {
  const score = 86;
  const idx = Math.min(
    segments.length - 1,
    Math.floor((score / 100) * segments.length)
  );

  // Responsive icon size based on window width
  const getIconSize = () => {
    const w = window.innerWidth;
    if (w < 600) return 24;
    if (w < 900) return 32;
    return 40;
  };
  const iconSize = getIconSize();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 2,
          boxShadow: '0px 8px 24px rgba(239,241,246,1)',
        }}
      >
        {/* Caritas filled del color correspondiente */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {segments.map(({ Icon, color }, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={iconSize} color={color} />
            </Box>
          ))}
        </Box>

        {/* Barra segmentada + estrella + etiqueta */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            height: 12,
            borderRadius: 6,
            overflow: 'visible',
            mb: 4,
          }}
        >
          {segments.map(({ color }, i) => (
            <Box key={i} sx={{ flex: 1, bgcolor: color }} />
          ))}

          {/* Estrella marcando la puntuación */}
          <Box
            sx={{
              position: 'absolute',
              top: -14,
              left: `${score}%`,
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                lineHeight: 1,
                color: segments[idx].color,
              }}
            >
              ⭐
            </Typography>
          </Box>

          {/* Etiqueta debajo de la barra */}
          <Typography
            sx={{
              position: 'absolute',
              top: '100%',
              mt: 1,
              left: `${score}%`,
              transform: 'translateX(-50%)',
              fontWeight: 'bold',
              color: segments[idx].color,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
              whiteSpace: 'nowrap',
            }}
          >
            {segments[idx].label.toUpperCase()}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
