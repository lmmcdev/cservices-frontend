import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const commonStyles = {
  fontSize: 12,
  height: 36,
  width: 240,
  color: 'text.secondary',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ccc',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#aaa',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00a1ff',
  },
};


const centers = [
  'Bird Road MC','Cutler Ridge MC','East Hialeah MC',
  'Hialeah MC','Hiatus MC','Hollywood MC','Homestead MC','Marlins Park MC','Miami 27th MC','Miami Gardens MC','North Miami Beach MC','Pembroke Pines MC',
  'Plantation MC','Tamarac MC','West Hialeah MC','West Kendall MC','West Palm Beach MC','Westchester MC','Specialist Center Hialeah Gardens','Specialist Center Bird Road'
];

export default function CenterSelect({ value, onChange, label = "Center" }) {
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel 
        id="center-select-label"
        sx={{ fontSize: 12, color: 'text.secondary' }}
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
        {centers.map((dept) => (
          <MenuItem key={dept} value={dept} sx={{ fontSize: 12 }}>
            {dept}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  );
}
