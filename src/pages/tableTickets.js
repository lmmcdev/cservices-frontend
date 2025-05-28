import React, { useEffect, useReducer, useState } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { fetchTableData } from '../utils/api';
import { useLoading } from '../components/loadingProvider';
import { useAuth } from '../utils/authContext';
import {
  Box, Button, Chip, Typography, Card, CardContent,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
    }, [user?.username, setLoading]);

    useEffect(() => {
      setPage(0); // Reset to page 0 when filter changes
    }, [selectedStatus]);

    const { tickets, error } = state;

    const filteredRows =
      selectedStatus === 'Total'
        ? tickets
        : tickets.filter((row) => row.status === selectedStatus);

    const paginatedRows = filteredRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  return (
    <Card elevation={3} sx={{ borderRadius: 4, position: 'fixed', top: 170, left: 200, right: 20 }}>
      <CardContent>
        <Box component="main" sx={{ flexGrow: 1 }}>
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

            
              <TableContainer component={Paper} elevation={0}>
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
                    {paginatedRows.map((row, index) => (
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

              <TablePagination
                component="div"
                count={filteredRows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
        </Box>
      </CardContent>
    </Card>
  );
}