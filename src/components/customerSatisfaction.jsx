import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  SentimentVeryDissatisfied as SadIcon,
  SentimentNeutral as NeutralIcon,
  SentimentVerySatisfied as HappyIcon,
} from '@mui/icons-material';

const getColor = (v) =>
  v < 40 ? '#ff6692' :
  v < 70 ? '#ffb900' :
            '#00b8a3';

const getEmoji = (v) =>
  v < 40 ? <SadIcon sx={{ fontSize: 30 }} /> :
  v < 70 ? <NeutralIcon sx={{ fontSize: 30 }} /> :
            <HappyIcon sx={{ fontSize: 30 }} />;

export default function CustomerSatisfaction() {
  const score = 86;
  const color = getColor(score);
  const data = [{ name: 'Sat', value: score, fill: color }];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 2,
          /* borderLeft removed */
          boxShadow: '0px 8px 24px rgba(239,241,246,1)',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Contenedor del chart y overlay */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              barSize={20}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                clockWise
                cornerRadius="50%"
                background={{ fill: '#f5f5f5' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Overlay: emoji + score + label */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getEmoji(score)}
              <Typography variant="h4" fontWeight="bold" sx={{ color, lineHeight: 1 }}>
                {score}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1 }}>
              Customer Satisfaction
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
