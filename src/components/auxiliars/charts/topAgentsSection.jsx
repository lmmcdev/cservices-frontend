// src/components/topAgentsSection.jsx

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
  Card,
  CardContent,
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ProfilePic from '../tickets/profilePic';
import { keyframes } from '@emotion/react';
import { formatMinutesToHoursPretty } from '../../../utils/js/minutosToHourMinutes';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useTopAgentsStat } from '../../../context/historicalStatsContext';

// Animación para medallas
const bounceHover = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.2) rotate(-5deg); }
  60% { transform: scale(0.95) rotate(3deg); }
  100% { transform: scale(1); }
`;

export default function TopAgentsSection({ agentStats = {} }) {
  const [page, setPage] = useState(1);
  const pageSize = 4;


  const sortedAgents = useMemo(() => {
    const agentsStats = Array.isArray(agentStats) ? agentStats : Object.values(agentStats || {});
    return [...agentsStats].sort((a, b) => b.resolvedCount - a.resolvedCount);
  }, [agentStats]);

  const currentAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedAgents.slice(start, start + pageSize);
  }, [page, sortedAgents]);

  const totalPages = Math.ceil(sortedAgents.length / pageSize);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: 3,
          p: 2,
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ p: 0, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#00A1FF">
            Top {pageSize} Agents
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Activity
          </Typography>
        </CardContent>

        <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <TableContainer component={Box}>
            <Table
              sx={{
                borderCollapse: 'separate',
                borderSpacing: 0,
                '& th, & td': {
                  borderBottom: '1px solid #e0e0e0',
                  py: 1.5,
                },
                '& thead th': {
                  borderBottom: '2px solid #e0e0e0',
                  py: 1.5,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>#</strong></TableCell>
                  <TableCell><strong>Agent</strong></TableCell>
                  <TableCell><strong>Calls</strong></TableCell>
                  <TableCell><strong>Avg Time</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAgents.map((agent, index) => {
                  const rank = index + 1 + (page - 1) * pageSize;
                  const medal =
                    rank === 1 ? '🥇' :
                    rank === 2 ? '🥈' :
                    rank === 3 ? '🥉' :
                    null;
                  return (
                    <TableRow key={agent.agentEmail || index}>
                      <TableCell align="center">
                        {medal ? (
                          <Box
                            sx={{
                              fontSize: 24,
                              display: 'inline-block',
                              '&:hover': { animation: `${bounceHover} 0.6s ease` },
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
                          <ProfilePic email={agent.agentEmail} size={32} />
                          <Typography noWrap>{agent.agentEmail}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{agent.resolvedCount.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {formatMinutesToHoursPretty(agent.avgResolutionTimeMins)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <ChevronLeft
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            sx={{
              cursor: page > 1 ? 'pointer' : 'not-allowed',
              color: page > 1 ? '#00A1FF' : '#ccc',
              mr: 2,
            }}
          />
          <Typography variant="body2" fontWeight="bold">
            {page} of {totalPages}
          </Typography>
          <ChevronRight
            onClick={() => setPage((p) => (p * pageSize < sortedAgents.length ? p + 1 : p))}
            sx={{
              cursor: page * pageSize < sortedAgents.length ? 'pointer' : 'not-allowed',
              color: page * pageSize < sortedAgents.length ? '#00A1FF' : '#ccc',
              ml: 2,
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

// ✅ Daily wrapper
export function DailyTopAgents() {
  const { daily_statistics } = useDailyStatsState();
  return <TopAgentsSection agentStats={daily_statistics?.agentStats || {}} />;
}

// ✅ Historical wrapper
export function HistoricalTopAgents() {
  const agentStats = useTopAgentsStat();
  return <TopAgentsSection agentStats={agentStats} />;
}
