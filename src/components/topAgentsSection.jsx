// src/components/TopAgentsSection.jsx
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
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ProfilePic from './components/profilePic';

export default function TopAgentsSection({ agents = [] }) {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState('7d');
  const pageSize = 10;

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => b.cases - a.cases);
  }, [agents]);

  const currentAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedAgents.slice(start, start + pageSize);
  }, [page, sortedAgents]);

  const totalPages = Math.ceil(sortedAgents.length / pageSize);

  const handleRangeChange = (_, newRange) => {
    if (newRange !== null) {
      setRange(newRange);
    }
  };

  return (
    <Box
      mt={4}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        p: 3,
        boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        maxWidth: 800,
        mx: 'auto',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{ ml: 1 }}>
          <Typography fontSize='26px' fontWeight="bold" color='#00A1FF'>Top {page * pageSize} Agents</Typography>
          <Typography fontSize='16px' color="textSecondary">Activity</Typography>
        </Box>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={handleRangeChange}
          size="small"
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px #e0e0e0',
          }}
        >
          {['7d', '30d', 'all'].map((val) => (
            <ToggleButton
              key={val}
              value={val}
              sx={{
                textTransform: 'none',
                px: 2,
                border: 'none',
                borderRadius: 0,
                fontWeight: 'bold',
                '&.Mui-selected': {
                  backgroundColor: '#00A1FF',
                  color: '#fff',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#008ed6',
                  },
                },
                '&:not(:last-of-type)': {
                  borderRight: '1px solid #e0e0e0',
                },
              }}
            >
              {val === '7d' ? 'Top 7 days' : val === '30d' ? 'Top 30 days' : 'All times'}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
              <TableCell align="center"><strong>#</strong></TableCell>
              <TableCell><strong>Agent</strong></TableCell>
              <TableCell><strong>Calls</strong></TableCell>
              <TableCell><strong>Average Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAgents.map((agent, index) => (
              <TableRow key={agent.id || index}>
                <TableCell align="center">
                  {index + 1 + (page - 1) * pageSize === 1 ? (
                    <span style={{ fontSize: '24px' }}>🥇</span>
                  ) : index + 1 + (page - 1) * pageSize === 2 ? (
                    <span style={{ fontSize: '24px' }}>🥈</span>
                  ) : index + 1 + (page - 1) * pageSize === 3 ? (
                    <span style={{ fontSize: '24px' }}>🥉</span>
                  ) : (
                    <Typography>{index + 1 + (page - 1) * pageSize}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ '& .MuiAvatar-root': { border: 'none !important' } }}>
                      <ProfilePic email={agent.email} size={40} />
                    </Box>
                    <Typography>{agent.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{agent.cases?.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>{agent.avgTime || 'N/A'}</TableCell>
              </TableRow>
            ))}
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
