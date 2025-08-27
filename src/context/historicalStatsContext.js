// src/context/HistoricalStatsContext.js
import React, { createContext, useReducer, useContext } from 'react';
import { dailyStatsReducer, initialDailyStatsState } from '../store/statsReducer';
import { useApiHandlers } from '../utils/js/apiActions';

// 📌 Contexto principal
const HistoricalStatsContext = createContext();

// 📌 Provider
export const HistoricalStatsProvider = ({ children }) => {
  const [stateStats, dispatchStats] = useReducer(dailyStatsReducer, initialDailyStatsState);
  const { getDailyStatsHandler } = useApiHandlers();

  // 📅 Obtiene los datos diarios
  const fetchDailyStatistics = async (date, dispatchAction) => {
    try {
      const res = await getDailyStatsHandler(date, dispatchAction);
      if (res.success) {
        dispatchStats({ type: `${dispatchAction}`, payload: res });
      } else {
        console.error('Error fetching historical daily stats:', res.message);
      }
    } catch (error) {
      console.error('Error fetching historical daily stats', error);
    }
  };

  // 🚀 Ejecuta todas las consultas necesarias
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
        fetchAllHistoricalStats,
      }}
    >
      {children}
    </HistoricalStatsContext.Provider>
  );
};

//
// ==========================
// 🔹 Hooks generales
// ==========================
export const useHistoricalStats = () => useContext(HistoricalStatsContext);
export const useHistoricalStatsState = () => useContext(HistoricalStatsContext).stateStats;
export const useHistoricalStatsDispatch = () => useContext(HistoricalStatsContext).dispatchStats;
export const useFetchHistoricalStatistics = () => useContext(HistoricalStatsContext).fetchDailyStatistics;
export const useFetchAllHistoricalStatistics = () => useContext(HistoricalStatsContext).fetchAllHistoricalStats;

// ==========================
// 🔹 Hooks selectores específicos de aiClassification
// ==========================
export const useCategoryStat = () => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return stateStats?.historic_daily_stats?.aiClassificationStats?.category || {};
};

export const useRiskStat = () => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return stateStats?.historic_daily_stats?.aiClassificationStats?.risk || {};
};

export const usePriorityStat = () => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return stateStats?.historic_daily_stats?.aiClassificationStats?.priority || {};
};

export const useTopAgentsStat = () => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return stateStats?.historic_daily_stats?.agentStats || {};
};


export const useCallsByHourStat = () => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return Array.isArray(stateStats?.historic_daily_stats?.hourlyBreakdown)
    ? stateStats.historic_daily_stats.hourlyBreakdown
    : [];
};
// 🔹 Hook genérico (si necesitas cualquier campo de aiClassification)
export const useAiClassificationField = (field) => {
  const { stateStats } = useContext(HistoricalStatsContext);
  return stateStats?.historic_daily_stats?.aiClassificationStats?.[field] || {};
};