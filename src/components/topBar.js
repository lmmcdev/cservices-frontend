import React, { useEffect, useReducer, useState } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { useLoading } from '../components/loadingProvider';
import AutocompleteFilter from './components/autoCompleteFilter';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  Fade,
} from '@mui/material';
import { fetchAgentData } from '../utils/api';
import { icons } from '../components/icons';

export default function Topbar() {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();

  const clinics = ['Wellmax Cutler Ridge', 'LMMC Homestead', 'Pasteur Hialeah Center', 'LMMC Hialeah West', 'Wellmax Marlings'];

  const [callerIds, setCallerIds] = useState([]);
  const [assignedAgents, setAssignedTo] = React.useState([]);
  //const selectedEmails = assignedAgents.map(agent => agent.agent_email);

  const [date, setDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchAgentData(dispatch, setLoading);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [setLoading]);

  const { agents, error } = state;
  console.log(`Error: ${error}`)
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  //console.log(assignedAgents)

  return (
    <Card
      elevation={3}
      sx={{
        position: 'fixed',
        top: 40,
        left: 200,
        right: 20,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: 2,
          paddingX: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="p" sx={{ minWidth: 160, color: 'text.secondary', fontWeight: 'bold' }}>
          Call Logs
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Fade in={showFilters} timeout={300}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                //label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{
                  width: 240,
                  '& input': {
                    paddingY: 0,
                    fontSize: 12,
                    color: 'text.secondary',
                    height: 36,
                    boxSizing: 'border-box',
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'text.secondary', fontSize: 12 },
                }}
              />

              {/**Assigned to*/}
              <AutocompleteFilter
                label="Assigned to"
                options={agents}
                value={agents.filter((agent) => assignedAgents.includes(agent.agent_email))}
                onChange={(newSelected) => {
                  const emails = newSelected.map((a) => a.agent_email);
                  setAssignedTo(emails);
                }}
                optionLabelKey="agent_name"
              />

              {/**Caller IDs*/}
              <AutocompleteFilter
                label="Caller ID"
                options={clinics}
                value={callerIds}
                onChange={setCallerIds}
              />
              
            </Stack>
          </Fade>

          <Tooltip title="Show/Hide Filters">
            {/*<IconButton color="primary" onClick={toggleFilters}>
              <FilterListIcon fontSize='small'/>
            </IconButton>*/}
            <IconButton 
              onClick={toggleFilters} 
              color="text"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                }
              }}
            >
              {showFilters ? (
                <icons.filterOn fontSize='small' />
              ) : (
                <icons.filterOff fontSize='small' />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Case">
            <IconButton sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          height: 26,
                          width: 36,
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
              {/*<AddIcCallIcon fontSize='small'/>*/}
              <icons.addCase style={{fontSize: '17px'}} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Perfil de usuario">
            <IconButton sx={{
              '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {/*<GroupsIcon fontSize='small'/>*/}
              <icons.supervisorView style={{ fontSize: '17px'}} />
            </IconButton >
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
