import { RISK_OPTS } from '../../utils/js/constants';
import { EnumSelectCompact } from '../auxiliars/tickets/enumSelectCompacts';


export function RiskSelect(props) {
    return (
        <EnumSelectCompact
            options={RISK_OPTS}
            {...props}
        />
    );
}