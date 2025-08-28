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
  SWITCHBOARD: {
    AGENTS: '84a3609f-65c5-4353-b0a8-530e7f22907e',
    SUPERVISORS: '4103988e-0a39-4a6c-aa39-e0c1fad5cf95',
    REMOTE: 'b5adb985-0d20-4078-916d-126b07fafeda'
  },
  HIALEAHCENTER: { AGENTS: 'efef4665-2646-407f-82aa-1d82505f3db5'},
};

export const DEFAULT_AGENT_GROUPS = [
  GROUP_IDS.SWITCHBOARD.AGENTS,
  GROUP_IDS.SWITCHBOARD.SUPERVISORS,
  GROUP_IDS.SWITCHBOARD.REMOTE,
  GROUP_IDS.HIALEAHCENTER.AGENTS
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
        'Hiatus',
        'MARLINS PARK',
        'MIAMI GARDENS',
        'North Miami Beach MC',
        'WEST PALM BEACH',
        'WESTCHESTER',
        'Referrals', 'OTC', 'Pharmacy',
];

export const CATEGORY_OPTS = [
  'transport',
  'appointment',
  'new patient',
  'disenrollment',
  'customer service',
  'new address',
  'hospitalization',
  'others',
];

export const RISK_OPTS = ['none', 'legal', 'disenrollment'];
export const PRIORITY_OPTS = ['high', 'medium', 'low'];
