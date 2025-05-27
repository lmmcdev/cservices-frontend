// components/TableTickets.jsx
import React, { useEffect, useReducer, useState } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { fetchTableData } from '../utils/api';
import { useLoading } from '../components/loadingProvider';
import { useAuth } from '../utils/authContext'; // Asegúrate de importar bien

import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Button, Chip, Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function TableTickets() {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('Total');

  useEffect(() => {
    if (!user?.username) return;

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchTableData(dispatch, setLoading, user.username);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.username, setLoading]); // ✅ protegida

  const { tickets, error } = state;

  const filteredRows =
    selectedStatus === 'Total'
      ? tickets
      : tickets.filter((row) => row.status === selectedStatus);

  return (
    <Box component="main" sx={{ flexGrow: 1, pl: 12.2, pt: 20, pr: 3, mt: 8 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
        {Object.keys(statusColors).map((status) => (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            variant={selectedStatus === status ? 'contained' : 'outlined'}
            sx={{
              minWidth: 180,
              aspectRatio: '1 / 0.5',
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 'bold',
              borderRadius: 4,
              backgroundColor: statusColors[status].bg,
              color: statusColors[status].text,
              borderColor: statusColors[status].text,
              '&:hover': {
                backgroundColor: statusColors[status].bg,
              },
            }}
          >
            {status}
          </Button>
        ))}
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          Error al cargar los tickets: {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Status', 'Caller ID', 'Name', 'DOB', 'Phone', 'Create At', ''].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: 16 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Chip
                    label={row.status}
                    sx={{
                      backgroundColor: statusColors[row.status]?.bg || '#e0e0e0',
                      color: statusColors[row.status]?.text || '#000',
                      fontWeight: 'bold',
                      fontSize: 11,
                      px: 1,
                      py: 0.5,
                      borderRadius: '16px',
                    }}
                  />
                </TableCell>
                <TableCell>{row.caller_id}</TableCell>
                <TableCell>{row.patient_name}</TableCell>
                <TableCell>{row.patient_dob}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.creation_date}</TableCell>
                <TableCell><FontAwesomeIcon icon={faCamera} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
