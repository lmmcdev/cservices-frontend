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
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

const PRIORITY_COLORS = {
  high: '#f46a6a',    // rojo
  medium: '#ffb900',  // amarillo
  low: '#00b8a3',     // verde
};

function TicketPriorityChartBase({ stats, onCategoryClick }) {
  const tickets = stats?.aiClassificationStats?.priority || {};

  const ticketsFiltered = Object.entries(tickets).filter(
    ([priority]) => priority.toLowerCase() !== 'normal'
  );

  const totalPriority = ticketsFiltered.reduce(
    (acc, [_, obj]) => acc + obj.count,
    0
  );

  const dataPriority = ticketsFiltered.map(([name, obj]) => ({
    name,
    value: obj.count,
    percent: totalPriority > 0 ? (obj.count / totalPriority) * 100 : 0,
    fill: PRIORITY_COLORS[name] || '#8884d8',
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
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 2, mb: 3, ml: 2, color: '#000' }}>
            Ticket Priority Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dataPriority}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130} // puedes ajustar el tamaño si quieres más grande o más chico
                label={({ name, percent }) =>
                  `${name}: ${(percent).toFixed(1)}%`
                }
                onClick={handlePriorityClick}
              >
                {dataPriority.map((entry, index) => (
                  <Cell key={`cell-priority-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} Tickets`, name]}
              />
            </PieChart>
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
