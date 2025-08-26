import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  Divider,
  useMediaQuery,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { Icon } from '@iconify/react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ProviderList from '../components/components/providers/providerList';
import ProviderEditForm from './editProvider';
import PatientSearchContainer from '../components/components/patients/patientSearchContainer';
//import { handleGetTicketsByPatient } from '../utils/js/patientsActions';
import TicketSearchContainer from '../components/components/tickets/ticketSearchContainer';
import TicketQuickViewDialog from '../components/dialogs/ticketQuickViewDialog';
import SearchTicketResults from '../components/components/tickets/searchTicketsResults';
import { useApiHandlers } from '../utils/js/apiActions';

const mockData = [];

const typeAvatars = {
  patient: '👤',
  doctorsOffice: '🩺',
  pharmacy: '💊',
  insurance: '🛡️',
  hospital: '🏥',
  competitor: '🏪'
};

const avatarColors = {
  patient: '#eae8fa',
  doctorsOffice: '#dff3ff',
  pharmacy: '#ffe2ea',
  insurance: '#daf8f4',
  hospital: '#fff5da',
  competitor: '#ffe3c4',
  default: '#f1f5ff'
};

export default function ProfileSearch() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  ///const [filter, setFilter] = useState('All');
  const [filter, ] = useState('All');
  const isSmall = useMediaQuery('(max-width:900px)');
  const [selectedView, setSelectedView] = useState('tickets-search'); 
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [, setSelectedPatient] = useState(null);
  const [patientTickets, setPatientTickets] = useState([]);

  const [quickViewTicket, setQuickViewTicket] = useState(null);
  
  const [openQuickView, setOpenQuickView] = useState(false);

  const { handleGetTicketsByPatient } = useApiHandlers();

  const handleQuickViewClose = () => {
    setOpenQuickView(false);
    setQuickViewTicket(null);
  };

  const handleQuickViewOpen = (ticket) => {
    setQuickViewTicket(ticket);
    setOpenQuickView(true);
  };

  const applyFilters = data =>
    data.filter(p => {
      const q = query.toLowerCase();
      const matchesQuery =
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.dob.includes(q);
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Starred' && p.starred) ||
        (filter === 'Frequent' && p.callCount >= 15) ||
        (filter === 'Patients' && p.type === 'patient') ||
        (filter === "Doctor's Office" && p.type === 'doctorsOffice') ||
        (filter === 'Pharmacy' && p.type === 'pharmacy') ||
        (filter === 'Insurance' && p.type === 'insurance') ||
        (filter === 'Hospital' && p.type === 'hospital') ||
        (filter === 'Competitors' && p.type === 'competitor');
      return matchesQuery && matchesFilter;
    });

  const [data, setData] = useState(mockData);
  //const filtered = useMemo(() => applyFilters(data), [data, query, filter]);
  const filtered = applyFilters(data)
    
  const setSelectedTicketFunc = async (ticket) => {
    handleQuickViewOpen(ticket);
    setSelectedView('tickets-search');
  }

  const setSelectedTicketFuncView = async (ticket) => {
    console.log(ticket)
    handleQuickViewOpen(ticket);
    setSelectedView('patients-search');
  }

  const setSelectedPatientFunc = async (patient) => {
    const tickets = await handleGetTicketsByPatient(patient.id);

    //devuelve todo
    setPatientTickets(tickets.message?.items || []);
    setSelectedPatient(patient);
    setSelectedView('patients-search');
     
  }

  return (
    <>
    <Card
      sx={{
        borderRadius: 4,
        position: 'fixed',
        top: 150,
        left: 'calc(var(--drawer-width, 80px) + var(--content-gap))', // 👈 se mueve con el sidebar
        right: 39,
        bottom: 39,
        transition: 'left .3s ease',                    // 👈 animación suave
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 8px 24px rgba(239,241,246,1)',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row'
        }}
      >
        {/* Filter panel */}
        <Box sx={{ width: 220, p: 2, borderRight: '1px solid #f0f0f0' }}>

          <List>
            {/**Menu Fijo Providers */}          
            <ListItemButton
              onClick={() => setSelectedView('providers')}
              sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}>
                <LocalHospitalIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Providers" />
            </ListItemButton>

            {/**Menu Fijo Patients  
            <ListItemButton
              onClick={() => setSelectedView('patients')}
              sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}>
                <LocalHospitalIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Patients" />
            </ListItemButton>*/}  

            <ListItemButton
              onClick={() => setSelectedView('patients-search')}
              sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}>
                <PersonSearchIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Patients Search" />
            </ListItemButton>

            <ListItemButton
              onClick={() => setSelectedView('tickets-search')}
              sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}>
                <ConfirmationNumberOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tickets Search" />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 2 }} />

        </Box>

        {/* Left panel */}
        <Box
          sx={{
            width: isSmall ? '100%' : '35%', 
            pt: 2,
            pl: 2,
            overflowY: 'auto'
          }}
        >
          {selectedView === 'profile' && (
            <>
              <TextField
                fullWidth
                placeholder="Search by name, phone or DOB"
                variant="outlined"
                onChange={e => setQuery(e.target.value)}
                sx={{ mb: 2, backgroundColor: 'white' }}
              />

              <List>
                {filtered.map(p => (
                  <ListItemButton
                    key={p.id}
                    selected={selected?.id === p.id}
                    onClick={() => setSelected(p)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      position: 'relative',
                      '&:hover .profile-name': {
                        color: '#00a1ff',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 2,
                        width: 48,
                        height: 48,
                        fontSize: 24,
                        bgcolor: avatarColors[p.type] || avatarColors.default,
                        color: '#5B5F7B'
                      }}
                    >
                      {typeAvatars[p.type] || '👤'}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          className="profile-name"
                          sx={{
                            fontWeight: 'bold',
                            color: selected?.id === p.id ? '#00a1ff' : '#1A1A1A',
                            transition: 'color 0.3s',
                          }}
                        >
                          {p.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: '#5B5F7B' }}
                        >
                          {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setData((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, starred: !x.starred } : x
                          )
                        );
                      }}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        color: p.starred ? '#ffb900' : '#5B5F7B'
                      }}
                    >
                      {p.starred
                        ? <Icon icon="solar:star-bold" style={{ fontSize: '18px' }} />
                        : <Icon icon="solar:star-outline" style={{ fontSize: '18px' }} />
                      }
                    </IconButton>
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {/** Central Panel */}
          {selectedView === 'providers' && (
            <ProviderList  onSelect={setSelectedProvider} />
          )}

          {selectedView === 'patients-search' && (
            <>
              <PatientSearchContainer onSelectFunc={setSelectedPatientFunc} />
            </>
          )}

          {selectedView === 'tickets-search' && (
            <TicketSearchContainer onSelectFunc={setSelectedTicketFunc} />
          )}
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1.5, borderColor: '#f0f0f0' }}
        />

        {/* Right panel */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {selectedView === 'providers' && (
            selectedProvider ? (
              <ProviderEditForm
                initialData={selectedProvider}
              />
            ) : (
              <Typography color="#5B5F7B">
                Select a provider from the left panel.
              </Typography>
            )
          )}

          {selectedView === 'patients-search' && (
            <>
              <SearchTicketResults
                results={patientTickets}
                selectedTicket={setSelectedTicketFuncView}
              />
            </>
          )}
        </Box>
      </CardContent>
    </Card>

    <TicketQuickViewDialog
      open={openQuickView}
      onClose={handleQuickViewClose}
      ticket={quickViewTicket}
    />
    </>
  );

}
