import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const AudioVisualizer = ({ isPlaying }) => {
  const [heights, setHeights] = useState([8, 8, 8, 8, 8]); // 5 barras

    useEffect(() => {
    let interval;
    if (isPlaying) {
        interval = setInterval(() => {
        setHeights([
            8 + Math.random() * 16,
            8 + Math.random() * 20,
            8 + Math.random() * 14,
            8 + Math.random() * 18,
            8 + Math.random() * 10,
        ]);
        }, 150);
    } else {
        setHeights([8, 8, 8, 8, 8]);
    }

    return () => clearInterval(interval);
    }, [isPlaying]);


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        height: 24,
        gap: 0.5,
        mr: 1,
      }}
    >
      {heights.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: 6, // más anchas
            height: `${h}px`,
            backgroundColor: '#00a1ff',
            borderRadius: 1,
            transition: 'height 0.3s ease-in-out',
          }}
        />
      ))}
    </Box>
  );
};

export default AudioVisualizer;
