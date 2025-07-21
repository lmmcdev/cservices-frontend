import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MDVitaLocationSelect = ({ label = 'Select Location', value, onChange }) => {
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
        'WEST PALM BEACH'
      ]
    },
    {
      group: 'PWMC',
      values: [
        'N MIAMI BEACH - 2ND FLOOR',
        'CUTLER RIDGE',
        'CUTLER BAY',
        'MARLINS PARK'
      ]
    }
  ];

  const commonStyles = {
    fontSize: 16,
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center'
    }
  };

  // ✅ Generamos lista plana para evitar Fragment
  const menuItems = [
    <MenuItem key="all" value="">
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
        const fullValue = `${center.group} - ${loc}`;
        return (
          <MenuItem key={fullValue} value={fullValue} sx={{ fontSize: 16 }}>
            {fullValue}
          </MenuItem>
        );
      })
    ])
  ];

  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel
        id="center-select-label"
        sx={{ fontSize: 16, color: 'text.secondary' }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="center-select-label"
        id="center-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        sx={commonStyles}
        IconComponent={ExpandMoreIcon}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default MDVitaLocationSelect;
