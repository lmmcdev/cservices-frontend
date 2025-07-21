// src/components/ticketsCategoriesChart.jsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

const COLORS = [
  '#00b8a3',
  '#00a1ff',
  '#ffb900',
  '#ff6692',
  '#6f42c1',
  '#34c38f',
  '#f46a6a',
  '#556ee6',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const { value, payload: dataPoint } = payload[0];
  const percent = dataPoint.percent ?? 0;
  const fillColor = dataPoint.fill || '#00a1ff'; // fallback por si acaso

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '10px 14px',
        fontSize: 14,
        color: '#000',
      }}
    >
      <Typography fontWeight="bold" fontSize={15} mb={0.5} sx={{ color: fillColor }}>
        {label}
      </Typography>
      <Typography fontSize={14}>
        Calls: {value}
      </Typography>
      <Typography fontSize={13} color="text.secondary">
        {percent.toFixed(1)}%
      </Typography>
    </Box>
  );
};


function TicketCategoriesChartBase({ stats, onCategoryClick }) {
  const categories = stats?.aiClassificationStats?.category || {};

  const totalCategories = Object.values(categories).reduce(
    (acc, cat) => acc + cat.count,
    0
  );

  const dataCategories = Object.entries(categories)
  .map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalCategories > 0 ? (obj.count / totalCategories) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }))
  .sort((a, b) => b.value - a.value); // Ordena de mayor a menor

  const handleCategoryClick = (data) => {
    if (data?.ticketIds && onCategoryClick) {
      onCategoryClick({
        category: data.name,
        ticketIds: data.ticketIds,
      });
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Categories Breakdown
          </Typography>
          <Box sx={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" aspect={2}>
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                barCategoryGap="20%"
              >
                {/* Eje X con etiquetas numéricas */}
                <XAxis
                  type="number"
                  axisLine={{ stroke: '#ccc' }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  onClick={handleClick}
                  radius={[0, 8, 8, 0]}
                >
                  {data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fill: '#333', fontSize: 12, fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// ✅ Wrapper para DAILY
export function DailyTicketCategoriesChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return <TicketCategoriesChartBase stats={daily_statistics} onCategoryClick={onCategoryClick} />;
}

// ✅ Wrapper para HISTORICAL
export function HistoricalTicketCategoriesChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return <TicketCategoriesChartBase stats={stats} onCategoryClick={onCategoryClick} />;
}
