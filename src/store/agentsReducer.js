// src/store/agentsReducer.js
export const initialAgentsState = {
  agents: [],
  error: null,
  _agentsVersion: 0, // para selectores memoizados
};

export function agentsReducer(state, action) {
  switch (action.type) {
    case 'SET_AGENTS': {
      const next = Array.isArray(action.payload) ? action.payload : [];
      // Evita rerender innecesario si es exactamente la misma referencia
      if (state.agents === next) return state;
      return {
        ...state,
        agents: next,
        error: null,
        _agentsVersion: state._agentsVersion + 1,
      };
    }

    case 'SET_AGENTS_ERROR':
      return { ...state, error: action.payload ?? 'Unknown error' };

    default:
      return state;
  }
}
