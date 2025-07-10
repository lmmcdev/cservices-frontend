import React, { createContext, useReducer, useContext } from 'react';
//import { ticketReducer, initialState } from '../store/ticketsReducer';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';

const DailyStatsContext = createContext();

export const DailyStatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dailyStatsReducer, initialDailyStatsState);

  return (
    <DailyStatsContext.Provider value={{ state, dispatch }}>
      {children}
    </DailyStatsContext.Provider>
  );
};

// Hook para acceder al contexto completo
export const useDailyStats = () => useContext(DailyStatsContext);

// Hook solo para el estado
export const useDailyStatsState = () => useContext(DailyStatsContext).state;

// Hook solo para el dispatch
export const useDailyStatsDispatch = () => useContext(DailyStatsContext).dispatch;
