//generate literal constants
export const TICKET_ACTIONS = {
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_TICKET_DATA: 'SET_TICKET_DATA',
  // Add more constants as needed
};

export const ENDPOINT_URLS = {
    API: 'https://cservicesapi.azurewebsites.net/api',
    SIGNALR: 'https://signalrcservices.azurewebsites.net/api',
    SIGNALRGROUPS: 'https://signalrcservices.azurewebsites.net/api'
};

//GRUPOS DE SEGURIDAD DE AZURE
export const GROUP_IDS = {
  CUSTOMER_SERVICE: {
    AGENTS: '84a3609f-65c5-4353-b0a8-530e7f22907e',
    SUPERVISORS: '4103988e-0a39-4a6c-aa39-e0c1fad5cf95',
    REMOTE: 'b5adb985-0d20-4078-916d-126b07fafeda'
  },
  // REFERRALS: { AGENTS: '...', SUPERVISORS: '...' },
};

export const DEFAULT_AGENT_GROUPS = [
  GROUP_IDS.CUSTOMER_SERVICE.AGENTS,
  GROUP_IDS.CUSTOMER_SERVICE.SUPERVISORS,
  GROUP_IDS.CUSTOMER_SERVICE.REMOTE
];

export const defaultLocationOptions = [
  'BIRD ROAD',
        'EAST HIALEAH',
        'HOLLYWOOD',
        'HOMESTEAD',
        'MIAMI 27TH AVE',
        'PEMBROKE PINES',
        'PLANTATION',
        'TAMARAC',
        'WEST HIALEAH',
        'WEST KENDALL','CUTLER RIDGE',
        'HIALEAH',
        'HIATUS',
        'MARLINS PARK',
        'MIAMI GARDENS',
        'N MIAMI BEACH - 2ND FLOOR',
        'WEST PALM BEACH',
        'WESTCHESTER',
        'Referrals', 'OTC', 'Pharmacy',
];