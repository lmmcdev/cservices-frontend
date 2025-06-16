import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { getStats } from '../utils/apiStats';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchStatistics = async (accessToken) => {
    try {
      const res = await getStats(accessToken);
      if (res.success) {
        console.log(res.message)
        dispatch({ type: 'SET_STATS', payload: res.message });
      } else {
        console.error('Error fetching stats:', res.message);
      }
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  };

  return (
    <StatsContext.Provider value={{ state, dispatch, fetchStatistics }}>
      {children}
    </StatsContext.Provider>
  );
};

// Hooks
export const useStats = () => useContext(StatsContext);
export const useStatsState = () => useContext(StatsContext).state;
export const useStatsDispatch = () => useContext(StatsContext).dispatch;
export const useFetchStatistics = () => useContext(StatsContext).fetchStatistics;

