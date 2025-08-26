import React, { createContext, useReducer, useContext } from 'react';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';
//import { getDailyStats } from '../utils/apiStats';
import { useApiHandlers } from '../utils/js/apiActions';

const HistoricalStatsContext = createContext();

export const HistoricalStatsProvider = ({ children }) => {
  const [stateStats, dispatchStats ] = useReducer(dailyStatsReducer, initialDailyStatsState);
  const { getDailyStatsHandler } = useApiHandlers();

  // 📅 Obtiene los datos diarios
  const fetchDailyStatistics = async (date) => {

    try {
      const res = await getDailyStatsHandler(date);
      //Esto debo hacerlo en el runner
      if (res.success) {
        dispatchStats({ type: 'SET_HISTORIC_DAILY_STATS', payload: res });
      } else {
        console.error('Error fetching historical daily stats:', res.message);
      }

    } catch (error) {
      console.error('Error fetching historical daily stats', error);
    }
  };

  // 🚀 NUEVA: Ejecuta ambas juntas
  const fetchAllHistoricalStats = async (date) => {
    await Promise.all([
      fetchDailyStatistics(date)
    ]);
  };

  return (
    <HistoricalStatsContext.Provider
      value={{
        stateStats,
        dispatchStats,
        fetchDailyStatistics,
        fetchAllHistoricalStats, // 👈 exporta la nueva
      }}
    >
      {children}
    </HistoricalStatsContext.Provider>
  );
};

// Hooks
export const useHistoricalStats = () => useContext(HistoricalStatsContext);
export const useHistoricalStatsState = () => useContext(HistoricalStatsContext).state;
export const useHistoricalStatsDispatch = () => useContext(HistoricalStatsContext).dispatch;
export const useFetchHistoricalStatistics = () => useContext(HistoricalStatsContext).fetchHistoricalStatistics;
export const useFetchHistoricalDailyStatistics = () => useContext(HistoricalStatsContext).fetchDailyStatistics;
export const useFetchAllHistoricalStatistics = () => useContext(HistoricalStatsContext).fetchAllHistoricalStats;
