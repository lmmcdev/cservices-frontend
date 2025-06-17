import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const departments = ['OTC', 'Pharmacy', 'Referrals'];

export default function DepartmentSelect({
  value,
  onChange,
  label = "Department",
  sx = {},
  InputLabelProps = {} // 👈 permite personalización opcional del label
}) {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      size="small"
      sx={{
        ...sx, // se hereda estilo externo
      }}
    >
      <InputLabel
        id="department-select-label"
        shrink={InputLabelProps?.shrink ?? true} // 👈 shrink por defecto, a menos que se indique lo contrario
      >
        {label}
      </InputLabel>

      <Select
        labelId="department-select-label"
        id="department-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        input={<OutlinedInput notched label={label} />}
        IconComponent={ExpandMoreIcon}
        displayEmpty
        renderValue={(selected) => selected || ''}
        sx={{
          fontSize: 16,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#aaa',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00a1ff',
          },
        }}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} value={dept} sx={{ fontSize: 14 }}>
            {dept}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
