// utils/ticketsReducer.js
export const initialState = {
  tickets: [],
  agents: [],
  updated_agent: [],
  updated_action: [],
  statistics:[],
  historical_statistics: [],
  closedTickets_statistics: [],
  closedHistoricalTickets_statistics: [],
  error: null,
};

export const ticketReducer = (state, action) => {
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

    case 'SET_TICKETS':
      return {
        ...state,
        tickets: action.payload,
        error: null,
      };

    case 'ADD_TICKET':
      const exists = state.tickets.some(t => t.id === action.payload.id);
      if (exists) return state; // No duplicar

      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
      };

    case 'UPD_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        )
      };


    //agents
    case 'SET_AGENTS':
      return {
        ...state,
        agents: action.payload,
        error: null,
      };


    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    
    case 'SET_A_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'ASSIGN_AGENT':
      return {
    ...state,
      tickets: state.tickets.map(ticket =>
        ticket.id === action.payload.id
          ? { ...ticket, agent_assigned: action.payload.targetAgentEmail }
          : ticket
      ),
    };



    case 'SET_ASSIGNMENT_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_STATUS':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
        ticket.id === action.payload.id
          ? { ...ticket, status: action.payload.status }
          : ticket
        ),
      };

    case 'AGENT_EDITED':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? { ...agent, ...action.payload } : agent
        ),
      };

    case 'AGENT_CREATED':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };


    case 'SET_UPDATE_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };
    case 'SET_NOTE_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_COLLABORATORS':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };
    case 'SET_COLLABORATOR_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_TICKET_DEPARTMENT':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };
    case 'SET_DEPARTMENT_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_PATIENT_NAME':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };
    case 'SET_PATIENT_NAME_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'UPDATE_PATIENT_BOD':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };

    case 'UPDATE_PATIENT_PHONE':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };

    case 'TICKET_CREATED':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };
    
    

    case 'SET_PHONE_CALLS_HISTORY':
      return {
        ...state,
        updated_action: action.payload,
        error: null,
      };

    default:
      return state;
  }
};
