import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ProfilePic from './components/profilePic';
import { keyframes } from '@emotion/react';
import { formatMinutesToHoursPretty } from '../utils/js/minutosToHourMinutes';
import { useDailyStatsState } from '../context/dailyStatsContext';
import { useHistoricalStats } from '../context/historicalStatsContext';

// Animación para medallas
const bounceHover = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.2) rotate(-5deg); }
  60% { transform: scale(0.95) rotate(3deg); }
  100% { transform: scale(1); }
`;

export default function TopAgentsSection({ stats }) {
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const sortedAgents = useMemo(() => {
    const agentsStats = stats?.agentStats || [];
    return [...agentsStats].sort((a, b) => b.resolvedCount - a.resolvedCount);
  }, [stats]);

  const currentAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedAgents.slice(start, start + pageSize);
  }, [page, sortedAgents]);

  const totalPages = Math.ceil(sortedAgents.length / pageSize);

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        p: 3,
        boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        mx: 'auto',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{ ml: 1 }}>
          <Typography fontSize="26px" fontWeight="bold" color="#00A1FF">
            Top {pageSize} Agents
          </Typography>
          <Typography fontSize="16px" color="textSecondary">
            Activity
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Box}>
        <Table
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            '& th, & td': {
              borderBottom: '1px solid #e0e0e0',
            },
            '& thead th': {
              borderBottom: '2px solid #e0e0e0',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <strong>Agent</strong>
              </TableCell>
              <TableCell>
                <strong>Calls</strong>
              </TableCell>
              <TableCell>
                <strong>Avg Time</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAgents.map((agent, index) => {
              const rank = index + 1 + (page - 1) * pageSize;
              const medal =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

              return (
                <TableRow key={agent.agentEmail || index}>
                  <TableCell align="center">
                    {medal ? (
                      <Box
                        sx={{
                          fontSize: '24px',
                          display: 'inline-block',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            animation: `${bounceHover} 0.6s ease`,
                          },
                        }}
                      >
                        {medal}
                      </Box>
                    ) : (
                      <Typography>{rank}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ '& .MuiAvatar-root': { border: 'none !important' } }}>
                        <ProfilePic email={agent.agentEmail} size={40} />
                      </Box>
                      <Typography>{agent.agentEmail}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{agent.resolvedCount?.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    {formatMinutesToHoursPretty(agent.avgResolutionTimeMins)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2} alignItems="center" gap={2}>
        <ChevronLeft
          fontSize="medium"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          sx={{
            cursor: page > 1 ? 'pointer' : 'not-allowed',
            color: page > 1 ? '#00A1FF' : '#ccc',
            transition: '0.2s',
          }}
        />
        <Typography fontSize={14} fontWeight="bold">
          {page} of {totalPages}
        </Typography>
        <ChevronRight
          fontSize="medium"
          onClick={() =>
            setPage((p) => (p * pageSize >= sortedAgents.length ? p : p + 1))
          }
          sx={{
            cursor: page * pageSize < sortedAgents.length ? 'pointer' : 'not-allowed',
            color: page * pageSize < sortedAgents.length ? '#00A1FF' : '#ccc',
            transition: '0.2s',
          }}
        />
      </Box>
    </Box>
  );
}

// ✅ Daily wrapper: usa dailyStatsContext
export function DailyTopAgents() {
  const dailyStats = useDailyStatsState();
  const stats = dailyStats.daily_statistics || {}; // asegúrate de seguir tu shape
  return <TopAgentsSection stats={stats} />;
}

// ✅ Historical wrapper: usa nuevo estado combinado
export function HistoricalTopAgents() {
  const { stateStats } = useHistoricalStats(); // 👈 Ahora obtienes ambos
  const stats = stateStats.historic_daily_stats || {}; 
  return <TopAgentsSection stats={stats} />;
}