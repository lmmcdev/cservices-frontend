import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ElderlyIcon from '@mui/icons-material/Elderly';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HelpIcon from '@mui/icons-material/Help';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export function ticketIndicatorsUtilities(category) {
const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'transport': return <DepartureBoardIcon fontSize="small" />;
    case 'appointment': return <CalendarMonthIcon fontSize="small" />;
    case 'new patient': return <ElderlyIcon fontSize="small" />;
    case 'disenrollment': return <NoAccountsIcon fontSize="small" />;
    case 'customer service': return <SupportAgentIcon fontSize="small" />;
    case 'new address': return <AddLocationAltIcon fontSize="small" />;
    case 'hospitalization': return <LocalHospitalIcon fontSize="small" />;
    case 'others': return <HelpIcon fontSize="small" />;
    default: return <HelpIcon fontSize="small" />;
  }
};


  return [
    getCategoryIcon(category)
  ];
}





