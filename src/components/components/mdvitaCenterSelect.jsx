import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MDVitaLocationSelect = ({ label = 'Location', value, onChange }) => {
  const centers = [
    {
      group: 'LMMC',
      values: [
        'BIRD ROAD',
        'KENDALL',
        'MIAMI 27TH AVE',
        'WEST HIALEAH',
        'WEST KENDALL',
        'EAST HIALEAH',
        'HOMESTEAD',
        'PLANTATION',
        'PEMBROKE PINES',
        'TAMARAC',
        'HOLLYWOOD',
        'WEST PALM BEACH',
      ],
    },
    {
      group: 'PWMC',
      values: [
        'N MIAMI BEACH - 2ND FLOOR',
        'CUTLER RIDGE',
        'CUTLER BAY',
        'MARLINS PARK',
      ],
    },
  ];

  const menuItems = [
    <MenuItem key="placeholder" value="">
      <em>All Locations</em>
    </MenuItem>,
    ...centers.flatMap((center) => [
      <MenuItem
        key={`group-${center.group}`}
        disabled
        sx={{ fontWeight: 'bold', fontSize: 14, color: 'text.secondary' }}
      >
        {center.group}
      </MenuItem>,
      ...center.values.map((loc) => {
        const full = `${center.group} - ${loc}`;
        return (
          <MenuItem key={full} value={full} sx={{ fontSize: 16 }}>
            {full}
          </MenuItem>
        );
      }),
    ]),
  ];

  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        '& .MuiInputLabel-root': {
          '&:hover:not(.Mui-focused)': {
            color: '#999999',
          },
          '&.Mui-focused': {
            color: '#00A1FF',
          },
        },
        '& .MuiOutlinedInput-root': {
          '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: '#999999',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00A1FF',
          },
        },
      }}
    >
      <InputLabel id="location-label">{label}</InputLabel>
      <Select
        labelId="location-label"
        id="location-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        IconComponent={ExpandMoreIcon}
        input={
          <OutlinedInput
            label={label}
            sx={{
              height: '56px',
              '& .MuiOutlinedInput-notchedOutline': { top: 0 },
            }}
          />
        }
        sx={{
          '& .MuiSelect-select': {
            padding: '16.5px 14px',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default MDVitaLocationSelect;
