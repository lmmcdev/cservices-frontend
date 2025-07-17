import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const getColor = (value) => {
  if (value < 40) return '#ff6692';
  if (value < 70) return '#ffb900';
  return '#00b8a3';
};

const getEmoji = (value) => {
  if (value < 40)
    return <SentimentVeryDissatisfiedIcon sx={{ fontSize: 40 }} />;
  if (value < 70)
    return <SentimentNeutralIcon sx={{ fontSize: 40 }} />;
  return <SentimentVerySatisfiedIcon sx={{ fontSize: 40 }} />;
};

export default function CustomerSatisfaction() {
  const score = 86;
  const color = getColor(score);

  const data = [
    {
      name: 'Satisfaction',
      value: score,
      fill: color,
    },
  ];

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Card
        sx={{
          borderRadius: 2,
          width: 220,
          height:120,
          borderLeft: `6px solid ${getColor(score)}`,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
        }}
      >
        <CardContent
          
        >
          <Box sx={{ height: 100, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="130%"
                outerRadius="160%"
                barSize={20}
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
                  dataKey="value"
                  clockWise
                  cornerRadius={10}
                  background={{ fill: '#f5f5f5' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            {/* ✅ ICONO CENTRADO */}
            <Box
              sx={{
                position: 'absolute',
                top: '30%',
                left: '95%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
              }}
            >
              {getEmoji(score)}
            </Box>
          </Box>

          {/* ✅ TEXTO PUNTAJE ABAJO */}
          <Typography variant="h5" fontWeight="bold" sx={{ color, mt: 0 }}>
            {score}
          </Typography>
        </CardContent>

        {/* ✅ TEXTO "Customer Satisfaction" */}
        <Typography
          variant="body2"
          sx={{
            color: '#999',
            letterSpacing: 1,
            position: 'absolute',
            bottom: 5,
            left: '80%',
            transform: 'translateX(-50%)',
          }}
        >
          Customer Satisfaction
        </Typography>
      </Card>
    </Box>
  );
}
