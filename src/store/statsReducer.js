//PASAR PARA ACA TODOS LOS ESTADOS DE ESTADISTICAS
export const initialDailyStatsState = {
  daily_statistics: null,
  historic_daily_stats: null,
  error: null,
};

export const dailyStatsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATS':
      return {
        ...state,
        statistics: action.payload,
        error: null,
      };

    case 'SET_HISTORICAL_STATS':
      return {
        ...state,
        historical_statistics: action.payload,
        error: null,
      };

    case 'SET_CLOSED_TICKETS':
      return {
        ...state,
        closedTickets_statistics: action.payload,
        error: null,
      };

  case 'SET_HISTORICAL_CLOSED_TICKETS':
      return {
        ...state,
        closedHistoricalTickets_statistics: action.payload,
        error: null,
      };

    case 'SET_DAILY_STATS':
      return {
        ...state,
        daily_statistics: action.payload,
        error: null,
      };

    case 'SET_HISTORIC_DAILY_STATS':
      return {
        ...state,
        historic_daily_stats: action.payload,
        error: null,
      };
    default:
      return state;
  }
};
