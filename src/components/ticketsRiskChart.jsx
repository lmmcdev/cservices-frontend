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
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #ccc',
        borderRadius: 1,
        p: 1,
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Calls: {value}
      </Typography>
    </Box>
  );
};

export default function TicketRiskChart({ stats, onCategoryClick }) {
  const risks = stats?.aiClassificationStats?.risk || {};
  const entries = Object.entries(risks).filter(([r]) => r.toLowerCase() !== 'none');
  const total = entries.reduce((sum, [, obj]) => sum + obj.count, 0);
  const dataRisks = entries.map(([name, obj], idx) => ({
    name,
    value: obj.count,
    percent: total ? (obj.count / total) * 100 : 0,
    fill: COLORS[idx % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  const handleRiskClick = ({ ticketIds, name }) => {
    if (ticketIds && onCategoryClick) {
      onCategoryClick({ category: name, ticketIds });
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
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
        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Risks Breakdown
          </Typography>
          <Box sx={{ flex: 1, width: '100%', minHeight: 0, }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataRisks}
                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis type="number" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  onClick={handleRiskClick}
                  radius={[10, 10, 0, 0]}
                >
                  {dataRisks.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
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

// Wrapper para Daily
export function DailyTicketRiskChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return (
    <TicketRiskChart
      stats={daily_statistics || {}}
      onCategoryClick={onCategoryClick}
    />
  );
}

// Wrapper para Histórico
export function HistoricalTicketRiskChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return (
    <TicketRiskChart
      stats={stats}
      onCategoryClick={onCategoryClick}
    />
  );
}
