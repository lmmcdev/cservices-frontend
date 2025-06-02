import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const departments = [
  'Medical Centers',
  'OTC',
  'Pharmacy',
  'Referrals',
  'Shared Services'
];

export default function DepartmentSelect({ value, onChange, label = "Department" }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="department-select-label">{label}</InputLabel>
      <Select
        labelId="department-select-label"
        id="department-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
