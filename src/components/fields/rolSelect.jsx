import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const roles = ['Customer Service', 'Supervisor'];

export default function RolSelect({ value, onChange, label = "Role", sx = {} }) {
  return (
    <FormControl fullWidth variant="outlined" size="small" sx={{ width: '340px', ...sx }}>
      <InputLabel id="role-select-label" shrink>{label}</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        input={<OutlinedInput notched label={label} />}
        IconComponent={ExpandMoreIcon}
        sx={{
          fontSize: 16,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#aaa',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00A1FF',
          },
        }}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role} sx={{ fontSize: 14 }}>
            {role}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
