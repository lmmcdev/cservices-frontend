import { PRIORITY_OPTS } from '../../utils/js/constants';
import { EnumSelectCompact } from '../auxiliars/tickets/enumSelectCompacts';


export function PrioritySelect(props) {
    return (
        <EnumSelectCompact
            options={PRIORITY_OPTS}
            {...props}
        />
    );
}