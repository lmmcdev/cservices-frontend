//Para importar la libreria Feather
import { UserPlus } from 'react-feather';

//Para importar los iconos de Font Awesome v6
import { faArrowUp, faArrowDown, faUserMd } from '@fortawesome/free-solid-svg-icons';

//Para importar los iconos de Material UI
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import HelpIcon from '@mui/icons-material/Help';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ApartmentIcon from '@mui/icons-material/Apartment';
//import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ElderlyIcon from '@mui/icons-material/Elderly';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// ===== Iconify (SVG, enorme set de íconos, incluye Material Symbols y MDI) =====
import { Icon as IconifyIcon } from '@iconify/react';

// Wrapper para usar Iconify como un componente común en tu app
export const Iconify = (props) => <IconifyIcon {...props} />;

//Para importar la libreria Bootstrap como componentes perzonalizados
const TelephonePlusIcon = (props) => (
  <i className="bi bi-telephone-plus-fill" {...props}></i>
);
const TelephoneIcon = (props) => (
  <i className="bi bi-telephone-fill" {...props}></i>
);
const PeopleIcon = (props) => (
  <i className="bi bi-people-fill" {...props}></i>
);
const DashboardIcon = (props) => (
  <i className="bi bi-bar-chart-line-fill" {...props}></i>
);
const PencilIcon = (props) => (
  <i className="bi bi-pencil" {...props}></i>
);
const LockIcon = (props) => (
  <i className="fa fa-lock" {...props}></i>
);
const UnlockIcon = (props) => (
  <i className="fa fa-unlock" {...props}></i>
);

//Para importar la libreria Font Awesome v4 como componentes perzonalizados
const FaUsersV4 = (props) => (
  <i className="fa fa-users" {...props}></i>
);

export const icons = {
  //Feather
  assignToMe: UserPlus,
  //Font Awesome v6
  arrowUp: faArrowUp,
  arrowDown: faArrowDown,
  doctor: faUserMd,
  //Material UI
  filterOn: FilterListOffIcon,
  filterOff: FilterListIcon,
  collapseLeft: KeyboardDoubleArrowLeftIcon,
  collapseRight: KeyboardDoubleArrowRightIcon,
  onSite: ApartmentIcon, 
  priority: FlagIcon,
  risk: ReportProblemIcon,
  appointment: CalendarMonthIcon,
  transport: DepartureBoardIcon,
  disenrollment: NoAccountsIcon,
  others: HelpIcon,
  new_address: AddLocationAltIcon,
  hospitalization: LocalHospitalIcon,
  customer_service: SupportAgentIcon,
  new_patient: ElderlyIcon,
  //assignToMe: GroupAddIcon,
  addCollaborator: PersonAddIcon,
  searchIcon: SearchIcon,
  searchOffIcon: SearchOffIcon,
  home: HomeIcon,
  business: BusinessIcon,
  //Bootstrap
  addCase: TelephonePlusIcon,
  callLogs: TelephoneIcon,
  team: PeopleIcon,
  dashboard: DashboardIcon,
  edit: PencilIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  //Font Awesome v4
  supervisorView: FaUsersV4,
};

export const flags = {
  us: '/flags/us.svg',
  es: '/flags/es.svg',
};
