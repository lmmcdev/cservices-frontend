import React, { createContext, useReducer, useContext } from 'react';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';
import { useApiHandlers } from '../utils/js/apiActions';

const HistoricalStatsContext = createContext();

export const HistoricalStatsProvider = ({ children }) => {
  const [stateStats, dispatchStats ] = useReducer(dailyStatsReducer, initialDailyStatsState);
  const { getDailyStatsHandler } = useApiHandlers();

  // 📅 Obtiene los datos diarios
  const fetchDailyStatistics = async (date, dispatchAction) => {

    try {
      const res = await getDailyStatsHandler(date, dispatchAction);
      //Esto debo hacerlo en el runner
      if (res.success) {
        dispatchStats({ type: `${dispatchAction}`, payload: res });
      } else {
        console.error('Error fetching historical daily stats:', res.message);
      }

    } catch (error) {
      console.error('Error fetching historical daily stats', error);
    }
  };

  // 🚀 NUEVA: Ejecuta ambas juntas
  const fetchAllHistoricalStats = async (date, dispatchAction) => {
    await Promise.all([
      fetchDailyStatistics(date, dispatchAction)
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
// context/historicalStatsContext.js
export const useHistoricDailyStats = () => {
  const { stateStats } = useHistoricalStats();
  return stateStats.historic_daily_stats || {};
};

// Selectores concretos para gráficos:
export const useHistoricHourlyBreakdown = () => {
  const stats = useHistoricDailyStats();
  return stats.hourlyBreakdown || [];
};

export const useHistoricRiskStats = () => {
  const stats = useHistoricDailyStats();
  return stats.aiClassificationStats?.risk || {};
};

export const useHistoricPriorityStats = () => {
  const stats = useHistoricDailyStats();
  return stats.aiClassificationStats?.priority || {};
};

export const useHistoricCategoryStats = () => {
  const stats = useHistoricDailyStats();
  return stats.aiClassificationStats?.category || {};
};

export const useHistoricStatusCounts = () => {
  const stats = useHistoricDailyStats();
  return stats.statusCounts || {};
};
