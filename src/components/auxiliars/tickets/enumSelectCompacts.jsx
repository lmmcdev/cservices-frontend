// --- file: src/components/common/EnumSelectCompact.jsx
import React from 'react';
import { Select, MenuItem, Box } from '@mui/material';


/**
* EnumSelectCompact
* Reutilizable para selects compactos de valores discretos.
*
* Props:
* - value: any
* - onChange: (event) => void (evento MUI Select)
* - options: Array<string | { value: string, label?: React.ReactNode, icon?: React.ReactNode }>
* - size?: 'small' | 'medium' (default 'small')
* - minWidth?: number (default 100)
* - sx?: object (estilos MUI)
* - itemSx?: object (estilos por MenuItem)
* - renderOption?: (opt) => ReactNode (para personalizar el contenido del item)
*/
export function EnumSelectCompact({
value,
onChange,
options,
size = 'small',
minWidth = 100,
sx,
itemSx,
renderOption,
}) {
const norm = (opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt);
return (
<Select
size={size}
value={value}
onChange={onChange}
sx={{ minWidth, borderRadius: 2, fontSize: 10, ...(sx || {}) }}
MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
>
{(options || []).map((opt) => {
const o = norm(opt);
return (
<MenuItem key={o.value} value={o.value} dense sx={{ fontSize: 12, ...(itemSx || {}) }}>
{renderOption ? (
renderOption(o)
) : (
<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
{o.icon || null}
{o.label ?? o.value}
</Box>
)}
</MenuItem>
);
})}
</Select>
);
}