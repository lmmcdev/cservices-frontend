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
  Cell,
} from 'recharts';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';
import { LabelList } from 'recharts';

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

// Componente genérico
export default function TicketRiskChart({ stats, onCategoryClick }) {
  const risks = stats?.aiClassificationStats?.risk || {};

  // Excluye 'none'
  const risksFiltered = Object.entries(risks).filter(
    ([risk]) => risk.toLowerCase() !== 'none'
  );

  const totalRisks = risksFiltered.reduce((acc, [_, obj]) => acc + obj.count, 0);

  const dataRisks = risksFiltered.map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalRisks > 0 ? (obj.count / totalRisks) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  const handleRiskClick = (data) => {
    if (data?.ticketIds && onCategoryClick) {
      onCategoryClick({
        category: data.name,
        ticketIds: data.ticketIds,
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value } = payload[0].payload;

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: 3,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Calls: {value}
      </Typography>
    </Box>
  );
};

  return (
    <Box
      sx={{
        '& .recharts-tooltip-cursor': {
          fill: 'transparent !important',
        },
        '& .recharts-bar-rectangle:hover': {
          filter: 'brightness(1.1)',
        },
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent>
          <Typography variant="p" fontWeight="bold" sx={{ mt: 2, mb: 3, ml: 2, color: '#000' }}>
            Ticket Risks Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={385}>
            <BarChart
              data={dataRisks}
              margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis type="number" tick={{ fontSize: 11 }}/>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" onClick={handleRiskClick} radius={[10, 10, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{
                    fill: '#333',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                />
                {dataRisks.map((entry, index) => (
                  <Cell key={`cell-risk-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

                  </CardContent>
                </Card>
              </Box>
            );
          }

// ✅ Daily wrapper
export function DailyTicketRiskChart({ onCategoryClick }) {
  const dailyStats = useDailyStatsState();
  const stats = dailyStats.daily_statistics || {};
  return <TicketRiskChart stats={stats} onCategoryClick={onCategoryClick} />;
}

// ✅ Historical wrapper
export function HistoricalTicketRiskChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return <TicketRiskChart stats={stats} onCategoryClick={onCategoryClick} />;
}
