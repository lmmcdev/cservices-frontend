import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const TicketListUI = ({ tickets }) => {
  return (
    <List>
      {tickets.map(ticket => (
        <ListItem key={ticket.id}>
          <ListItemText
            primary={`Summary: ${ticket.summary || 'N/A'}`}
            secondary={`Reason: ${ticket.call_reason || 'N/A'}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TicketListUI;
