//generate new react component
import React, { useState } from 'react';
import SearchTicketDeep from './ticketsDeepSeacrh';

const TicketSearchContainer = ({onSelectFunc}) => {
 const [selectedTicket, ] = useState(null);

  
  return (
    <div>
      <SearchTicketDeep
        onSelect={onSelectFunc} selectedTicketFunc={selectedTicket}
      />
      
    </div>
  );
};

export default TicketSearchContainer;
