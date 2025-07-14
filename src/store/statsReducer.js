//PASAR PARA ACA TODOS LOS ESTADOS DE ESTADISTICAS
export const initialDailyStatsState = {
  daily_statistics: null,
  historic_daily_stats: null,
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

      case 'SET_HISTORIC_DAILY_STATS':
        console.log(action.payload)
      return {
        ...state,
        historic_daily_stats: action.payload,
        error: null,
      };
    default:
      return state;
  }
};
