import React, { createContext, useReducer, useContext } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';
import { getStats, getDailyStats } from '../utils/apiStats';
import { useLoading } from '../providers/loadingProvider';

const HistoricalStatsContext = createContext();

export const HistoricalStatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const [stateStats, dispatchStats ] = useReducer(dailyStatsReducer, initialDailyStatsState);
  const { setLoading } = useLoading();

  // 🗂️ Obtiene los estados
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

  // 📅 Obtiene los datos diarios
  const fetchDailyStatistics = async (accessToken, date) => {

    try {
      const res = await getDailyStats(date);
      if (res.success) {
        dispatchStats({ type: 'SET_HISTORIC_DAILY_STATS', payload: res.message });
      } else {
        console.error('Error fetching historical daily stats:', res.message);
      }
    } catch (error) {
      console.error('Error fetching historical daily stats', error);
    }
  };

  // 🚀 NUEVA: Ejecuta ambas juntas
  const fetchAllHistoricalStats = async (accessToken, date) => {
    setLoading(true);
    await Promise.all([
      fetchHistoricalStatistics(accessToken, date),
      fetchDailyStatistics(accessToken, date)
    ]);
    setLoading(false);
  };

  return (
    <HistoricalStatsContext.Provider
      value={{
        state,
        stateStats,
        dispatch,
        fetchHistoricalStatistics,
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
