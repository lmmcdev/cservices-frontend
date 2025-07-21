// src/components/ticketsCategoriesChart.jsx

import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
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
  if (!active || !payload?.length) return null;
  const { value, payload: dataPoint } = payload[0];
  const percent = dataPoint.percent ?? 0;
  const fillColor = dataPoint.fill || '#00a1ff';

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #ddd',
        borderRadius: 1,
        p: 1,
        fontSize: 14,
      }}
    >
      <Typography fontWeight="bold" fontSize={15} mb={0.5} sx={{ color: fillColor }}>
        {label}
      </Typography>
      <Typography fontSize={14}>Calls: {value}</Typography>
      <Typography fontSize={13} color="text.secondary">
        {percent.toFixed(1)}%
      </Typography>
    </Box>
  );
};

function TicketCategoriesChartBase({ stats, onCategoryClick }) {
  const categories = stats?.aiClassificationStats?.category || {};
  const total = Object.values(categories).reduce((sum, c) => sum + c.count, 0);
  const data = Object.entries(categories)
    .map(([name, obj], idx) => ({
      name,
      value: obj.count,
      percent: total ? (obj.count / total) * 100 : 0,
      fill: COLORS[idx % COLORS.length],
      ticketIds: obj.ticketIds,
    }))
    .sort((a, b) => b.value - a.value);

  const handleClick = (data) => {
    if (data?.ticketIds && onCategoryClick) {
      onCategoryClick({ category: data.name, ticketIds: data.ticketIds });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        // quita fondo gris en hover y aclara el color original
        '& .recharts-tooltip-cursor': {
          fill: 'transparent !important',
        },
        '& .recharts-bar-rectangle:hover': {
          filter: 'brightness(1.2)',
        },
      }}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 2,
          bgcolor: '#fff',
          boxShadow: '0px 8px 24px rgba(239,241,246,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Categories Breakdown
          </Typography>
          <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                barCategoryGap="20%"
              >
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
                  cursor="pointer"
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={entry.fill}
                      fillOpacity={1}
                    />
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

export function DailyTicketCategoriesChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return (
    <TicketCategoriesChartBase
      stats={daily_statistics || {}}
      onCategoryClick={onCategoryClick}
    />
  );
}

export function HistoricalTicketCategoriesChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return (
    <TicketCategoriesChartBase
      stats={stats}
      onCategoryClick={onCategoryClick}
    />
  );
}

export default TicketCategoriesChartBase;