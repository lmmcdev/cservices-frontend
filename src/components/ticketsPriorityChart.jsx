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

function TicketPriorityChartBase({ stats, onCategoryClick }) {
  const tickets = stats?.aiClassificationStats?.priority || {};

  const ticketsFiltered = Object.entries(tickets).filter(
    ([priority]) => priority.toLowerCase() !== 'normal'
  );

  const totalPriority = ticketsFiltered.reduce(
    (acc, [_, obj]) => acc + obj.count,
    0
  );

  const dataPriority = ticketsFiltered.map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalPriority > 0 ? (obj.count / totalPriority) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  const handlePriorityClick = (data) => {
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
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Priority Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={dataPriority}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => [`${value} Tickets`]} />
              <Legend />
              <Bar dataKey="value" onClick={handlePriorityClick}>
                {dataPriority.map((entry, index) => (
                  <Cell key={`cell-priority-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

// ✅ DAILY WRAPPER
export function DailyTicketPriorityChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return <TicketPriorityChartBase stats={daily_statistics} onCategoryClick={onCategoryClick} />;
}

// ✅ HISTORICAL WRAPPER
export function HistoricalTicketPriorityChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return <TicketPriorityChartBase stats={stats} onCategoryClick={onCategoryClick} />;
}
