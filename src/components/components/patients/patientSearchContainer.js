//generate new react component
import React, { useState } from 'react';
import SearchPatientDeepContainer from './patientsDeepSearch';

const PatientSearchContainer = ({onSelectFunc}) => {
 const [selectedPatient, ] = useState(null);

  return (
    <div>
      
      <SearchPatientDeepContainer
        onSelect={onSelectFunc} selectedPatientFunc={selectedPatient}
      />
      
    </div>
  );
};

export default PatientSearchContainer;
