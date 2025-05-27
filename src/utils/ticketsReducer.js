// utils/ticketsReducer.js
export const initialState = {
  tickets: [],
  error: null,
};

export const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKETS':
      return {
        ...state,
        tickets: action.payload,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
