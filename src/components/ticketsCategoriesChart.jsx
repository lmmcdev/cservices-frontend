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
  Legend,
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

function TicketCategoriesChartBase({ stats, onCategoryClick }) {
  const categories = stats?.aiClassificationStats?.category || {};

  const totalCategories = Object.values(categories).reduce(
    (acc, cat) => acc + cat.count,
    0
  );

  const dataCategories = Object.entries(categories).map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalCategories > 0 ? (obj.count / totalCategories) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  const handleCategoryClick = (data) => {
    if (data?.ticketIds && onCategoryClick) {
      onCategoryClick({
        category: data.name,
        ticketIds: data.ticketIds,
      });
    }
  };

  return (
    <Box>
      <Card
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Categories Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={dataCategories}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => [`${value} Tickets`]} />
              <Legend />
              <Bar dataKey="value" onClick={handleCategoryClick}>
                {dataCategories.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
