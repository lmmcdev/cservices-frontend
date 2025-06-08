import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  return (
    <TicketsContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketsContext.Provider>
  );
};

// Hook para acceder al contexto completo
export const useTickets = () => useContext(TicketsContext);

// Hook solo para el estado
export const useTicketsState = () => useContext(TicketsContext).state;

// Hook solo para el dispatch
export const useTicketsDispatch = () => useContext(TicketsContext).dispatch;
