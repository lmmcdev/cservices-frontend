import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultStyles = {
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

const roles = ['Customer Service', 'Supervisor'];

export default function RolSelect({ value, onChange, label = "Role", sx = {} }) {
  return (
    <FormControl fullWidth variant="outlined" size="small" sx={sx}>
      <InputLabel 
        id="role-select-label"
        sx={{ fontSize: 12, color: 'text.secondary' }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        sx={{ ...defaultStyles, ...sx }}
        IconComponent={ExpandMoreIcon}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role} sx={{ fontSize: 12 }}>
            {role}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
