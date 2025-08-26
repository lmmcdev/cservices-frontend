import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#ff9800','#00bcd4','#8bc34a','#f44336','#9c27b0'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #ccc', borderRadius: 1, p: 1, boxShadow: 1 }}>
      <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
      <Typography variant="body2" color="text.secondary">Tickets: {value}</Typography>
    </Box>
  );
};

export default function TicketPriorityChartBase({ stats, onCategoryClick }) {
  const priorities = stats?.aiClassificationStats?.priority || {};
  const entries = Object.entries(priorities);
  const data = entries.map(([name, obj]) => ({
    name,
    value: Number(obj?.count || 0),
    ticketIds: obj?.ticketIds || [],
  }));

  const handleClick = (entry) => {
    if (onCategoryClick && entry.ticketIds?.length > 0) {
      onCategoryClick({ category: entry.name, ticketIds: entry.ticketIds });
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card sx={{ width: '100%', height: '100%', borderRadius: 2, boxShadow: '0px 8px 24px rgba(239,241,246,1)' }}>
        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Priority Breakdown
          </Typography>
          <Box sx={{ flex: 1, minHeight: 220 }}>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    label
                    onClick={handleClick}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No data available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
