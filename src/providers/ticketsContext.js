import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  return (
    <TicketsContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => useContext(TicketsContext);
