//generate new react component
import React, { useState } from 'react';
import SearchPatientDeepContainer from './patientsDeepSearch';

const PatientSearchContainer = ({onSelectFunc}) => {
 const [selectedPatient, setSelectedPatient] = useState(null);

  const onSelect = (patient) => {
    console.log('Selected patient:', patient);
    setSelectedPatient(patient);
    //setOpenConfirmDialog(true);
  };


  return (
    <div>
      
      <SearchPatientDeepContainer
        onSelect={onSelectFunc} selectedPatientFunc={selectedPatient}
      />
      
    </div>
  );
};

export default PatientSearchContainer;
