// src/components/statusFilterBoxes.jsx
import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { getStatusColor } from '../../utils/js/statusColors';

const STATUSES = [
  'New',
  'Emergency',
  'In Progress',
  'Pending',
  'Done',
  'Duplicated',
  'Total',
];

// Convierte cualquier forma a un número
function normalizeToCount(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') {
    if (Array.isArray(value.ids)) return value.ids.length;
    if (Array.isArray(value.ticketIds)) return value.ticketIds.length;
    if (Number.isFinite(value.count)) return value.count;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// Construye un mapa {status: count} y calcula Total si falta o no es numérico/array
function computeDisplayCounts(counts) {
  const safe = counts || {};

  // Si viene Total, normalízalo; si no, lo calculamos
  const explicit = normalizeToCount(safe.Total);

  // Suma de todos menos "Total"
  let sum = 0;
  for (const [k, v] of Object.entries(safe)) {
    if (k === 'Total') continue;
    sum += normalizeToCount(v);
  }

  const total = Number.isFinite(explicit) && explicit > 0 ? explicit : sum;
  return { ...safe, Total: total };
}

export default function StatusFilterBoxes({
  selectedStatus,
  setSelectedStatus,
  ticketsCountByStatus,
}) {
  console.log('rendered status filterboxes')
  const finalCounts = useMemo(
    () => computeDisplayCounts(ticketsCountByStatus),
    [ticketsCountByStatus]
  );

  return (
    <Grid container columnSpacing={2} rowSpacing={0} sx={{ width: '100%', flexWrap: 'nowrap' }}>
      {STATUSES.map((status) => {
        const bgColor = getStatusColor(status, 'bg');
        const textColor = getStatusColor(status, 'text');
        const count = normalizeToCount(finalCounts?.[status]);

        const isSelected = selectedStatus === status;

        return (
          <Grid
            item
            key={status}
            sx={{ flex: '1 1 0', display: 'flex', minWidth: 0 }}
            onClick={() => setSelectedStatus(status)}
          >
            <Card
              sx={{
                width: '100%',
                height: { xs: 70, sm: 90, md: 110, lg: 130, xl: 150 },
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `6px solid ${textColor}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2,
                transform: isSelected ? 'scale(1.03)' : 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" fontWeight="bold" lineHeight={1}>
                  {count}
                </Typography>
                <Chip label={status} size="small" sx={{ backgroundColor: textColor, color: '#fff', mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
