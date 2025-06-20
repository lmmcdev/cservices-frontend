// src/components/customerSatisfaction.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const getColor = (value) => {
  if (value < 40) return '#ff6692';     // Rojo
  if (value < 70) return '#ffb900';     // Amarillo
  return '#00b8a3';                     // Verde
};

const getEmoji = (value) => {
  if (value < 40)
    return <SentimentVeryDissatisfiedIcon sx={{ fontSize: 40 }} />;
  if (value < 70)
    return <SentimentNeutralIcon sx={{ fontSize: 40 }} />;
  return <SentimentVerySatisfiedIcon sx={{ fontSize: 40 }} />;
};

export default function CustomerSatisfaction() {
  const score = 56; // Mock score
  const color = getColor(score);

  const data = [
    {
      name: 'Satisfaction',
      value: score,
      fill: color,
    },
  ];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={18}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </Box>
      <Box mt={-5} display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Typography variant="h4" fontWeight="bold" sx={{ color }}>
          {score}
        </Typography>
        <Box color={color}>{getEmoji(score)}</Box>
      </Box>
      <Typography variant="h6" sx={{ color: color, mt: 1 }}>
        Customer Satisfaction
      </Typography>
    </Box>
  );
}
