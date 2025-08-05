// components/CollaboratorAutoComplete.jsx
import React from 'react';
import { Box } from '@mui/material';
import AutocompleteFilter from './autoCompleteFilter';

export default function CollaboratorAutoComplete({
  agents,
  selectedEmails,
  onChange,
  label = 'Collaborators',
}) {
  const selectedObjects = (agents || []).filter(agent =>
    (selectedEmails || []).includes(agent.agent_email)
  );

  return (
    <Box
      sx={{
        '& .MuiInputLabel-root': { fontSize: 14 },
        '& .MuiInputBase-root': { height: 40 },
        '& .MuiOutlinedInput-root': { height: 40 },
        '& .MuiOutlinedInput-input': { padding: '8px 14px', fontSize: 14 },
        '& .MuiAutocomplete-inputRoot': { padding: '0 !important' },
        '& .MuiAutocomplete-input': { fontSize: 14 },
        '& .MuiAutocomplete-endAdornment': { right: 8 },
      }}
    >
      <AutocompleteFilter
        label={label}
        options={agents}
        value={selectedObjects}
        onChange={(newSelected) => {
          const emails = newSelected.map(a => a.agent_email);
          if (onChange) onChange(emails);
        }}
        optionLabelKey="agent_name"
      />
    </Box>
  );
}
