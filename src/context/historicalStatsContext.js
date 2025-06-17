import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { getStats } from '../utils/apiStats';

const HistoricalStatsContext = createContext();

export const HistoricalStatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchHistoricalStatistics = async (accessToken, date) => {
    try {
      const res = await getStats(accessToken, date);
      if (res.success) {
        dispatch({ type: 'SET_HISTORICAL_STATS', payload: res.message });
      } else {
        console.error('Error fetching historical stats:', res.message);
      }
    } catch (error) {
      console.error('Error fetching historical stats', error);
    }
  };

  return (
    <HistoricalStatsContext.Provider value={{ state, dispatch, fetchHistoricalStatistics }}>
      {children}
    </HistoricalStatsContext.Provider>
  );
};

// Hooks
export const useHistoricalStats = () => useContext(HistoricalStatsContext);
export const useHistoricalStatsState = () => useContext(HistoricalStatsContext).state;
export const useHistoricalStatsDispatch = () => useContext(HistoricalStatsContext).dispatch;
export const useFetchHistoricalStatistics = () => useContext(HistoricalStatsContext).fetchHistoricalStatistics;
