// src/components/TicketCategoriesRadialChart.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack
} from '@mui/material';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer, Legend
} from 'recharts';
import { useDailyStatsState } from '../context/dailyStatsContext';

const style = {
  top: 0,
  left: 350,
  lineHeight: "24px"
};
// 🎨 Paleta de colores (puedes ampliarla si hay más categorías)
const COLORS = ['#00b8a3', '#00a1ff', '#ffb900', '#ff6692', '#6f42c1', '#34c38f', '#f46a6a', '#556ee6'];

export default function TicketCategoriesChart() {
  const { daily_statistics } = useDailyStatsState();
  const categories = daily_statistics?.aiClassificationStats?.category || {};

  // Calcula total de tickets
  const totalCount = Object.values(categories).reduce((acc, cat) => acc + cat.count, 0);

  // Datos transformados para RadialBarChart
  const data = Object.entries(categories).map(([name, obj], index) => ({
    name,
    value: totalCount > 0 ? (obj.count / totalCount) * 100 : 0,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 3,
          height: 600,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            zIndex: 1,
            padding: '16px !important',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Categories Breakdown
          </Typography>

          <Box sx={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx={150}
                cy={150}    // 🔑 Baja el centro vertical, 70%-80% funciona bien para semi-círculos
                innerRadius={20}
                outerRadius={140}
                barSize={15}
                data={data}
                
              >
                
                <RadialBar
        minAngle={15}
        label={{ position: "insideStart", fill: "#fff" }}
        background
        clockWise
        dataKey="value"
      />

      <Legend
        iconSize={10}
        width={120}
        height={140}
        layout="vertical"
        verticalAlign="middle"
        wrapperStyle={style}
      />
              </RadialBarChart>

            </ResponsiveContainer>
          </Box>

          {/* Leyenda de categorías */}
          <Stack spacing={1} sx={{ mt: 2 }}>
            {data.map((entry, idx) => (
              <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: entry.fill,
                  }}
                />
                <Typography variant="body2">
                  {entry.name}: {entry.value.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
