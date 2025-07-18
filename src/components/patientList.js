import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getPatients } from '../utils/apiPatients';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import PatientsAutocomplete from './components/patientsAutocomplete';

const typeAvatars = {
  provider: '👨‍⚕️',
};

const avatarColors = {
  provider: '#eae8fa',
  default: '#f1f5ff',
};

const PatientList = ({ onSelect }) => {
  const [patients, setPatients] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [isSearching, ] = useState(false);

  // 🔹 Cargar paginación por defecto
  const fetchPatients = useCallback(async () => {
    if (loading || !hasMore || isSearching) return;
    setLoading(true);
    try {
      const response = await getPatients({
        params: {
          limit: 10,
          continuationToken: continuationToken,
        },
      });

      const { items, continuationToken: nextToken } = response.message;
      setPatients((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });

      setContinuationToken(nextToken || null);
      setHasMore(!!nextToken);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  }, [continuationToken, hasMore, loading, isSearching]);

  // 🔹 Observador para scroll infinito
  const lastProviderRef = useCallback(
    (node) => {
      if (loading || isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPatients();
        }
      }, { rootMargin: '300px' });

      if (node) observer.current.observe(node);
    },
    [fetchPatients, hasMore, loading, isSearching]
  );

  // 🔹 Cargar los primeros resultados SOLO si no estamos buscando
  useEffect(() => {
    if (!isSearching && patients.length === 0) {
      fetchPatients();
    }
  }, [fetchPatients, isSearching, patients.length]);



  return (
    <><PatientsAutocomplete onSelect={(patient) => onSelect(patient)} />
    <Box sx={{ p: 4, maxWidth: '600px', mx: 'auto', height: '500px', overflowY: 'auto' }}>

      <List spacing={2}>
        {patients.map((patient, index) => {
          const isLastItem = index === patients.length - 1;

          return (
            <ListItemButton
              key={patient.id}
              ref={isLastItem && !isSearching ? lastProviderRef : null}
              onClick={() => onSelect(patient)}
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
                  bgcolor: avatarColors[patient.type] || avatarColors.default,
                  color: '#5B5F7B',
                }}
              >
                {typeAvatars[patient.type] || '👤'}
              </Avatar>

              <ListItemText
                primary={
                  <Typography className="profile-name" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                    {patient["Name"] || "N/A"}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" sx={{ color: '#5B5F7B' }}>
                      {patient["Email"]} <Divider />
                      {patient["PCP"]}
                    </Typography>
                  </>
                }
              />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setPatients((prev) =>
                    prev.map((p) =>
                      p.id === patient.id ? { ...p, starred: !p.starred } : p
                    )
                  );
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: patient.starred ? '#ffb900' : '#5B5F7B',
                }}
              >
                <Icon icon={patient.starred ? "solar:star-bold" : "solar:star-outline"} style={{ fontSize: '18px' }} />
              </IconButton>
            </ListItemButton>
          );
        })}
      </List>

      {!hasMore && !loading && patients.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No hay más datos
        </Typography>
      )}
    </Box></>
  );
};

export default PatientList;
