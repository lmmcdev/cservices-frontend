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


const departments = [
  'OTC',
  'Pharmacy',
  'Referrals',
];

export default function DepartmentSelect({ value, onChange, label = "Department" }) {
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel 
        id="department-select-label"
        sx={{ fontSize: 12, color: 'text.secondary' }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="department-select-label"
        id="department-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        sx={commonStyles}
        IconComponent={ExpandMoreIcon}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} value={dept} sx={{ fontSize: 12 }}>
            {dept}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  );
}
