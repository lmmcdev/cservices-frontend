//Para importar los iconos de Font Awesome v6
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

//Para importar los iconos de Material UI
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

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

//Para importar la libreria Font Awesome v4 como componentes perzonalizados
const FaUsersV4 = (props) => (
  <i className="fa fa-users" {...props}></i>
);

export const icons = {
    //Font Awesome v6
    edit: faPenToSquare,
    //Material UI
    filterOn: FilterListOffIcon,
    filterOff: FilterListIcon,
    collapseLeft: KeyboardDoubleArrowLeftIcon,
    collapseRight: KeyboardDoubleArrowRightIcon, 
    //Bootstrap
    addCase: TelephonePlusIcon,
    callLogs: TelephoneIcon,
    team: PeopleIcon,
    dashboard: DashboardIcon,
    //Font Awesome v4
    supervisorView: FaUsersV4,
};


