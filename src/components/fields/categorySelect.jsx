import React from 'react';
import { CATEGORY_OPTS } from '../../utils/js/constants';
import { getCategoryIcon } from '../../utils/js/ticketIndicatorGetCatIcon';
import { EnumSelectCompact } from '../auxiliars/tickets/enumSelectCompacts';


export function CategorySelect(props) {
    const opts = (CATEGORY_OPTS || []).map((v) => ({
        value: v,
        label: v,
        icon: React.cloneElement(getCategoryIcon(v), { sx: { fontSize: 16 } }),
    }));
    return (
        <EnumSelectCompact
            options={opts}
            {...props}
        />
    );
}