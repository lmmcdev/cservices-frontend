// components/CollaboratorAutoComplete.tsx
import React from 'react';
import AutocompleteFilter from './autoCompleteFilter';

export default function CollaboratorAutoComplete({
  agents,
  selectedEmails,
  onChange,
  label = 'Collaborators',
}) {
  const selectedObjects = agents.filter(agent =>
    selectedEmails.includes(agent.agent_email)
  );

  return (
    <AutocompleteFilter
      label={label}
      options={agents}
      value={selectedObjects}
      onChange={(newSelected) => {
        const emails = newSelected.map((a) => a.agent_email);
        onChange(emails);
      }}
      optionLabelKey="agent_name"
    />
  );
}
