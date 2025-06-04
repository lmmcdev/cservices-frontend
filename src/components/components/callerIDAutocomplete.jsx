// components/CollaboratorAutoComplete.tsx
import React, { useState } from 'react';
import AutocompleteFilter from './autoCompleteFilter';

export default function CallerIDAutoComplete({
  onChange,
  label = 'Caller ID',
}) {
  const clinics = [
    'Wellmax Cutler Ridge',
    'LMMC Homestead',
    'Pasteur Hialeah Center',
    'LMMC Hialeah West',
    'Wellmax Marlings',
    'OTC',
    'Pharmacy',
    'Referrals'
  ];

  const [selectedClinics, setSelectedClinics] = useState([]);

  const handleChange = (newValue) => {
    setSelectedClinics(newValue);
    if (onChange) onChange(newValue); // propagar al padre si lo usa
  };

  return (
    <AutocompleteFilter
      label={label}
      options={clinics}
      value={selectedClinics}
      onChange={handleChange}
    />
  );
}
