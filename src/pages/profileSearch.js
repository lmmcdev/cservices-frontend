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
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { Icon } from '@iconify/react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SecurityIcon from '@mui/icons-material/Security';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ProviderList from '../components/providerList';
import ProviderEditForm from './editProvider';
import { handleUpdateProvider } from '../utils/js/providerActions';
import { useLoading } from '../providers/loadingProvider';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
//import { useMemo } from 'react';

const mockData = [
  { 
    id: 1, 
    name: 'Sofia Vergara', 
    type: 'patient', 
    phone: '555-1234', 
    dob: '1943-02-15', 
    starred: true,
    callCount: 20,
    cases: [
      { id: 'c1', title: 'Diabetes Follow-up', date: '2023-01-10' },
      { id: 'c2', title: 'Blood Pressure Check', date: '2023-06-22' }
    ],
    notes: 'Prefers morning appointments.'
  },
  {
    id: 2,
    name: 'Lionel Messi',
    type: 'patient',
    phone: '555-5678',
    dob: '1939-11-03',
    starred: false,
    callCount: 5,
    cases: [
      { id: 'c3', title: 'Knee Pain Consultation', date: '2024-02-19' }
    ],
    notes: ''
  },
  {
    id: 3,
    name: 'Donald Trump',
    type: 'patient',
    phone: '555-2468',
    dob: '1985-07-12',
    starred: true,
    callCount: 18,
    cases: [
      { id: 'c4', title: 'Annual Physical', date: '2024-05-05' },
      { id: 'c5', title: 'Allergy Testing', date: '2024-06-15' }
    ],
    notes: 'Has peanut allergy.'
  },
  {
    id: 4,
    name: 'Dr. Javier Reyna',
    type: 'doctorsOffice',
    phone: '555-3333',
    dob: '',
    starred: true,
    callCount: 2,
    cases: [],
    notes: 'Cardiologist'
  },
  {
    id: 5,
    name: 'CVS Pharmacy',
    type: 'pharmacy',
    phone: '555-0001',
    dob: '',
    starred: true,
    callCount: 0,
    cases: [],
    notes: ''
  },
  {
    id: 6,
    name: 'HealthSun',
    type: 'insurance',
    phone: '555-9999',
    dob: '',
    starred: false,
    callCount: 0,
    cases: [],
    notes: ''
  },
  {
    id: 7,
    name: 'Kendall Regional',
    type: 'hospital',
    phone: '555-7777',
    dob: '',
    starred: false,
    callCount: 0,
    cases: [],
    notes: ''
  },
  {
    id: 8,
    name: 'La Colonia Medical Center',
    type: 'competitor',
    phone: '555-8888',
    dob: '',
    starred: false,
    callCount: 0,
    cases: [],
    notes: ''
  }
];

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
  const [filter, setFilter] = useState('All');
  const isSmall = useMediaQuery('(max-width:900px)');
  const [selectedView, setSelectedView] = useState('profile'); 
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { setLoading } = useLoading();

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  
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
    
  const updateProviderUI = async (data, id) => {
    const dataProvider = { ...data, id}
    await handleUpdateProvider({setLoading, dataProvider, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen});
  
  };


  return (
    <>
    <Card
      sx={{
        borderRadius: 4,
        position: 'fixed',
        top: 150,
        left: 220,
        right: 20,
        bottom: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 8px 24px rgba(239,241,246,1)',
        backgroundColor: '#fff',
        overflow: 'hidden'
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
            {[
              { label: 'All', icon: AllInboxIcon },
              { label: 'Frequent', icon: ScheduleIcon },
              { label: 'Starred', icon: (props) => <Icon icon="solar:star-bold" style={{ fontSize: '19px' }} /> }
            ].map(({ label, icon: Icon }) => (
              <ListItemButton
                key={label}
                selected={filter === label}
                onClick={() => {
                  setFilter(label);
                  setSelectedView('profile');
                }}
                sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}><Icon fontSize="small" /></ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>

          <ListItemButton
            onClick={() => setSelectedView('providers')}
            sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}>
              <LocalHospitalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Providers" />
          </ListItemButton>

          <Divider sx={{ my: 2 }} />

          <Typography fontSize={13} fontWeight="bold" color="#5B5F7B" mb={1}>
            CATEGORIES
          </Typography>
          <List>
            {[
              { label: 'Patient', icon: AssignmentIndIcon },
              { label: "Doctor's Office", icon: MedicalServicesIcon },
              { label: 'Pharmacy', icon: LocalPharmacyIcon },
              { label: 'Insurance', icon: SecurityIcon },
              { label: 'Hospital', icon: LocalHospitalIcon },
              { label: 'Competitors', icon: ApartmentIcon }
            ].map(({ label, icon: Icon }) => (
              <ListItemButton
                key={label}
                selected={filter === label}
                onClick={() => {
                  setFilter(label);
                  setSelectedView('profile');
                }}
                sx={{ borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1.2 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: 0 }}><Icon fontSize="small" /></ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Left panel */}
        <Box
          sx={{
            width: isSmall ? '100%' : '30%',
            pt:10, pl:2,
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

          {selectedView === 'providers' && (
            <ProviderList  onSelect={setSelectedProvider} />
          )}
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1.5, borderColor: '#f0f0f0' }}
        />

        {/* Right panel */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {selectedView === 'profile' && (
            selected ? (
              <>
                
              </>
            ) : (
              <Typography color="#5B5F7B">
                Select a patient to view details.
              </Typography>
            )
          )}

          {selectedView === 'providers' && (
            selectedProvider ? (
              <ProviderEditForm
                initialData={selectedProvider}
                onSubmit={async (updatedValues, providerID) => {
                  await updateProviderUI(updatedValues, providerID)
                }}
              />
            ) : (
              <Typography color="#5B5F7B">
                Select a provider from the left panel.
              </Typography>
            )
          )}
        </Box>
      </CardContent>
    </Card>

    {/* Snackbars */}
          <AlertSnackbar
            open={errorOpen}
            onClose={() => setErrorOpen(false)}
            severity="error"
            message={errorMessage}
          />
          <AlertSnackbar
            open={successOpen}
            onClose={() => setSuccessOpen(false)}
            severity="success"
            message={successMessage}
          />
          </>
  );

}
