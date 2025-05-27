import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Chip
} from '@mui/material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const rows = [
  {
    status: 'New',
    callerId: 'Pembroke',
    name: 'Ana Torres',
    dob: '1989-06-12',
    phone: '305-123-4567',
    createdAt: '2025-05-20 08:15',
  },
  {
    status: 'In Progress',
    callerId: 'Homestead',
    name: 'Carlos Méndez',
    dob: '1978-11-03',
    phone: '786-987-1234',
    createdAt: '2025-05-20 09:30',
  },
  {
    status: 'Done',
    callerId: 'Kendall',
    name: 'Lucía Pérez',
    dob: '1990-02-18',
    phone: '305-456-7890',
    createdAt: '2025-05-19 14:05',
  },
  {
    status: 'Emergency',
    callerId: 'Hialeah',
    name: 'Miguel Sánchez',
    dob: '1985-09-25',
    phone: '786-654-3210',
    createdAt: '2025-05-20 10:45',
  },
  {
    status: 'Pending',
    callerId: 'Pembroke',
    name: 'Sofía Morales',
    dob: '1993-07-10',
    phone: '305-789-4321',
    createdAt: '2025-05-19 17:20',
  },
  {
    status: 'Duplicated',
    callerId: 'Kendall',
    name: 'Juan López',
    dob: '1981-12-14',
    phone: '786-321-9876',
    createdAt: '2025-05-18 12:00',
  },
  {
    status: 'New',
    callerId: 'Homestead',
    name: 'Paula Vargas',
    dob: '1995-04-08',
    phone: '305-963-2587',
    createdAt: '2025-05-21 07:55',
  },
  {
    status: 'In Progress',
    callerId: 'Hialeah',
    name: 'Luis Ortega',
    dob: '1987-10-23',
    phone: '786-852-7412',
    createdAt: '2025-05-20 13:30',
  },
  {
    status: 'Done',
    callerId: 'Pembroke',
    name: 'Andrea Castillo',
    dob: '1992-03-15',
    phone: '305-741-9638',
    createdAt: '2025-05-18 16:10',
  },
  {
    status: 'Emergency',
    callerId: 'Kendall',
    name: 'Raúl García',
    dob: '1975-06-30',
    phone: '786-147-2583',
    createdAt: '2025-05-21 08:40',
  },
  {
    status: 'Pending',
    callerId: 'Hialeah',
    name: 'Elena Ríos',
    dob: '1991-01-09',
    phone: '305-369-1472',
    createdAt: '2025-05-19 15:35',
  },
  {
    status: 'Duplicated',
    callerId: 'Homestead',
    name: 'Diego Navarro',
    dob: '1982-08-20',
    phone: '786-753-9512',
    createdAt: '2025-05-18 11:25',
  },
  {
    status: 'New',
    callerId: 'Kendall',
    name: 'María Hernández',
    dob: '1988-12-01',
    phone: '305-159-7534',
    createdAt: '2025-05-21 09:10',
  },
  {
    status: 'In Progress',
    callerId: 'Pembroke',
    name: 'Javier Soto',
    dob: '1979-04-11',
    phone: '786-321-4568',
    createdAt: '2025-05-20 11:50',
  },
  {
    status: 'Done',
    callerId: 'Homestead',
    name: 'Claudia Reyes',
    dob: '1994-05-17',
    phone: '305-852-1478',
    createdAt: '2025-05-19 12:45',
  },
  {
    status: 'Emergency',
    callerId: 'Hialeah',
    name: 'Pedro Álvarez',
    dob: '1980-09-05',
    phone: '786-951-3578',
    createdAt: '2025-05-21 10:20',
  },
  {
    status: 'Pending',
    callerId: 'Kendall',
    name: 'Isabel Molina',
    dob: '1996-02-03',
    phone: '305-654-7893',
    createdAt: '2025-05-20 17:00',
  },
  {
    status: 'Duplicated',
    callerId: 'Pembroke',
    name: 'Oscar Romero',
    dob: '1976-07-22',
    phone: '786-357-1597',
    createdAt: '2025-05-18 13:15',
  },
  {
    status: 'New',
    callerId: 'Homestead',
    name: 'Valentina Díaz',
    dob: '1990-10-12',
    phone: '305-951-6547',
    createdAt: '2025-05-21 08:25',
  },
  {
    status: 'Done',
    callerId: 'Hialeah',
    name: 'Tomás Núñez',
    dob: '1983-11-29',
    phone: '786-258-1479',
    createdAt: '2025-05-19 18:40',
  },
];


// Colores personalizados por estado
const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  'Total Calls': { bg: 'transparent', text: '#0947D7' }, // color para botón "Total"
};

export default function TableTickets() {
  const [selectedStatus, setSelectedStatus] = React.useState('Total');

  const handleFilter = (status) => {
    setSelectedStatus(status);
  };

  const filteredRows =
    selectedStatus === 'Total'
      ? rows
      : rows.filter((row) => row.status === selectedStatus);

  return (
    <Box component="main" sx={{ flexGrow: 1, pl: 12.2, pt: 20, pr: 3, mt: 8 }}>

      {/* Botones de filtro cuadrados */}
      <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
            justifyContent: 'center',
        }}
      >
        {[...Object.keys(statusColors)].map((status) => (
          <Button
            key={status}
            onClick={() => handleFilter(status)}
            variant={selectedStatus === status ? 'contained' : 'outlined'}
            sx={{
                minWidth: 180,              // controla el ancho mínimo
                aspectRatio: '1 / 0.5',       // cuadrado
                textTransform: 'none',
                fontSize: 13,
                fontWeight: 'bold',
                borderRadius: 4,
                border: 'none',
                boxShadow: 'none',
                backgroundColor: statusColors[status].bg,
                color: statusColors[status].text,
                borderColor: statusColors[status].text,
                '&:hover': {
                backgroundColor: statusColors[status].bg,
                boxShadow: 'none',
                },
            }}
          >
            {status}
          </Button>
        ))}
      </Box>

      {/* Tabla de tickets */}
      <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                {['Status', 'Caller ID', 'Name', 'DOB', 'Phone', 'Create At'].map((header) => (
                <TableCell
                    key={header}
                    sx={{
                    backgroundColor: '#fff',
                    borderBottom: 'none',
                    fontWeight: 'bold',
                    fontSize:16
                    }}
                >
                    {header}
                </TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {filteredRows.map((row) => (
                <TableRow key={row.id}>
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
                    <TableCell>{row.callerId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.dob}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                    <TableCell><BorderColorRoundedIcon /></TableCell>

                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>

    </Box>
  );
}
