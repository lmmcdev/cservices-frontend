// src/context/monthlyStatsContext.js
import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { monthlyStatsReducer, initialMonthlyStatsState } from '../store/statsMonthlyReducer';
import { useApiHandlers } from '../utils/js/apiActions';

const MonthlyStatsContext = createContext(undefined);

export const MonthlyStatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(monthlyStatsReducer, initialMonthlyStatsState);
  const { getMonthlyStatsHandler } = useApiHandlers();

  // Mantener handler estable
  const handlerRef = useRef(getMonthlyStatsHandler);
  useEffect(() => { handlerRef.current = getMonthlyStatsHandler; }, [getMonthlyStatsHandler]);

  // Ignorar respuestas viejas
  const reqIdRef = useRef(0);

  const fetchMonthlyStatsMTD = useCallback(async (monthOrDate) => {
    const myReqId = ++reqIdRef.current;
    try {
      const res = await handlerRef.current(monthOrDate);
        console.log(res?.results[0].doc);
        const data = res?.results[0].doc;
      if (myReqId !== reqIdRef.current) return res; // respuesta obsoleta

      if (res?.success) {
        dispatch({ type: 'SET_MONTHLY_STATS', payload: data });
      } else {
        dispatch({ type: 'SET_MONTHLY_ERROR', payload: res?.message || 'Failed to load monthly stats' });
      }
      return res;
    } catch (e) {
      if (myReqId !== reqIdRef.current) return { success: false, message: 'Stale response ignored' };
      const msg = e?.message || 'Failed to load monthly stats';
      dispatch({ type: 'SET_MONTHLY_ERROR', payload: msg });
      return { success: false, message: msg };
    }
  }, []); // 👈 estable

  const value = useMemo(() => ({
    state,
    dispatch,
    fetchMonthlyStatsMTD,
  }), [state, fetchMonthlyStatsMTD]);

  return (
    <MonthlyStatsContext.Provider value={value}>
      {children}
    </MonthlyStatsContext.Provider>
  );
};

// Hook raíz
export const useMonthlyStats = () => {
  const ctx = useContext(MonthlyStatsContext);
  if (!ctx) throw new Error('useMonthlyStats must be used within MonthlyStatsProvider');
  return ctx;
};

// ----------------- SELECTORES (sin hooks en condicionales) -----------------

// Doc mensual completo
export const useMonthlyDoc = () => {
  const { state } = useMonthlyStats();
  return state.monthly_doc || {};
};

// Conteo por status (para StatusFilterBoxes)
export const useMonthlyStatusCounts = () => {
  const doc = useMonthlyDoc();
  return doc.statusCounts || {};
};

// Top agents
export const useMonthlyAgentStats = () => {
  const doc = useMonthlyDoc();
  const list = doc.agentStats;
  return Array.isArray(list) ? list : [];
};

// Daily breakdown (por día del mes)
export const useMonthlyDailyBreakdown = () => {
  const doc = useMonthlyDoc();
  const list = doc.dailyBreakdown;
  console.log("Monthly daily breakdown:", list);
  return Array.isArray(list) ? list : [];
};

// Daily breakdown (por hora del mes)
export const useMonthlyHourBreakdown = () => {
  const doc = useMonthlyDoc();
  const list = doc.hourlyBreakdown;
  console.log("Monthly hourly breakdown:", list);
  return Array.isArray(list) ? list : [];
};


// Global stats
export const useMonthlyGlobalStats = () => {
  const doc = useMonthlyDoc();
  return doc.globalStats || { avgResolutionTimeMins: 0, resolvedCount: 0 };
};
export const useMonthlyAvgResolutionTime = () => {
  const global = useMonthlyGlobalStats();
  return global.avgResolutionTimeMins || 0;
};

// AI classification (priority/risk/category)
export const useMonthlyAIStats = () => {
  const doc = useMonthlyDoc();
  return doc.aiClassificationStats || { priority: {}, risk: {}, category: {} };
};

// Conveniencia
export const useMonthlyRiskStat = () => {
  const ai = useMonthlyAIStats();
  return ai.risk || {};
};
export const useMonthlyPriorityStat = () => {
  const ai = useMonthlyAIStats();
  return ai.priority || {};
};
export const useMonthlyCategoryStat = () => {
  const ai = useMonthlyAIStats();
  return ai.category || {};
};


