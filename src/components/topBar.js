import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Avatar,
  Tooltip,
  Stack,
  Fade,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import GroupsIcon from '@mui/icons-material/Groups';

export default function Topbar() {
  const clinics = ['Wellmax Cutler Ridge', 'LMMC Homestead', 'Pasteur Hialeah Center', 'LMMC Hialeah West', 'Wellmax Marlings'];
  const agents = ['Ana Pérez', 'Luis Gómez', 'Carlos Rivas'];

  const [callerIds, setCallerIds] = React.useState([]);
  const [assignedTo, setAssignedTo] = React.useState([]);
  const [date, setDate] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(true);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const getAppliedFilters = () => ({
    callerIds,
    assignedTo,
    date,
  });

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
          {/* Filtros con efecto Fade */}
          <Fade in={showFilters} timeout={300}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              {/* Fecha */}
              <TextField
                size="small"
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{
                  width: 240,
                  '& input': {
                    paddingY: 1,
                    fontSize: 11,
                    color: 'text.secondary',
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'text.secondary', fontSize: 12 },
                }}
              />

              {/* Assigned To */}
              <Autocomplete
                multiple
                size="small"
                options={agents}
                value={assignedTo}
                onChange={(e, newValue) => setAssignedTo(newValue)}
                disableCloseOnSelect
                sx={{ width: 240 }}
                renderTags={(value, getTagProps) => (
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 0.5,
                      maxWidth: '100%',
                      paddingY: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value.map((option, index) => (
                      <Box
                        key={option}
                        component="span"
                        {...getTagProps({ index })}
                        sx={{
                          background: '#e0e0e0',
                          fontSize: 11,
                          borderRadius: 1,
                          px: 1,
                          py: 0.25,
                          maxWidth: 100,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {option}
                      </Box>
                    ))}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned to"
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary', fontSize: 12 } }}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        fontSize: 12,
                        color: 'text.secondary',
                        height: 36,
                        alignItems: 'center',
                        overflow: 'hidden',
                      },
                    }}
                  />
                )}
              />

              {/* Caller ID */}
              <Autocomplete
                multiple
                size="small"
                options={clinics}
                value={callerIds}
                onChange={(e, newValue) => setCallerIds(newValue)}
                disableCloseOnSelect
                sx={{ width: 240 }}
                renderTags={(value, getTagProps) => (
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 0.5,
                      maxWidth: '100%',
                      paddingY: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value.map((option, index) => (
                      <Box
                        key={option}
                        component="span"
                        {...getTagProps({ index })}
                        sx={{
                          background: '#e0e0e0',
                          fontSize: 11,
                          borderRadius: 1,
                          px: 1,
                          py: 0.25,
                          maxWidth: 100,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {option}
                      </Box>
                    ))}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Caller ID"
                    variant="outlined"
                    InputLabelProps={{ sx: { color: 'text.secondary', fontSize: 12 } }}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        fontSize: 12,
                        color: 'text.secondary',
                        height: 36,
                        alignItems: 'center',
                        overflow: 'hidden',
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </Fade>

          {/* Botones de acción */}
          <Tooltip title="Show/Hide Filters">
            <IconButton color="primary" onClick={toggleFilters}>
              <FilterListIcon fontSize='small'/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Case">
            <IconButton>
              <AddIcCallIcon fontSize='small'/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Perfil de usuario">
            <IconButton>
              <GroupsIcon fontSize='small'/>
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
