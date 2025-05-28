// utils/ticketsReducer.js
export const initialState = {
  tickets: [],
  agents: [],
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

    //agents
    case 'SET_AGENTS':
      return {
        ...state,
        agents: action.payload,
        error: null,
      };
    case 'SET_A_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
