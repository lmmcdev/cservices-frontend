import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  return (
    <StatsContext.Provider value={{ state, dispatch }}>
      {children}
    </StatsContext.Provider>
  );
};

// Hook para acceder al contexto completo
export const useStats = () => useContext(StatsContext);

// Hook solo para el estado
export const useStatsState = () => useContext(StatsContext).state;

// Hook solo para el dispatch
export const useStatsDispatch = () => useContext(StatsContext).dispatch;
