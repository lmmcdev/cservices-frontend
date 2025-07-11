//PASAR PARA ACA TODOS LOS ESTADOS DE ESTADISTICAS
export const initialDailyStatsState = {
  daily_statistics: null,
  error: null,
};

export const dailyStatsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DAILY_STATS':
      return {
        ...state,
        daily_statistics: action.payload,
        error: null,
      };
    default:
      return state;
  }
};
