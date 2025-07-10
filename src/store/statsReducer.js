export const initialDailyStatsState = {
  daily_statistics: null,
  error: null,
};

export const dailyStatsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DAILY_STATS':
        console.log(action.payload)
      return {
        ...state,
        daily_statistics: action.payload,
        error: null,
      };
    default:
      return state;
  }
};
