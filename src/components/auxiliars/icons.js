//Para importar la libreria Feather
import { UserPlus } from 'react-feather';

//Para importar los iconos de Font Awesome v6
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

//Para importar los iconos de Material UI
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
//import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

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
    //Material UI
    filterOn: FilterListOffIcon,
    filterOff: FilterListIcon,
    collapseLeft: KeyboardDoubleArrowLeftIcon,
    collapseRight: KeyboardDoubleArrowRightIcon, 
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
    //Font Awesome v4
    supervisorView: FaUsersV4,
};


