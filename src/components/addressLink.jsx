import React from 'react';
import { Link, Tooltip, Typography } from '@mui/material';
import { Iconify } from './auxiliars/icons';

const formatZip = (zipBase, zip4) => {
  const onlyDigits = (v) => (v ? String(v).match(/\d/g)?.join('') ?? '' : '');
  const base = onlyDigits(zipBase);
  const plus4 = onlyDigits(zip4);
  if (base && plus4) return `${base.slice(0, 5)}-${plus4.slice(0, 4)}`;
  if (!plus4 && base.length >= 9) return `${base.slice(0, 5)}-${base.slice(5, 9)}`;
  if (base.length >= 5) return base.slice(0, 5);
  return base;
};

const formatAddressText = ({ line1, city, state, zip, zip4 }) => {
  const s = String(state || '').toUpperCase();
  const z = formatZip(zip, zip4);
  const locality = [city, s].filter(Boolean).join(', ');
  const tail = [locality, z].filter(Boolean).join(' ');
  const parts = [];
  if (line1) parts.push(line1);
  if (locality || z) parts.push(tail);
  const full = parts.join(', ');
  return full || 'N/A';
};

const AddressLink = ({
  line1,
  city,
  state,
  zip,
  zip4,
  underline = 'always',
  color = '#6c757d',
  fontSize = '0.75rem',
  stopPropagation = true,
  withIcon = true,
  sx,
}) => {
  const text = formatAddressText({ line1, city, state, zip, zip4 });
  const valid = text && text !== 'N/A';
  if (!valid) {
    return (
      <Typography variant="body2" sx={{ color, fontSize, ...sx }}>
        {text}
      </Typography>
    );
  }
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
  const content = (
    <>
      {withIcon && (
        <Iconify icon="mdi:map-marker-outline" width="16" height="16" style={{ color: 'inherit' }} />
      )}
      {text}
    </>
  );
  return (
    <Tooltip title="Open in Google Maps">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        underline={underline}
        color={color}
        variant="body2"
        onClick={(e) => stopPropagation && e.stopPropagation()}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize,
          ...sx,
        }}
      >
        {content}
      </Link>
    </Tooltip>
  );
};

export default AddressLink;
