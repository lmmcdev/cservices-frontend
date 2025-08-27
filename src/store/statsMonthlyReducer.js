// Estado & reducer para estadísticas MENSUALES (MTD o final)

export const initialMonthlyStatsState = {
  monthly_doc: null,   // documento mensual completo (agentStats, dailyBreakdown, globalStats, statusCounts, aiClassificationStats)
  error: null,
};

export function monthlyStatsReducer(state, action) {
  switch (action.type) {
    case 'SET_MONTHLY_STATS': {
      // payload esperado: { success: true, data: <doc mensual> } o directamente el doc
      const doc = action.payload?.data || action.payload || null;
      return { ...state, monthly_doc: doc, error: null };
    }
    case 'SET_MONTHLY_ERROR': {
      return { ...state, error: action.payload || 'Unknown error' };
    }
    default:
      return state;
  }
}
