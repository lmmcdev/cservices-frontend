import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Sector,
} from 'recharts';

import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

const PRIORITY_COLORS = {
  high: '#f46a6a',    // rojo
  medium: '#ffb900',  // amarillo
  low: '#00b8a3',     // verde
};

// ✅ Componente funcional para animar el slice
function AnimatedActiveShape(props) {
  const {
    cx, cy, midAngle, innerRadius = 0, outerRadius,
    startAngle, endAngle, fill,
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const dx = cos * 15;
  const dy = sin * 15;

  const spring = useSpring({
    to: { transform: `translate(${dx}px, ${dy}px)` },
    from: { transform: `translate(0px, 0px)` },
    config: { tension: 100, friction: 16 },
  });

  return (
    <animated.g style={spring}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </animated.g>
  );
}

function TicketPriorityChartBase({ stats, onCategoryClick }) {
  const [activeIndex, setActiveIndex] = useState(null);

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

  const CustomTooltip = ({ active, payload }) => {
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
        '& path:focus, & g:focus, & g > path:focus': {
          outline: 'none !important',
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
    <Typography
      variant="p"
      fontWeight="bold"
      sx={{ mt: 2, mb: 1, ml: 2, color: '#000' }}
    >
      Ticket Priority Breakdown
    </Typography>

    {/* ✅ Contenedor con tamaño fijo */}
    <Box sx={{ height: 300, mx: 'auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataPriority}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            activeIndex={activeIndex}
            activeShape={<AnimatedActiveShape />}
            onClick={handlePriorityClick}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {dataPriority.map((entry, index) => (
              <Cell
                key={`cell-priority-${index}`}
                fill={entry.fill}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
      }}
    >
      {['high', 'medium', 'low'].map((priorityKey) => {
        const entry = dataPriority.find((item) => item.name === priorityKey);
        if (!entry) return null;

        return (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: entry.fill,
              }}
            />
            <Typography fontSize={10} fontWeight="bold" color="#333">
              {`${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)} (${entry.percent.toFixed(1)}%)`}
            </Typography>
          </Box>
        );
      })}
    </Box>
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
