/*import React, { useState, memo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Sector,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useHistoricalStats } from '../../../context/historicalStatsContext';

const PRIORITY_COLORS = {
  high: '#f46a6a',
  medium: '#ffb900',
  low: '#00b8a3',
};

function AnimatedActiveShape(props) {
  const {
    cx, cy, midAngle, outerRadius,
    startAngle, endAngle, fill,
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const dx = cos * 15;
  const dy = sin * 15;
  const spring = useSpring({
    to: { transform: `translate(${dx}px, ${dy}px)` },
    from: { transform: 'translate(0px, 0px)' },
    config: { tension: 100, friction: 16 },
  });
  return (
    <animated.g style={spring}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={0}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </animated.g>
  );
}

export default function TicketPriorityChartBase({ stats, onCategoryClick }) {
  console.log('rendered ticket priority chart')
  const [activeIndex, setActiveIndex] = useState(null);
  const tickets = stats?.aiClassificationStats?.priority || {};
  const filtered = Object.entries(tickets).filter(
    ([k]) => k.toLowerCase() !== 'normal'
  );
  const total = filtered.reduce((sum, [, obj]) => sum + obj.count, 0);
  const data = filtered.map(([name, obj], idx) => ({
    name,
    value: obj.count,
    percent: total ? (obj.count / total) * 100 : 0,
    fill: PRIORITY_COLORS[name] || '#8884d8',
    ticketIds: obj.ticketIds,
  }));

  const handleClick = (entry) => {
    if (entry?.ticketIds && onCategoryClick) {
      onCategoryClick({ category: entry.name, ticketIds: entry.ticketIds });
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
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
        width: '100%',
        height: '100%',
        // quita el outline/focus negro tras click
        '& path:focus, & g:focus, & g > path:focus': {
          outline: 'none !important',
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
        <CardContent
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Priority Breakdown
          </Typography>
          <Box sx={{ flex: 1, position: 'relative', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius="100%"
                  onClick={handleClick}
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  activeIndex={activeIndex}
                  activeShape={<AnimatedActiveShape />}
                >
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
                {/* Elimina cualquier tooltip oscuro por defecto *
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mt: 1,
            }}
          >
            {data.map((entry) => (
              <Box
                key={entry.name}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: entry.fill,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.9rem' } }}
                >
                  {`${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)} (${entry.percent.toFixed(1)}%)`}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// Daily wrapper
export const DailyTicketPriorityChart = memo(function DailyTicketPriorityChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return <TicketPriorityChartBase stats={daily_statistics || {}} onCategoryClick={onCategoryClick} />;
});

// Historical wrapper
export const HistoricalTicketPriorityChart = memo(function HistoricalTicketPriorityChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  const stats = stateStats.historic_daily_stats || {};
  return <TicketPriorityChartBase stats={stats} onCategoryClick={onCategoryClick} />;
});*/


// src/components/auxiliars/charts/TicketPriorityChart.jsx
import React, { memo } from 'react';
import TicketPriorityChartBase from './chartbases/ticketPriorityChartBase';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useHistoricalStats } from '../../../context/historicalStatsContext';

console.log("ticket priority")
// Wrapper para Daily
export const DailyTicketPriorityChart = memo(function DailyTicketPriorityChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return <TicketPriorityChartBase stats={daily_statistics || {}} onCategoryClick={onCategoryClick} />;
});

// Wrapper para Historical
export const HistoricalTicketPriorityChart = memo(function HistoricalTicketPriorityChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  return <TicketPriorityChartBase stats={stateStats.historic_daily_stats || {}} onCategoryClick={onCategoryClick} />;
});
