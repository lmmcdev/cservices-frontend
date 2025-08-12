import React, { createContext, useReducer, useContext } from 'react';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';
//import { getStats } from '../utils/apiStats';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dailyStatsReducer, initialDailyStatsState);

  const fetchStatistics = async (date) => {
    /*try {
      const res = await getStats(date);
      if (res.success) {
        dispatch({ type: 'SET_STATS', payload: res.message });
      } else {
        console.error('Error fetching stats:', res.message);
      }
    } catch (error) {
      console.error('Error fetching stats', error);
    }*/
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

